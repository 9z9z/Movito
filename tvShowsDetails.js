import { fetchFromTMDB } from './utils.js';
const id = new URLSearchParams(location.search).get('id');
const container = document.getElementById('tv-details');

fetchFromTMDB(`/tv/${id}?append_to_response=credits`).then(data => {
  const genres = data.genres.map(g => g.name).join(', ');
  const cast = data.credits.cast.slice(0, 5).map(p => `<a href="personDetail.html?id=${p.id}">${p.name}</a>`).join(', ');
  container.innerHTML = `
    <h1>${data.name}</h1>
    <p><strong>النوع:</strong> ${genres}</p>
    <p><strong>القصة:</strong> ${data.overview}</p>
    <p><strong>الممثلين:</strong> ${cast}</p>
  `;
});