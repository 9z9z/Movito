const params = new URLSearchParams(location.search);
const server = params.get('server');
document.getElementById('video-frame').src = server || '';
