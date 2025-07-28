export const favKey = 'movito_favorites';
export const watchLaterKey = 'movito_watchlater';
export function getList(k){return JSON.parse(localStorage.getItem(k)||'[]')}
export function toggleItem(k,item){const l=getList(k),e=l.find(i=>i.id===item.id&&i.type===item.type);if(e) localStorage.setItem(k,JSON.stringify(l.filter(i=>!(i.id===item.id&&i.type===item.type))));else{l.push(item);localStorage.setItem(k,JSON.stringify(l))}}
export function isInList(k,item){return getList(k).some(i=>i.id===item.id&&i.type===item.type)}
