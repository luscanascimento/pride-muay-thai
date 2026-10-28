/**
 * Utilitários para URLs de navegação e busca no Google Maps.
 */

/**
 * Constrói uma URL direta de busca no Google Maps a partir de um termo de localização,
 * endereço ou nome de local.
 *
 * @param query Texto da localização ou endereço (ex: "Ginásio Municipal, Jacareí - SP")
 * @returns URL formatada para busca no Google Maps
 */
export function getGoogleMapsSearchUrl(query: string): string {
  if (!query || !query.trim()) {
    return 'https://www.google.com/maps';
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query.trim())}`;
}
