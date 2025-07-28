import { fetchFromTMDB } from './utils.js';

const input = document.getElementById('search-input');
const results = document.getElementById('results');

input.addEventListener('input', async () => {
  const q = input.value.trim();
  if (q.length < 2) {
    results.innerHTML = '';
    return;
  }
  try {
    const data = await fetchFromTMDB(`/search/multi&query=${encodeURIComponent(q)}`);
    results.innerHTML = data.results.map(item => {
      const name = item.title || item.name || 'بدون عنوان';
      const img = item.poster_path || item.profile_path || '';
      const imgSrc = img ? `https://image.tmdb.org/t/p/w200${img}` : 'assets/fallback.png';
      let link = '#';
      if (item.media_type === 'movie') link = `movieDetail.html?id=${item.id}`;
      else if (item.media_type === 'tv') link = `TvShowsDetails.html?id=${item.id}`;
      else if (item.media_type === 'person') link = `personDetail.html?id=${item.id}`;

      return `
        <div class="card">
          <a href="${link}">
            <img src="${imgSrc}" alt="${name}" />
            <h4>${name}</h4>
          </a>
        </div>
      `;
    }).join('');
  } catch (err) {
    results.innerHTML = '<p>خطأ في البحث</p>';
    console.error(err);
  }
});
