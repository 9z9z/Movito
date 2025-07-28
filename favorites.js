const favKey = 'movito_favorites';
const watchLaterKey = 'movito_watchlater';

export function getList(key) {
  return JSON.parse(localStorage.getItem(key) || '[]');
}
export function toggleItem(key, item) {
  const list = getList(key);
  const exists = list.find(i => i.id === item.id && i.type === item.type);
  if (exists) {
    localStorage.setItem(key, JSON.stringify(list.filter(i => !(i.id===item.id&&i.type===item.type))));
  } else {
    list.push(item);
    localStorage.setItem(key, JSON.stringify(list));
  }
}
export function isInList(key, item) {
  return getList(key).some(i => i.id===item.id && i.type===item.type);
}