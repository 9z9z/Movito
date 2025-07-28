import { fetchFromTMDB } from './utils.js';
import { toggleItem, isInList, favKey, watchLaterKey } from './favorites.js';

const id = new URLSearchParams(location.search).get('id');
const titleEl = document.getElementById('title');
const overviewEl = document.getElementById('overview');
const posterEl = document.getElementById('poster');
const genresEl = document.getElementById('genres');
const directorsEl = document.getElementById('directors');
const castEl = document.getElementById('cast');
const keywordsEl = document.getElementById('keywords');
const watchServerEl = document.getElementById('watch-server');

async function loadMovie() {
  const data = await fetchFromTMDB(`/movie/${id}?append_to_response=credits,keywords,videos`);
  titleEl.textContent = data.title;
  overviewEl.textContent = data.overview;
  posterEl.src = data.poster_path ? `https://image.tmdb.org/t/p/w300${data.poster_path}` : '../assets/fallback.png';
  genresEl.textContent = 'النوع: ' + data.genres.map(g => g.name).join(', ');
  directorsEl.innerHTML = data.credits.crew.filter(c => c.job === 'Director')
    .map(d => `<li>${d.name}</li>`).join('');
  castEl.innerHTML = data.credits.cast.slice(0,5)
    .map(c => `<li>${c.name}</li>`).join('');
  keywordsEl.innerHTML = data.keywords.keywords
    .map(k => `<li>${k.name}</li>`).join('');
  const trailer = data.videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
  watchServerEl.src = trailer 
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1` 
    : localStorage.getItem('movito_default_server') || '';
  
  // إضافة أزرار المفضلة وWatch Later
  const parent = document.createElement('div');
  parent.innerHTML = `
    <button id="fav-btn">${isInList(favKey,{id:+id,type:'movie'})?'💔':'❤️'}</button>
    <button id="wl-btn">${isInList(watchLaterKey,{id:+id,type:'movie'})?'❌':'🕒'}</button>
  `;
  titleEl.after(parent);
  document.getElementById('fav-btn').onclick = () => {
    toggleItem(favKey,{id:+id,type:'movie'});
    document.getElementById('fav-btn').textContent = isInList(favKey,{id:+id,type:'movie'})?'💔':'❤️';
  };
  document.getElementById('wl-btn').onclick = () => {
    toggleItem(watchLaterKey,{id:+id,type:'movie'});
    document.getElementById('wl-btn').textContent = isInList(watchLaterKey,{id:+id,type:'movie'})?'❌':'🕒';
  };
}

loadMovie();
