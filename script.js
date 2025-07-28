const apiKey='6b2dec73b6697866a50cdaef60ccffcb';
const sections=['movie_now_playing','movie_popular','movie_top_rated','movie_upcoming','tv_popular','tv_top_rated','tv_on_the_air','trending_all_day'];
const endpoints={movie_now_playing:'/movie/now_playing',movie_popular:'/movie/popular',movie_top_rated:'/movie/top_rated',movie_upcoming:'/movie/upcoming',tv_popular:'/tv/popular',tv_top_rated:'/tv/top_rated',tv_on_the_air:'/tv/on_the_air',trending_all_day:'/trending/all/day'};
const genreMap={};
// جلب الأنواع
fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}&language=ar`)
  .then(r=>r.json()).then(d=>{d.genres.forEach(g=>genreMap[g.id]=g.name);
    const sel=document.getElementById('genre-select');
    sel.innerHTML='<option value="all">الكل</option>'+d.genres.map(g=>`<option value="${g.id}">${g.name}</option>`).join('');
  });

// الوضع الليلي
const modeToggle=document.getElementById('mode-toggle');modeToggle.onclick=()=>{document.body.classList.toggle('light');localStorage.setItem('theme',document.body.classList.contains('light')?'light':'dark');};(function(){if(localStorage.getItem('theme')==='light')document.body.classList.add('light');})();

// جلب ودعم صفحات
async function fetchAll(url){let page=1,res=[];while(page<=5){const r=await fetch(`${url}&page=${page}`);const d=await r.json();res=res.concat(d.results);if(page>=d.total_pages)break;page++;}return res;}
async function fetchSec(sec){let url=`https://api.themoviedb.org/3${endpoints[sec]}?api_key=${apiKey}&language=${document.getElementById('lang-select').value}`;let items=await fetchAll(url);
 let genreSel=document.getElementById('genre-select').value;
 if(genreSel!=='all')items=items.filter(i=>i.genre_ids.includes(+genreSel));
 return items;
}

// العرض والترتيب
const sortSelect=document.getElementById('sort-select');
function sortItems(arr){const key=sortSelect.value;return arr.sort((a,b)=>(key==='rating'?b.vote_average-a.vote_average: (b.release_date||b.first_air_date||'').slice(0,4)-(a.release_date||a.first_air_date||'').slice(0,4)));}
async function render(sec){let items=await fetchSec(sec);items=sortItems(items);
 const cont=document.getElementById(sec),tpl=document.getElementById('movie-card-template');cont.innerHTML='';
 items.forEach(it=>{const c=tpl.content.cloneNode(true);
 const img=c.querySelector('.poster'),link=c.querySelector('.detail-link');img.src=`https://image.tmdb.org/t/p/w500/${it.poster_path||it.backdrop_path}`;img.onerror=()=>img.src='resources/D_moviesand_tv_show.png';
 c.querySelector('.title').textContent=it.title||it.name;const year=(it.release_date||it.first_air_date||'').slice(0,4);
 c.querySelector('.info').textContent=`${year} • ⭐ ${it.vote_average}`;
 link.href=`movieDetail.html?id=${it.id}&type=${sec.startsWith('tv')?'tv':'movie'}`;cont.appendChild(c);
 });
}

document.querySelectorAll('.menu li').forEach(item=>{item.onclick=async()=>{document.querySelectorAll('.menu li').forEach(i=>i.classList.remove('active'));item.classList.add('active');document.querySelectorAll('.movies-section').forEach(s=>s.classList.add('hide'));document.getElementById(item.dataset.section).classList.remove('hide');await render(item.dataset.section);};});
window.addEventListener('DOMContentLoaded',()=>render('movie_now_playing'));
sortSelect.onchange=()=>render(document.querySelector('.menu li.active').dataset.section);
document.getElementById('lang-select').onchange=document.getElementById('genre-select').onchange=()=>render(document.querySelector('.menu li.active').dataset.section);
