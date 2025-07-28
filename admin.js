document.getElementById('editForm').addEventListener('submit', e => {
  e.preventDefault();
  const id = document.getElementById('itemId').value.trim();
  const type = document.getElementById('itemType').value;
  const iframeSrc = document.getElementById('iframeSrc').value.trim();
  const title = document.getElementById('customTitle').value.trim();
  const description = document.getElementById('customDescription').value.trim();
  const keywords = document.getElementById('customKeywords').value.trim();

  localStorage.setItem(`movie_${id}_iframeSrc`, iframeSrc);
  if (title) localStorage.setItem(`movie_${id}_title`, title);
  if (description) localStorage.setItem(`movie_${id}_description`, description);
  if (keywords) localStorage.setItem(`movie_${id}_keywords`, keywords);

  alert('تم حفظ التعديلات');
});
