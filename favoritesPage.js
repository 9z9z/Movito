import { isInList, getList } from './favorites.js';

const favListEl = document.getElementById('fav-list');

function renderFavorites() {
  const favorites = getList('movito_favorites');
  if (favorites.length === 0) {
    favListEl.innerHTML = '<p>لا يوجد عناصر في المفضلة.</p>';
    return;
  }
  favListEl.innerHTML = favorites.map(item => {
    const imgSrc = item.poster_path ? `https://image.tmdb.org/t/p/w300${item.poster_path}` : '../assets/fallback.png';
    const title = item.title || item.name || 'بدون عنوان';
    return `
      <div class="card" data-id="${item.id}" data-type="${item.type}">
        <img src="${imgSrc}" alt="${title}" />
        <h4>${title}</h4>
      </div>
    `;
  }).join('');
}

renderFavorites();
