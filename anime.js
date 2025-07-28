import { fetchFromTMDB } from './utils.js';
const container = document.getElementById('anime');
fetchFromTMDB('/discover/tv&with_keywords=210024').then(data => {
  container.innerHTML = data.results.map(m => `<div class="card"><img src="https://image.tmdb.org/t/p/w200${m.poster_path}" /><h4>${m.name}</h4></div>`).join('');
});