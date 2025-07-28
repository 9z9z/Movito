const serverInput = document.getElementById('admin-server');
const toggleFavBtn = document.getElementById('toggle-fav');
const toggleWlBtn = document.getElementById('toggle-watchlater');

serverInput.value = localStorage.getItem('movito_default_server') || '';
serverInput.onchange = () => localStorage.setItem('movito_default_server', serverInput.value);

toggleFavBtn.onclick = () => {
  const x = localStorage.getItem('enable_fav') === 'true';
  localStorage.setItem('enable_fav', !x);
  alert(`Favorites ${!x ? 'enabled' : 'disabled'}`);
};

toggleWlBtn.onclick = () => {
  const x = localStorage.getItem('enable_watchlater') === 'true';
  localStorage.setItem('enable_watchlater', !x);
  alert(`Watch Later ${!x ? 'enabled' : 'disabled'}`);
};