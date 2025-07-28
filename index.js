import { fetchFromTMDB } from './utils.js';
import { toggleItem, isInList } from './favorites.js';

const container = document.getElementById('trending');

async function render() {
  try {
    const trending = await fetchFromTMDB('/trending/all/week');
    container.innerHTML = trending.results.map(renderCard).join('');
    addEventListeners();
  } catch (e) {
    container.innerHTML = `<p>خطأ في تحميل التريند: ${e.message}</p>`;
  }
}

function renderCard(item) {
  const imgSrc = item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : 'assets/fallback.png';
  const title = item.title || item.name || 'بدون عنوان';
  const id = item.id;
  const type = item.media_type || (item.first_air_date ? 'tv' : 'movie');

  return `
    <div class="card" data-id="${id}" data-type="${type}">
      <img src="${imgSrc}" alt="${title}" />
      <h4>${title}</h4>
      <button class="fav-btn">${isInList('movito_favorites', {id, type}) ? '💔' : '❤️'}</button>
      <button class="wl-btn">${isInList('movito_watchlater', {id, type}) ? '❌' : '🕒'}</button>
    </div>
  `;
}

function addEventListeners() {
  document.querySelectorAll('.fav-btn').forEach(btn => {
    btn.onclick = e => {
      e.stopPropagation();
      const card = btn.closest('.card');
      const id = +card.dataset.id;
      const type = card.dataset.type;
      toggleItem('movito_favorites', {id, type});
      btn.textContent = isInList('movito_favorites', {id, type}) ? '💔' : '❤️';
    };
  });

  document.querySelectorAll('.wl-btn').forEach(btn => {
    btn.onclick = e => {
      e.stopPropagation();
      const card = btn.closest('.card');
      const id = +card.dataset.id;
      const type = card.dataset.type;
      toggleItem('movito_watchlater', {id, type});
      btn.textContent = isInList('movito_watchlater', {id, type}) ? '❌' : '🕒';
    };
  });

  document.querySelectorAll('.card').forEach(card => {
    card.onclick = () => {
      const id = card.dataset.id;
      const type = card.dataset.type;
      if (type === 'movie') {
        location.href = `html/movieDetail.html?id=${id}`;
      } else if (type === 'tv') {
        location.href = `html/TvShowsDetails.html?id=${id}`;
      } else {
        location.href = `html/personDetail.html?id=${id}`;
      }
    };
  });
}

render();
