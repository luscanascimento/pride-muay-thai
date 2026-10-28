import { GYMS_DATA } from '../data/gymsAndTeamData';
import { Gym } from '../types/gymsAndTeam';

/**
 * Retorna uma academia correspondente ao ID informado ou undefined
 */
export function getGymById(id: string): Gym | undefined {
  return GYMS_DATA.find((g) => g.id === id);
}

/**
 * Retorna o nome amigável de uma academia a partir do seu ID.
 * Se o ID não for de uma academia cadastrada, retorna o próprio texto (suporte a nomes customizados).
 */
export function getGymNameById(id: string): string {
  const gym = getGymById(id);
  return gym ? gym.name : id;
}

/**
 * Converte uma lista de IDs de academias em uma lista de nomes legíveis
 */
export function getGymNames(gymIds?: string[] | null): string[] {
  if (!gymIds || gymIds.length === 0) return [];
  return gymIds.map(getGymNameById);
}
