import { fetchFromTMDB } from './utils.js';
import { toggleItem, isInList } from './favorites.js';

const id = new URLSearchParams(location.search).get('id');
const titleEl = document.getElementById('title');
const overviewEl = document.getElementById('overview');
const posterEl = document.getElementById('poster');
const genresEl = document.getElementById('genres');
const directorsEl = document.getElementById('directors');
const castEl = document.getElementById('cast');
const keywordsEl = document.getElementById('keywords');
const watchServerEl = document.getElementById('watch-server');

let customData = {
  iframeSrc: '',
  title: '',
  description: '',
  keywords: '',
};

async function loadMovie() {
  try {
    const data = await fetchFromTMDB(`/movie/${id}?append_to_response=credits,keywords`);
    titleEl.textContent = data.title;
    overviewEl.textContent = data.overview;
    posterEl.src = data.poster_path ? `https://image.tmdb.org/t/p/w500${data.poster_path}` : '../assets/fallback.png';
    genresEl.textContent = 'النوع: ' + data.genres.map(g => g.name).join(', ');

    // مخرجين
    const directors = data.credits.crew.filter(c => c.job === 'Director');
    directorsEl.innerHTML = directors.map(d => `<li><a href="personDetail.html?id=${d.id}">${d.name}</a></li>`).join('');

    // ممثلين (5 الأوائل)
    const cast = data.credits.cast.slice(0, 5);
    castEl.innerHTML = cast.map(c => `<li><a href="personDetail.html?id=${c.id}">${c.name}</a></li>`).join('');

    // كلمات مفتاحية
    keywordsEl.innerHTML = data.keywords.keywords.map(k => `<li>${k.name}</li>`).join('');

    // استخدم السيرفر الافتراضي إذا موجود في localStorage
    const defaultServer = localStorage.getItem('movito_default_server');
    watchServerEl.src = customData.iframeSrc || defaultServer || '';

    // تعديل الداتا الخاصة في اللوحة التحكم
    if (localStorage.getItem(`movie_${id}_iframeSrc`)) {
      watchServerEl.src = localStorage.getItem(`movie_${id}_iframeSrc`);
    }
    if (localStorage.getItem(`movie_${id}_title`)) {
      titleEl.textContent = localStorage.getItem(`movie_${id}_title`);
    }
    if (localStorage.getItem(`movie_${id}_description`)) {
      overviewEl.textContent = localStorage.getItem(`movie_${id}_description`);
    }
    if (localStorage.getItem(`movie_${id}_keywords`)) {
      keywordsEl.innerHTML = localStorage.getItem(`movie_${id}_keywords`);
    }

  } catch (error) {
    titleEl.textContent = 'خطأ في جلب بيانات الفيلم';
    overviewEl.textContent = error.message;
  }
}

loadMovie();
