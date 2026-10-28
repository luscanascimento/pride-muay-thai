export type BracketWinner = 'a' | 'b' | null;

export interface BracketMatch {
  id: string;
  round_index: number;
  match_number: number;
  fighter_a: string;
  fighter_a_gym?: string;
  fighter_b: string;
  fighter_b_gym?: string;
  score_a?: string | null;
  score_b?: string | null;
  winner?: BracketWinner;
  win_method?: string | null; // ex: 'Pontos', 'KO', 'TKO', 'Desistência'
  next_match_id?: string | null;
}

export interface BracketRound {
  round_index: number;
  round_name: string; // ex: 'Quartas de Final', 'Semifinal', 'Final'
  matches: BracketMatch[];
}

export type BracketType = 'single_elimination' | 'super_fights' | 'round_robin';

export interface DbEventBracket {
  id: string;
  event_id: string;
  title: string;
  category_name: string | null;
  bracket_type: BracketType;
  rounds: BracketRound[];
  created_at: string;
  updated_at: string;
  created_by: string | null;
  updated_by: string | null;
  [key: string]: unknown;
}

export interface CreateBracketInput {
  event_id: string;
  title: string;
  category_name?: string | null;
  bracket_type?: BracketType;
  rounds: BracketRound[];
}

export interface UpdateBracketInput {
  id: string;
  title?: string;
  category_name?: string | null;
  bracket_type?: BracketType;
  rounds?: BracketRound[];
}
