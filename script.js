const apiKey='6b2dec73b6697866a50cdaef60ccffcb';
const sections={
  discover_all:'/discover/movie',
  movie_now_playing:'/movie/now_playing',
  movie_popular:'/movie/popular',
  movie_upcoming:'/movie/upcoming',
  tv_popular:'/tv/popular',
  anime:'/discover/tv?with_genres=16',
  trending_all_day:'/trending/all/day'
};

// Theme toggle omitted for brevity

async function fetchItems(endpoint){
  const res=await fetch(`https://api.themoviedb.org/3${endpoint}?api_key=${apiKey}&language=ar&page=1`);
  const data=await res.json(); return data.results;
}

function renderSection(sec){
  const container=document.getElementById(sec);
  container.innerHTML='';
  fetchItems(sections[sec]).then(items=>{
    items.forEach(item=>{
      const tpl=document.getElementById('item-card-template').content.cloneNode(true);
      const img=tpl.querySelector('.poster'), link=tpl.querySelector('.detail-link');
      const type=item.media_type|| (sections[sec].startsWith('/tv')||sec==='anime'?'tv':'movie');
      img.src=`https://image.tmdb.org/t/p/w500/${item.poster_path||item.backdrop_path}`;
      img.onerror=()=>img.src='resources/D_moviesand_tv_show.png';
      tpl.querySelector('.title').textContent=item.title||item.name;
      tpl.querySelector('.info').textContent=(item.release_date||item.first_air_date||'').slice(0,4)+` • ⭐ ${item.vote_average}`;
      link.href=`${type==='tv'?'tvShowsDetails':'movieDetail'}.html?id=${item.id}&type=${type}`;
      container.appendChild(tpl);
    });
  });
}

document.querySelectorAll('.menu li').forEach(item=>{
  item.addEventListener('click',()=>{
    document.querySelectorAll('.menu li').forEach(i=>i.classList.remove('active'));
    item.classList.add('active');
    document.querySelectorAll('main section').forEach(s=>s.classList.add('hide'));
    document.getElementById(item.dataset.section).classList.remove('hide');
    renderSection(item.dataset.section);
  });
});

// Search
const searchBtn=document.getElementById('search-btn');
searchBtn.onclick=()=>{
  const q=document.getElementById('search-input').value;
  window.location.href=`search.html?q=${encodeURIComponent(q)}`;
};

// Load default
window.addEventListener('DOMContentLoaded',()=>renderSection('discover_all'));
