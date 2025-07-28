const apiKey = '6b2dec73b6697866a50cdaef60ccffcb';
// Slider العناصر الرئيسية (جديد، ترند…)
const mainEndpoints = ['/movie/now_playing','/trending/all/day','/movie/popular'];
const mainSlider = document.getElementById('slider-container');
let currentSlideIndex = 0, mainItems = [];

// ابني الكارد
function createCard(item){
  const tpl = document.getElementById('card-template').content.cloneNode(true);
  const img = tpl.querySelector('.poster');
  img.src = `https://image.tmdb.org/t/p/w500/${item.poster_path||item.backdrop_path}`;
  img.onerror = () => img.src='resources/fallback.png';
  tpl.querySelector('.title').textContent = item.title||item.name;
  tpl.querySelector('.info').textContent = (item.release_date||item.first_air_date||'').slice(0,4);
  const link = tpl.querySelector('.detail-link');
  const type = item.media_type||(item.title?'movie':'tv');
  link.href = `${type==='tv'?'tvShowsDetails':'movieDetail'}.html?id=${item.id}`;
  return tpl;
}

// جلب بيانات للسلايدر
async function loadMainSlider(){
  const res = await fetch(`https://api.themoviedb.org/3${mainEndpoints[0]}?api_key=${apiKey}&language=ar`);
  const data = await res.json(); mainItems = data.results;
  renderSlider();
}
function renderSlider(){
  mainSlider.innerHTML='';
  mainItems.slice(currentSlideIndex, currentSlideIndex+5).forEach(item=>{
    mainSlider.appendChild(createCard(item));
  });
}

// أزرار السلايدر
document.querySelector('#main-slider .prev').onclick = ()=>{
  currentSlideIndex = (currentSlideIndex-1+mainItems.length)%mainItems.length; renderSlider();
};
document.querySelector('#main-slider .next').onclick = ()=>{
  currentSlideIndex = (currentSlideIndex+1)%mainItems.length; renderSlider();
};

// بحث
const searchInput = document.getElementById('search-input');
document.getElementById('search-btn').onclick = ()=>{
  const q = searchInput.value.trim();
  if(!q) return;
  window.location.href = `search.html?q=${encodeURIComponent(q)}`;
};

// صفحة البحث
if(window.location.pathname.includes('search.html')){
  const params = new URLSearchParams(location.search);
  const q = params.get('q');
  document.getElementById('query-text').textContent = q;
  fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ar&query=${encodeURIComponent(q)}`)
    .then(r=>r.json()).then(d=>{
      const container = document.getElementById('search-results');
      d.results.forEach(item=>{
        const card = createCard(item);
        container.appendChild(card);
      });
    });
}

// تشغيل عند التحميل
window.addEventListener('DOMContentLoaded', ()=>{
  if(!window.location.pathname.includes('search.html')) loadMainSlider();
});
