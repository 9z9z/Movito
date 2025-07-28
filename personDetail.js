import { fetchFromTMDB } from './utils.js';

const id = new URLSearchParams(location.search).get('id');
const container = document.getElementById('person-detail');

async function renderPersonDetail() {
  try {
    const data = await fetchFromTMDB(`/person/${id}?append_to_response=movie_credits,tv_credits`);
    const movies = data.movie_credits.cast.map(i => `<a href="movieDetail.html?id=${i.id}">${i.title}</a>`).join('، ');
    const shows = data.tv_credits.cast.map(i => `<a href="TvShowsDetails.html?id=${i.id}">${i.name}</a>`).join('، ');
    container.innerHTML = `
      <h1>${data.name}</h1>
      <p><strong>أشهر الأفلام:</strong> ${movies}</p>
      <p><strong>أشهر المسلسلات:</strong> ${shows}</p>
    `;
  } catch(err) {
    container.innerHTML = '<p>خطأ في تحميل بيانات الشخص</p>';
    console.error(err);
  }
}

renderPersonDetail();
