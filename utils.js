export const apiKey = '6b2dec73b6697866a50cdaef60ccffcb';
export async function fetchFromTMDB(path) {
  const res = await fetch(`https://api.themoviedb.org/3${path}?api_key=${apiKey}&language=ar`);
  return res.json();
}