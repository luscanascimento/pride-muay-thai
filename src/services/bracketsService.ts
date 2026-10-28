import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  DbEventBracket,
  CreateBracketInput,
  UpdateBracketInput,
  BracketRound,
} from '../types/brackets';

export const bracketsService = {
  /**
   * Busca todos os chaveamentos vinculados a um evento
   */
  async getBracketsByEventId(eventId: string): Promise<DbEventBracket[]> {
    if (!isSupabaseConfigured) return [];

    const { data, error } = await supabase
      .from('event_brackets')
      .select('*')
      .eq('event_id', eventId)
      .order('created_at', { ascending: true });

    if (error) {
      throw new Error(`Erro ao buscar chaveamentos do evento: ${error.message}`);
    }

    return (data || []) as unknown as DbEventBracket[];
  },

  /**
   * Cria um novo chaveamento vinculado obrigatoriamente a um evento
   */
  async createBracket(input: CreateBracketInput): Promise<DbEventBracket> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    const { data, error } = await supabase
      .from('event_brackets')
      .insert({
        event_id: input.event_id,
        title: input.title.trim(),
        category_name: input.category_name?.trim() || null,
        bracket_type: input.bracket_type || 'single_elimination',
        rounds: input.rounds as unknown as Record<string, unknown>[],
      })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erro ao criar chaveamento: ${error?.message || 'Falha ao salvar'}`);
    }

    return data as unknown as DbEventBracket;
  },

  /**
   * Atualiza um chaveamento existente
   */
  async updateBracket(input: UpdateBracketInput): Promise<DbEventBracket> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    const { id, ...updates } = input;
    const updatePayload: Record<string, unknown> = {};

    if (updates.title !== undefined) updatePayload.title = updates.title.trim();
    if (updates.category_name !== undefined)
      updatePayload.category_name = updates.category_name?.trim() || null;
    if (updates.bracket_type !== undefined) updatePayload.bracket_type = updates.bracket_type;
    if (updates.rounds !== undefined) updatePayload.rounds = updates.rounds;

    const { data, error } = await supabase
      .from('event_brackets')
      .update(updatePayload)
      .eq('id', id)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Erro ao atualizar chaveamento: ${error?.message || 'Falha ao atualizar'}`);
    }

    return data as unknown as DbEventBracket;
  },

  /**
   * Exclui um chaveamento
   */
  async deleteBracket(id: string): Promise<void> {
    if (!isSupabaseConfigured) {
      throw new Error('Supabase não configurado.');
    }

    const { error } = await supabase.from('event_brackets').delete().eq('id', id);

    if (error) {
      throw new Error(`Erro ao excluir chaveamento: ${error.message}`);
    }
  },

  /**
   * Gera uma estrutura pré-montada de chaveamento por quantidade de atletas
   */
  generateTemplateRounds(type: '2_fighters' | '4_fighters' | '8_fighters' | 'super_fights'): BracketRound[] {
    if (type === '2_fighters') {
      return [
        {
          round_index: 1,
          round_name: 'Final Direta',
          matches: [
            {
              id: 'm1-1',
              round_index: 1,
              match_number: 1,
              fighter_a: 'Atleta A (Corner Vermelho)',
              fighter_a_gym: '',
              fighter_b: 'Atleta B (Corner Azul)',
              fighter_b_gym: '',
              score_a: null,
              score_b: null,
              winner: null,
              win_method: null,
            },
          ],
        },
      ];
    }

    if (type === '4_fighters') {
      return [
        {
          round_index: 1,
          round_name: 'Semifinais',
          matches: [
            {
              id: 'm1-1',
              round_index: 1,
              match_number: 1,
              fighter_a: 'Lutador 1',
              fighter_a_gym: '',
              fighter_b: 'Lutador 2',
              fighter_b_gym: '',
              winner: null,
              next_match_id: 'm2-1',
            },
            {
              id: 'm1-2',
              round_index: 1,
              match_number: 2,
              fighter_a: 'Lutador 3',
              fighter_a_gym: '',
              fighter_b: 'Lutador 4',
              fighter_b_gym: '',
              winner: null,
              next_match_id: 'm2-1',
            },
          ],
        },
        {
          round_index: 2,
          round_name: 'Grande Final',
          matches: [
            {
              id: 'm2-1',
              round_index: 2,
              match_number: 1,
              fighter_a: 'Vencedor Semifinal 1',
              fighter_a_gym: '',
              fighter_b: 'Vencedor Semifinal 2',
              fighter_b_gym: '',
              winner: null,
            },
          ],
        },
      ];
    }

    if (type === '8_fighters') {
      return [
        {
          round_index: 1,
          round_name: 'Quartas de Final',
          matches: [
            {
              id: 'm1-1',
              round_index: 1,
              match_number: 1,
              fighter_a: 'Lutador 1',
              fighter_b: 'Lutador 2',
              winner: null,
              next_match_id: 'm2-1',
            },
            {
              id: 'm1-2',
              round_index: 1,
              match_number: 2,
              fighter_a: 'Lutador 3',
              fighter_b: 'Lutador 4',
              winner: null,
              next_match_id: 'm2-1',
            },
            {
              id: 'm1-3',
              round_index: 1,
              match_number: 3,
              fighter_a: 'Lutador 5',
              fighter_b: 'Lutador 6',
              winner: null,
              next_match_id: 'm2-2',
            },
            {
              id: 'm1-4',
              round_index: 1,
              match_number: 4,
              fighter_a: 'Lutador 7',
              fighter_b: 'Lutador 8',
              winner: null,
              next_match_id: 'm2-2',
            },
          ],
        },
        {
          round_index: 2,
          round_name: 'Semifinais',
          matches: [
            {
              id: 'm2-1',
              round_index: 2,
              match_number: 1,
              fighter_a: 'Vencedor QF 1',
              fighter_b: 'Vencedor QF 2',
              winner: null,
              next_match_id: 'm3-1',
            },
            {
              id: 'm2-2',
              round_index: 2,
              match_number: 2,
              fighter_a: 'Vencedor QF 3',
              fighter_b: 'Vencedor QF 4',
              winner: null,
              next_match_id: 'm3-1',
            },
          ],
        },
        {
          round_index: 3,
          round_name: 'Grande Final',
          matches: [
            {
              id: 'm3-1',
              round_index: 3,
              match_number: 1,
              fighter_a: 'Vencedor Semi 1',
              fighter_b: 'Vencedor Semi 2',
              winner: null,
            },
          ],
        },
      ];
    }

    // super_fights
    return [
      {
        round_index: 1,
        round_name: 'Card de Lutas Casadas',
        matches: [
          {
            id: 'm1-1',
            round_index: 1,
            match_number: 1,
            fighter_a: 'Atleta 1',
            fighter_a_gym: '',
            fighter_b: 'Atleta 2',
            fighter_b_gym: '',
            winner: null,
          },
          {
            id: 'm1-2',
            round_index: 1,
            match_number: 2,
            fighter_a: 'Atleta 3',
            fighter_a_gym: '',
            fighter_b: 'Atleta 4',
            fighter_b_gym: '',
            winner: null,
          },
          {
            id: 'm1-3',
            round_index: 1,
            match_number: 3,
            fighter_a: 'Atleta 5',
            fighter_a_gym: '',
            fighter_b: 'Atleta 6',
            fighter_b_gym: '',
            winner: null,
          },
        ],
      },
    ];
  },
};
