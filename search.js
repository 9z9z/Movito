import { fetchFromTMDB } from './utils.js';
const input = document.getElementById('search-input');
const results = document.getElementById('results');

input.addEventListener('input', async () => {
  const q = input.value;
  if (q.length < 2) return;
  const data = await fetchFromTMDB(`/search/multi&query=${encodeURIComponent(q)}`);
  results.innerHTML = '';
  data.results.forEach(item => {
    const div = document.createElement('div');
    div.className = 'card';
    const name = item.title || item.name;
    const img = item.poster_path || item.profile_path;
    const link = item.media_type === 'movie'
      ? `movieDetail.html?id=${item.id}`
      : item.media_type === 'tv'
        ? `TvShowsDetails.html?id=${item.id}`
        : `personDetail.html?id=${item.id}`;
    div.innerHTML = `
      <a href="${link}">
        <img src="https://image.tmdb.org/t/p/w200${img}" />
        <h4>${name}</h4>
      </a>
    `;
    results.appendChild(div);
  });
});