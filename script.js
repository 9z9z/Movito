const apiKey = '6b2dec73b6697866a50cdaef60ccffcb';
const sections = ['now_playing', 'popular', 'top_rated', 'trending'];
const endpoints = {
  now_playing: `/movie/now_playing`,
  popular: `/movie/popular`,
  top_rated: `/movie/top_rated`,
  trending: `/trending/all/day`
};

// تبديل الوضع الليلي/نهاري
const modeToggle = document.getElementById('mode-toggle');
modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  localStorage.setItem('theme', document.body.classList.contains('light') ? 'light' : 'dark');
});
(function initTheme() {
  const theme = localStorage.getItem('theme');
  if (theme === 'light') document.body.classList.add('light');
})();

// سحب وعرض الأفلام
async function fetchMovies(section) {
  const url = `https://api.themoviedb.org/3${endpoints[section]}?api_key=${apiKey}&language=ar&page=1`;
  const res = await fetch(url);
  const data = await res.json();
  return data.results;
}

function renderSection(section, movies) {
  const container = document.getElementById(section);
  const template = document.getElementById('movie-card-template');
  container.innerHTML = '';
  movies.forEach(movie => {
    const clone = template.content.cloneNode(true);
    const img = clone.querySelector('.poster');
    img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
    img.onerror = () => img.src = 'resources/D_moviesand_tv_show.png';
    clone.querySelector('.title').textContent = movie.title || movie.name;
    const year = (movie.release_date || movie.first_air_date || '').slice(0,4);
    const rating = movie.vote_average;
    clone.querySelector('.info').textContent = `${year} • ⭐ ${rating}`;
    container.appendChild(clone);
  });
}

// التنقل بين الأقسام
const menuItems = document.querySelectorAll('.menu li');
menuItems.forEach(item => {
  item.addEventListener('click', async () => {
    menuItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');
    const sec = item.dataset.section;
    sections.forEach(s => document.getElementById(s).classList.add('hide'));
    document.getElementById(sec).classList.remove('hide');
    const movies = await fetchMovies(sec);
    renderSection(sec, movies);
  });
});

// التحميل الأولي
window.addEventListener('DOMContentLoaded', async () => {
  const movies = await fetchMovies('now_playing');
  renderSection('now_playing', movies);
});