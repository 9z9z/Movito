import { fetchFromTMDB } from './utils.js';
import { toggleItem, isInList } from './favorites.js';

async function render() {
  const trending = await fetchFromTMDB('/trending/all/week');
  const container = document.getElementById('trending');
  container.innerHTML = trending.results.map(renderCard).join('');
}

function renderCard(item) {
  return `
    <div class="card">
      <img src="https://image.tmdb.org/t/p/w200${item.poster_path}" />
      <h4>${item.title || item.name}</h4>
      <button class="fav-btn">${isInList('movito_favorites', item)?'💔':'❤️'}</button>
      <button class="wl-btn">${isInList('movito_watchlater', item)?'❌':'🕒'}</button>
    </div>
  `;
}

render();