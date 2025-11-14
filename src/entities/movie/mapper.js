// безопасно нормализуем поля для UI
export function mapMovie(dto = {}) {
  const imdbId = dto.imdbId || dto.imdbID || null;
  const title = dto.title || dto.Title || 'Без названия';
  const poster = dto.posterUrl || dto.Poster || null;
  const genre = (dto.genre && dto.genre.name) || dto.genreText || dto.Genre || '';
  const yearRaw = dto.year || dto.Year || dto.year;
  const year = typeof yearRaw === 'number' ? yearRaw : parseInt(String(yearRaw || '').replace(/\D/g, ''), 10) || null;
  const imdbRating = dto.imdbRating ? Number(dto.imdbRating) : (dto.imdb_rating ? Number(dto.imdb_rating) : null);
  const runtime = dto.runtime || dto.Runtime || null;
  const description = dto.description || dto.Plot || dto.plot || '';
  return { imdbId, title, poster, genre, year, imdbRating, runtime, description, raw: dto };
}
