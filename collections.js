import { fetchFromTMDB } from './utils.js';
const container = document.getElementById('collections');
fetchFromTMDB('/collection/10').then(data => {
  container.innerHTML = data.parts.map(p => `<div class="card"><img src="https://image.tmdb.org/t/p/w200${p.poster_path}" /><h4>${p.title}</h4></div>`).join('');
});