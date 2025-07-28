const apiKey='6b2dec73b6697866a50cdaef60ccffcb';

// عام: إنشاء بطاقة
function createCard(item, templateId='card-template'){
  const tpl=document.getElementById(templateId).content.cloneNode(true);
  const img=tpl.querySelector('.poster');
  img.src=`https://image.tmdb.org/t/p/w500/${item.poster_path||item.backdrop_path}`;
  img.onerror=()=>img.src='resources/fallback.png';
  tpl.querySelector('.title').textContent=item.title||item.name;
  tpl.querySelector('.info').textContent=(item.release_date||item.first_air_date||'').slice(0,4);
  const link=tpl.querySelector('.detail-link');
  const type=item.media_type||(item.first_air_date?'movie':'tv');
  link.href=`${type==='tv'?'tvShowsDetails':'movieDetail'}.html?id=${item.id}`;
  return tpl;
}

// سلايدر رئيسي
const mainItems=[];let slideIndex=0;
async function loadSlider(){
  const res=await fetch(`https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&language=ar`);
  const data=await res.json();mainItems.push(...data.results);
  renderSlider();
}
function renderSlider(){
  const container=document.getElementById('slider-container');container.innerHTML='';
  mainItems.slice(slideIndex,slideIndex+5).forEach(it=>container.appendChild(createCard(it)));
}
document.querySelector('#main-slider .prev').onclick=()=>{slideIndex=(slideIndex-1+mainItems.length)%mainItems.length;renderSlider();};
document.querySelector('#main-slider .next').onclick=()=>{slideIndex=(slideIndex+1)%mainItems.length;renderSlider();};

// بحث
if(document.getElementById('search-btn')){
  document.getElementById('search-btn').onclick=()=>{
    const q=document.getElementById('search-input').value;
    if(q)window.location.href=`search.html?q=${encodeURIComponent(q)}`;
  };
}
// صفحة البحث
if(window.location.pathname.includes('search.html')){
  const q=new URLSearchParams(location.search).get('q');
  document.getElementById('query-text').textContent=q;
  fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=ar&query=${encodeURIComponent(q)}`)
    .then(r=>r.json()).then(d=>d.results.forEach(it=>document.getElementById('search-results').appendChild(createCard(it))));
}

// صفحة تفاصيل فيلم
if(window.location.pathname.includes('movieDetail.html')){
  const id=new URLSearchParams(location.search).get('id');
  fetch(`https://api.themoviedb.org/3/movie/${id}?api_key=${apiKey}&append_to_response=credits,keywords&language=ar`)
    .then(r=>r.json()).then(d=>{
      document.getElementById('photo').innerHTML=`<img src="https://image.tmdb.org/t/p/original/${d.poster_path}"/>`;
      document.getElementById('title').textContent=d.title;
      document.getElementById('year-rating').textContent=(d.release_date||'').slice(0,4)+` • ⭐ ${d.vote_average}`;
      document.getElementById('genres').textContent=d.genres.map(g=>g.name).join(', ');
      document.getElementById('overview').textContent=d.overview;
      d.credits.crew.filter(c=>c.job==='Director').forEach(director=>{
        const li=document.createElement('li');li.innerHTML=`<a href="personDetail.html?id=${director.id}">${director.name}</a>`;
        document.getElementById('crew-list').appendChild(li);
      });
      d.keywords.keywords.forEach(k=>document.getElementById('keywords').textContent+=k.name+', ');
      document.getElementById('server-frame').src=localStorage.getItem(`server_${id}`)||'';
    });
}

// صفحة تفاصيل مسلسل
if(window.location.pathname.includes('tvShowsDetails.html')){
  const id=new URLSearchParams(location.search).get('id');
  fetch(`https://api.themoviedb.org/3/tv/${id}?api_key=${apiKey}&append_to_response=credits&language=ar`)
    .then(r=>r.json()).then(d=>{
      document.getElementById('photo').innerHTML=`<img src="https://image.tmdb.org/t/p/original/${d.poster_path}"/>`;
      document.getElementById('title').textContent=d.name;
      document.getElementById('year-rating').textContent=(d.first_air_date||'').slice(0,4)+` • ⭐ ${d.vote_average}`;
      document.getElementById('genres').textContent=d.genres.map(g=>g.name).join(', ');
      document.getElementById('overview').textContent=d.overview;
      d.seasons.forEach(s=>{
        const li=document.createElement('li');li.textContent=`${s.name} - ${s.episode_count} حلقة`;
        document.getElementById('seasons-list').appendChild(li);
      });
      d.credits.crew.filter(c=>c.job==='Director').forEach(dir=>{
        const li=document.createElement('li');li.innerHTML=`<a href="personDetail.html?id=${dir.id}">${dir.name}</a>`;
        document.getElementById('crew-list').appendChild(li);
      });
      document.getElementById('watch-btn').onclick=()=>window.location.href=`watch.html?id=${id}&type=tv`;
    });
}

// صفحة شخص
if(window.location.pathname.includes('personDetail.html')){
  const id=new URLSearchParams(location.search).get('id');
  fetch(`https://api.themoviedb.org/3/person/${id}?api_key=${apiKey}&append_to_response=combined_credits&language=ar`)
    .then(r=>r.json()).then(d=>{
      document.getElementById('photo').innerHTML=`<img src="https://image.tmdb.org/t/p/original/${d.profile_path}"/>`;
      document.getElementById('name').textContent=d.name;
      document.getElementById('bio').textContent=d.biography;
      const cont=document.getElementById('credits-container');
      d.combined_credits.cast.concat(d.combined_credits.crew)
        .sort((a,b)=>b.popularity-a.popularity).slice(0,10)
        .forEach(it=>cont.appendChild(createCard(it)));
      // setup small slider
      let idx=0;const items=cont.children;
      document.querySelector('#credits-slider .prev').onclick=()=>{idx=(idx-1+items.length)%items.length;cont.style.transform=`translateX(${-idx*220}px)`;};
      document.querySelector('#credits-slider .next').onclick=()=>{idx=(idx+1)%items.length;cont.style.transform=`translateX(${-idx*220}px)`;};
    });
}

// watch page
if(window.location.pathname.includes('watch.html')){
  const params=new URLSearchParams(location.search);
  document.getElementById('video-frame').src=params.get('server');
}

// init
window.addEventListener('DOMContentLoaded',()=>{ if(!window.location.pathname.includes('search.html'))loadSlider(); });
