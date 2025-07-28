const apiKey='6b2dec73b6697866a50cdaef60ccffcb';

// إنشاء بطاقة عامة
def createCard(item, templateId='card-template'){
// ... (كما سابقاً)
}

// تحميل السلايدر الرئيسي
async function loadSlider(){
  const endpoints=['/movie/now_playing','/tv/popular','/discover/movie?with_genres=16'];
  let items=[];
  for(const ep of endpoints){
    const res=await fetch(`https://api.themoviedb.org/3${ep}?api_key=${apiKey}&language=ar`);
    const data=await res.json(); items.push(...data.results);
  }
  window.mainItems=items; renderSlider();
}

// حفظ وتعديل في صفحات التفاصيل
function initDetailPage(type){
  const id=new URLSearchParams(location.search).get('id');
  const storageKey=`${type}_${id}`;
  fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}&append_to_response=credits,keywords&language=ar`)
    .then(r=>r.json()).then(data=>{
      // عرض البيانات (كما سابقاً)...
      // تعبئة حقول الإدخال
      const saved=JSON.parse(localStorage.getItem(storageKey)||'{}');
      document.getElementById('edit-title').value=saved.title||data.title||data.name;
      document.getElementById('edit-overview').value=saved.overview||data.overview;
      document.getElementById('edit-keywords').value=saved.keywords||data.keywords.keywords.map(k=>k.name).join('،');
      document.getElementById('edit-server').value=saved.server||localStorage.getItem(`server_${id}`)||'';
      document.getElementById('save-btn').onclick=()=>{
        const obj={
          title:document.getElementById('edit-title').value,
          overview:document.getElementById('edit-overview').value,
          keywords:document.getElementById('edit-keywords').value,
          server:document.getElementById('edit-server').value
        };
        localStorage.setItem(storageKey,JSON.stringify(obj));
        localStorage.setItem(`server_${id}`,obj.server);
        location.reload();
      };
    });
}

// تهيئة الصفحات بناءً على المسار
window.addEventListener('DOMContentLoaded',()=>{
  if(location.pathname.includes('index.html')||location.pathname==='/' )loadSlider();
  if(location.pathname.includes('search.html'))initSearch();
  if(location.pathname.includes('movieDetail.html'))initDetailPage('movie');
  if(location.pathname.includes('tvShowsDetails.html'))initDetailPage('tv');
  if(location.pathname.includes('personDetail.html'))initPerson();
});
