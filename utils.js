export const apiKey = '6b2dec73b6697866a50cdaef60ccffcb';

export async function fetchFromTMDB(path) {
  const url = `https://api.themoviedb.org/3${path}?api_key=${apiKey}&language=ar`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('فشل في جلب البيانات من TMDB');
  return res.json();
}
