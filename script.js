const apiKey = '6b2dec73b6697866a50cdaef60ccffcb';
const sections = [
  'movie_now_playing',
  'movie_popular',
  'movie_top_rated',
  'movie_upcoming',
  'tv_popular',
  'tv_top_rated',
  'tv_on_the_air',
  'trending_all_day'
];
const endpoints = {
  movie_now_playing: `/movie/now_playing`,
  movie_popular: `/movie/popular`,
  movie_top_rated: `/movie/top_rated`,
  movie_upcoming: `/movie/upcoming`,
  tv_popular: `/tv/popular`,
  tv_top_rated: `/tv/top_rated`,
  tv_on_the_air: `/tv/on_the_air`,
  trending_all_day: `/trending/all/day`
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

// جلب جميع الصفحات (مثال أول 5 صفحات)
async function fetchAllResults(url) {
  let page = 1;
  let results = [];
  while (page <= 5) {
    const res = await fetch(`${url}&page=${page}`);
    const data = await res.json();
    results = results.concat(data.results);
    if (page >= data.total_pages) break;
    page++;
  }
  return results;
}

// جلب قسم محدد
async function fetchSection(section) {
  const endpoint = endpoints[section];
  const url = `https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&language=ar`;
  return await fetchAllResults(url);
}

// عرض العناصر
function renderSection(section, items) {
  const container = document.getElementById(section);
  const tpl = document.getElementById('movie-card-template');
  container.innerHTML = '';
  items.forEach(item => {
    const clone = tpl.content.cloneNode(true);
    const img = clone.querySelector('.poster');
    img.src = `https://image.tmdb.org/t/p/w500/${item.poster_path || item.backdrop_path}`;
    img.onerror = () => img.src = 'resources/D_moviesand_tv_show.png';
    clone.querySelector('.title').textContent = item.title || item.name;
    const year = (item.release_date || item.first_air_date || '').slice(0,4);
    const rating = item.vote_average;
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
    const items = await fetchSection(sec);
    renderSection(sec, items);
  });
});

// التحميل الأولي
window.addEventListener('DOMContentLoaded', async () => {
  const items = await fetchSection('movie_now_playing');
  renderSection('movie_now_playing', items);
});
