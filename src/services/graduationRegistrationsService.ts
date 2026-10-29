import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  DbGraduationRegistration,
  GraduationPaymentStatus,
  DbEvent,
  DbStudent,
} from '../types/database';
import { PaginatedResult } from './eventsService';
import { studentsService } from './studentsService';
import { generateSlug } from '../utils/slug';

export interface GraduationRegistrationWithEvent extends DbGraduationRegistration {
  event?: Pick<DbEvent, 'id' | 'title' | 'slug' | 'category' | 'event_date'> | null;
}

export interface GraduationRegistrationsFilter {
  page?: number;
  pageSize?: number;
  eventId?: string;
  startDate?: string;
  endDate?: string;
  paymentStatus?: GraduationPaymentStatus | 'all';
  targetKhan?: number | 'all';
  search?: string;
}

export interface GraduationStats {
  total: number;
  paid: number;
  pending: number;
}

export interface UpdateGraduationRegistrationInput {
  id: string;
  target_khan: number;
  full_name?: string;
  current_khan_at_registration?: number | null;
  payment_status?: GraduationPaymentStatus;
}

export const graduationRegistrationsService = {
  /**
   * Constrói a consulta base aplicando todos os filtros informados
   */
  _buildBaseQuery(filter: GraduationRegistrationsFilter = {}) {
    let query = supabase
      .from('graduation_registrations')
      .select(
        `
        id,
        event_id,
        student_id,
        full_name,
        current_khan_at_registration,
        target_khan,
        payment_status,
        paid_at,
        paid_by,
        created_at,
        updated_at,
        event:events!inner(
          id,
          title,
          slug,
          category,
          event_date
        )
      `,
        { count: 'exact' }
      );

    // Filtro por evento específico
    if (filter.eventId && filter.eventId !== 'all') {
      query = query.eq('event_id', filter.eventId);
    }

    // Filtro por data de início do evento
    if (filter.startDate) {
      query = query.gte('event.event_date', new Date(filter.startDate).toISOString());
    }

    // Filtro por data de término do evento
    if (filter.endDate) {
      // Ajusta para o final do dia se for apenas YYYY-MM-DD
      const endIso = filter.endDate.includes('T')
        ? new Date(filter.endDate).toISOString()
        : new Date(`${filter.endDate}T23:59:59.999Z`).toISOString();
      query = query.lte('event.event_date', endIso);
    }

    // Filtro por status de pagamento
    if (filter.paymentStatus && filter.paymentStatus !== 'all') {
      query = query.eq('payment_status', filter.paymentStatus);
    }

    // Filtro por Khan pretendido
    if (filter.targetKhan && filter.targetKhan !== 'all') {
      query = query.eq('target_khan', Number(filter.targetKhan));
    }

    // Busca textual pelo nome do inscrito
    if (filter.search?.trim()) {
      query = query.ilike('full_name', `%${filter.search.trim()}%`);
    }

    return query;
  },

  /**
   * Lista inscrições com paginação server-side para o painel administrativo
   */
  async getRegistrations(
    filter: GraduationRegistrationsFilter = {}
  ): Promise<PaginatedResult<GraduationRegistrationWithEvent>> {
    if (!isSupabaseConfigured) {
      return { data: [], count: 0, page: 1, pageSize: 15, totalPages: 1 };
    }

    const page = Math.max(1, filter.page || 1);
    const pageSize = filter.pageSize || 15;
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    const query = this._buildBaseQuery(filter)
      .order('created_at', { ascending: false })
      .range(from, to);

    const { data, count, error } = await query;

    if (error) {
      if (error.message?.includes('graduation_registrations')) {
        throw new Error('A tabela de inscrições para graduação não existe. Aplique a migration 007_graduation_registrations.sql.');
      }
      throw new Error(`Erro ao listar inscrições: ${error.message}`);
    }

    const totalCount = count || 0;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

    return {
      data: (data || []) as GraduationRegistrationWithEvent[],
      count: totalCount,
      page,
      pageSize,
      totalPages,
    };
  },

  /**
   * Retorna TODOS os registros filtrados (sem limite de página) para exportação em Word, PDF e Excel
   */
  async getAllFilteredRegistrations(
    filter: GraduationRegistrationsFilter = {}
  ): Promise<GraduationRegistrationWithEvent[]> {
    if (!isSupabaseConfigured) return [];

    const query = this._buildBaseQuery(filter).order('created_at', { ascending: false });
    const { data, error } = await query;

    if (error) {
      throw new Error(`Erro ao buscar dados para exportação: ${error.message}`);
    }

    return (data || []) as GraduationRegistrationWithEvent[];
  },

  /**
   * Calcula contadores (total, pagos, pendentes) para os filtros aplicados
   */
  async getStats(filter: GraduationRegistrationsFilter = {}): Promise<GraduationStats> {
    if (!isSupabaseConfigured) {
      return { total: 0, paid: 0, pending: 0 };
    }

    // Busca todos os registros correspondentes aos filtros sem paginação para contar
    const all = await this.getAllFilteredRegistrations(filter);
    const total = all.length;
    const paid = all.filter((r) => r.payment_status === 'paid').length;
    const pending = total - paid;

    return { total, paid, pending };
  },

  /**
   * Altera manualmente o status de pagamento de uma inscrição via RPC segura
   */
  async setPaymentStatus(registrationId: string, isPaid: boolean): Promise<boolean> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    const { error } = await supabase.rpc('set_graduation_registration_paid', {
      p_registration_id: registrationId,
      p_is_paid: isPaid,
    });

    if (error) {
      throw new Error(`Erro ao atualizar pagamento: ${error.message}`);
    }

    return true;
  },

  /**
   * Atualiza dados de uma inscrição (Khan pretendido, nome, Khan atual ou status)
   * Utilizado por usuários cadastrados (administradores) para corrigir erros de candidatos
   */
  async updateRegistration(input: UpdateGraduationRegistrationInput): Promise<boolean> {
    if (input.target_khan < 1 || input.target_khan > 16) {
      throw new Error('O Khan pretendido deve estar entre 1 e 16.');
    }

    if (
      input.current_khan_at_registration !== undefined &&
      input.current_khan_at_registration !== null &&
      (input.current_khan_at_registration < 1 || input.current_khan_at_registration > 16)
    ) {
      throw new Error('O Khan atual deve estar entre 1 e 16.');
    }

    if (input.full_name !== undefined) {
      const trimmed = input.full_name.trim();
      if (!trimmed) {
        throw new Error('O nome do candidato não pode ficar vazio.');
      }
    }

    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    const payload: Record<string, unknown> = {
      target_khan: Number(input.target_khan),
    };

    if (input.full_name !== undefined) {
      payload.full_name = input.full_name.trim();
    }

    if (input.current_khan_at_registration !== undefined) {
      payload.current_khan_at_registration = input.current_khan_at_registration;
    }

    if (input.payment_status !== undefined) {
      payload.payment_status = input.payment_status;
      if (input.payment_status === 'paid') {
        payload.paid_at = new Date().toISOString();
      } else {
        payload.paid_at = null;
        payload.paid_by = null;
      }
    }

    const { error } = await supabase
      .from('graduation_registrations')
      .update(payload)
      .eq('id', input.id);

    if (error) {
      throw new Error(`Erro ao atualizar candidatura: ${error.message}`);
    }

    return true;
  },

  /**
   * Converte uma inscrição de nome manual em aluno cadastrado oficial no sistema
   * Cria o registro em students e vincula o student_id na inscrição
   */
  async convertManualRegistrationToStudent(
    registrationId: string,
    initialKhan?: number
  ): Promise<DbStudent> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    // Busca os dados da inscrição
    const { data: reg, error: fetchErr } = await supabase
      .from('graduation_registrations')
      .select('id, full_name, current_khan_at_registration, student_id')
      .eq('id', registrationId)
      .single();

    if (fetchErr || !reg) {
      throw new Error('Inscrição não encontrada.');
    }

    if (reg.student_id) {
      throw new Error('Esta inscrição já está vinculada a um aluno cadastrado.');
    }

    const candidateName = reg.full_name.trim();
    if (!candidateName) {
      throw new Error('Nome do candidato inválido.');
    }

    const resolvedKhan =
      initialKhan !== undefined && initialKhan >= 1 && initialKhan <= 16
        ? initialKhan
        : reg.current_khan_at_registration &&
          reg.current_khan_at_registration >= 1 &&
          reg.current_khan_at_registration <= 16
        ? reg.current_khan_at_registration
        : 1;

    // Gera slug único com sufixo alfanumérico para evitar conflitos
    const baseSlug = generateSlug(candidateName);
    const uniqueSlug = `${baseSlug}-${Math.random().toString(36).substring(2, 6)}`;

    // Cria o novo aluno no sistema
    const newStudent = await studentsService.createStudent({
      name: candidateName,
      slug: uniqueSlug,
      current_khan: resolvedKhan,
      is_active: true,
      is_published: true,
    });

    // Atualiza a inscrição vinculando ao novo aluno e gravando o snapshot do Khan atual caso estivesse vazio
    const { error: updateErr } = await supabase
      .from('graduation_registrations')
      .update({
        student_id: newStudent.id,
        current_khan_at_registration: resolvedKhan,
      })
      .eq('id', registrationId);

    if (updateErr) {
      throw new Error(
        `Aluno cadastrado com sucesso, mas ocorreu um erro ao vincular a inscrição: ${updateErr.message}`
      );
    }

    return newStudent;
  },
};
