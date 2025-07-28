import { fetchFromTMDB } from './utils.js';
import { toggleItem, isInList } from './favorites.js';

const id = new URLSearchParams(location.search).get('id');
const container = document.getElementById('movie-detail');

async function renderMovieDetail() {
  try {
    const data = await fetchFromTMDB(`/movie/${id}?append_to_response=credits,keywords`);
    container.innerHTML = `
      <h1>${data.title}</h1>
      <p><strong>القصة:</strong> ${data.overview}</p>
      <p><strong>النوع:</strong> ${data.genres.map(g => g.name).join(', ')}</p>
      <p><strong>الكلمات المفتاحية:</strong> ${data.keywords.keywords.map(k => k.name).join(', ')}</p>
      <p><strong>المخرج:</strong> ${data.credits.crew.filter(c => c.job === 'Director').map(d => d.name).join(', ')}</p>
      <div id="cast">
        <h3>الممثلين:</h3>
        ${data.credits.cast.slice(0, 5).map(c => `<a href="personDetail.html?id=${c.id}">${c.name}</a>`).join(', ')}
      </div>
      <button id="fav-btn">${isInList('movito_favorites', {id, type:'movie'}) ? '💔 إزالة من المفضلة' : '❤️ إضافة للمفضلة'}</button>
    `;
    document.getElementById('fav-btn').onclick = () => {
      toggleItem('movito_favorites', {id, type:'movie'});
      renderMovieDetail();
    };
  } catch (err) {
    container.innerHTML = `<p>خطأ في تحميل بيانات الفيلم</p>`;
    console.error(err);
  }
}

renderMovieDetail();
