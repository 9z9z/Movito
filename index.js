import { fetchFromTMDB } from './utils.js';

async function renderTrending() {
  const container = document.getElementById('trending');
  try {
    const data = await fetchFromTMDB('/trending/all/week');
    container.innerHTML = data.results.map(item => {
      const title = item.title || item.name || 'بدون عنوان';
      const poster = item.poster_path
        ? `https://image.tmdb.org/t/p/w300${item.poster_path}`
        : 'assets/fallback.png';
      const id = item.id;
      const type = item.media_type || (item.title ? 'movie' : 'tv');
      const link = type === 'movie'
        ? `html/movieDetail.html?id=${id}`
        : type === 'tv'
          ? `html/TvShowsDetails.html?id=${id}`
          : '#';

      return `
        <div class="card">
          <a href="${link}">
            <img src="${poster}" alt="${title}" />
            <h4>${title}</h4>
          </a>
        </div>
      `;
    }).join('');
  } catch (err) {
    container.innerHTML = '<p>خطأ في تحميل البيانات</p>';
    console.error(err);
  }
}

renderTrending();
