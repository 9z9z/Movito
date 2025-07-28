import { fetchFromTMDB } from './utils.js';
import { toggleItem, isInList } from './favorites.js';

const id = new URLSearchParams(location.search).get('id');
const container = document.getElementById('tv-details');

async function renderTVShowDetail() {
  try {
    const data = await fetchFromTMDB(`/tv/${id}?append_to_response=credits`);
    container.innerHTML = `
      <h1>${data.name}</h1>
      <p><strong>النوع:</strong> ${data.genres.map(g => g.name).join(', ')}</p>
      <p><strong>القصة:</strong> ${data.overview}</p>
      <p><strong>الممثلين:</strong> ${data.credits.cast.slice(0,5).map(c => `<a href="personDetail.html?id=${c.id}">${c.name}</a>`).join(', ')}</p>
      <button id="fav-btn">${isInList('movito_favorites', {id, type:'tv'}) ? '💔 إزالة من المفضلة' : '❤️ إضافة للمفضلة'}</button>
    `;
    document.getElementById('fav-btn').onclick = () => {
      toggleItem('movito_favorites', {id, type:'tv'});
      renderTVShowDetail();
    };
  } catch (err) {
    container.innerHTML = `<p>خطأ في تحميل بيانات المسلسل</p>`;
    console.error(err);
  }
}

renderTVShowDetail();
