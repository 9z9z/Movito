import { fetchFromTMDB } from './utils.js';
import { toggleItem, isInList } from './favorites.js';

const id = new URLSearchParams(location.search).get('id');
let current;

fetchFromTMDB(`/movie/${id}?append_to_response=credits,keywords`).then(data => {
  current = {id:data.id, type:'movie'};
  document.getElementById('title').textContent=data.title;
  document.getElementById('overview').textContent=data.overview;
});