import { fetchFromTMDB } from './utils.js';
const container = document.getElementById('top-rated');
fetchFromTMDB('/movie/top_rated').then(data => {
  container.innerHTML = data.results.map(m => `<div class="card"><img src="https://image.tmdb.org/t/p/w200${m.poster_path}" /><h4>${m.title}</h4></div>`).join('');
});