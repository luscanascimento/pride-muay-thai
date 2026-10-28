import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { DbStudent, DbStudentGraduation } from '../types/database';
import { PaginatedResult } from './eventsService';

export interface PublicStudentsFilter {
  page?: number;
  pageSize?: number;
  search?: string;
  khan?: number;
}

export interface AdminStudentsFilter {
  page?: number;
  pageSize?: number;
  search?: string;
  khan?: number;
  isActive?: boolean;
  isPublished?: boolean;
}

export interface StudentWithGraduations extends DbStudent {
  graduations: DbStudentGraduation[];
}

export interface CreateStudentInput {
  name: string;
  slug: string;
  current_khan: number;
  is_active?: boolean;
  is_published?: boolean;
  graduation_date?: string | null;
  gym_ids?: string[];
}

export interface UpdateStudentInput {
  id: string;
  name?: string;
  slug?: string;
  is_active?: boolean;
  is_published?: boolean;
  gym_ids?: string[];
}

export const studentsService = {
  /**
   * Lista alunos públicos (is_active = true e is_published = true) com paginação server-side
   */
  async getPublicStudents(filter: PublicStudentsFilter = {}): Promise<PaginatedResult<DbStudent>> {
    if (!isSupabaseConfigured) {
      return { data: [], count: 0, page: 1, pageSize: 12, totalPages: 1 };
    }

    const page = Math.max(1, filter.page || 1);
    const pageSize = filter.pageSize || 12;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('students')
      .select('*', { count: 'exact' })
      .eq('is_active', true)
      .eq('is_published', true)
      .order('name', { ascending: true });

    if (filter.khan && filter.khan >= 1 && filter.khan <= 16) {
      query = query.eq('current_khan', filter.khan);
    }

    if (filter.search?.trim()) {
      query = query.ilike('name', `%${filter.search.trim()}%`);
    }

    const { data, count, error } = await query.range(from, to);

    if (error) {
      throw new Error(`Erro ao buscar alunos: ${error.message}`);
    }

    const totalCount = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      data: data || [],
      count: totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Obtém detalhes de um aluno público pelo slug e todo o seu histórico de graduações
   */
  async getPublicStudentBySlug(slug: string): Promise<StudentWithGraduations | null> {
    if (!isSupabaseConfigured) return null;

    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('slug', slug)
      .eq('is_active', true)
      .eq('is_published', true)
      .maybeSingle();

    if (studentError || !student) {
      return null;
    }

    const { data: graduations, error: gradError } = await supabase
      .from('student_graduations')
      .select('*')
      .eq('student_id', student.id)
      .order('khan_level', { ascending: true });

    if (gradError) {
      throw new Error(`Erro ao buscar graduações do aluno: ${gradError.message}`);
    }

    return {
      ...student,
      graduations: graduations || [],
    };
  },

  /**
   * Lista alunos para o painel administrativo com paginação server-side e filtros
   */
  async getAdminStudents(filter: AdminStudentsFilter = {}): Promise<PaginatedResult<DbStudent>> {
    if (!isSupabaseConfigured) {
      return { data: [], count: 0, page: 1, pageSize: 12, totalPages: 1 };
    }

    const page = Math.max(1, filter.page || 1);
    const pageSize = filter.pageSize || 12;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let query = supabase
      .from('students')
      .select('*', { count: 'exact' })
      .order('name', { ascending: true });

    if (filter.khan && filter.khan >= 1 && filter.khan <= 16) {
      query = query.eq('current_khan', filter.khan);
    }

    if (filter.isActive !== undefined) {
      query = query.eq('is_active', filter.isActive);
    }

    if (filter.isPublished !== undefined) {
      query = query.eq('is_published', filter.isPublished);
    }

    if (filter.search?.trim()) {
      query = query.ilike('name', `%${filter.search.trim()}%`);
    }

    const { data, count, error } = await query.range(from, to);

    if (error) {
      throw new Error(`Erro ao buscar alunos administrativos: ${error.message}`);
    }

    const totalCount = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      data: data || [],
      count: totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Obtém aluno por ID com todas as graduações para edição no painel
   */
  async getStudentById(id: string): Promise<StudentWithGraduations | null> {
    if (!isSupabaseConfigured) return null;

    const { data: student, error: studentError } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (studentError || !student) {
      return null;
    }

    const { data: graduations, error: gradError } = await supabase
      .from('student_graduations')
      .select('*')
      .eq('student_id', student.id)
      .order('khan_level', { ascending: true });

    if (gradError) {
      throw new Error(`Erro ao buscar graduações: ${gradError.message}`);
    }

    return {
      ...student,
      graduations: graduations || [],
    };
  },

  /**
   * Cria um novo aluno e registra suas graduações cumulativas iniciais
   */
  async createStudent(input: CreateStudentInput): Promise<DbStudent> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    const { graduation_date, ...studentData } = input;

    const { data: student, error: createError } = await supabase
      .from('students')
      .insert({
        name: studentData.name,
        slug: studentData.slug,
        current_khan: studentData.current_khan,
        is_active: studentData.is_active ?? true,
        is_published: studentData.is_published ?? true,
        gym_ids: studentData.gym_ids ?? [],
      })
      .select()
      .single();

    if (createError || !student) {
      throw new Error(`Erro ao criar aluno: ${createError?.message}`);
    }

    // Registra graduações cumulativas do 1 até o current_khan através do RPC transacional
    await this.setStudentKhan(
      student.id,
      student.current_khan,
      graduation_date || null,
      false
    );

    return student;
  },

  /**
   * Atualiza informações cadastrais do aluno (nome, slug, ativo, publicado)
   */
  async updateStudent(input: UpdateStudentInput): Promise<DbStudent> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    const { id, ...updates } = input;

    const { data, error } = await supabase
      .from('students')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(`Erro ao atualizar aluno: ${error.message}`);
    }

    return data;
  },

  /**
   * Registra progressão ou correção de Khan via RPC transacional set_student_khan
   */
  async setStudentKhan(
    studentId: string,
    targetKhan: number,
    achievedAt: string | null = null,
    correctionMode: boolean = false
  ): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    const { error } = await supabase.rpc('set_student_khan', {
      target_student_id: studentId,
      target_khan: targetKhan,
      achieved_at_date: achievedAt,
      correction_mode: correctionMode,
    });

    if (error) {
      throw new Error(`Erro ao atualizar graduação do aluno: ${error.message}`);
    }
  },
};
