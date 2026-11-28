const slides = JSON.parse(document.querySelector('#slide-data').textContent);
const stage = document.querySelector('#slide-stage');
const previous = document.querySelector('#previous');
const next = document.querySelector('#next');
const selector = document.querySelector('#slide-select');
const counter = document.querySelector('#slide-counter');
const heading = document.querySelector('#slide-title');
const error = document.querySelector('#viewer-error');
const requested = Number(new URLSearchParams(location.search).get('image'));
let current = Number.isInteger(requested) ? requested : 0;
function showSlide(value) {
  current = Math.max(0, Math.min(slides.length - 1, value));
  const slide = slides[current];
  stage.innerHTML = slide.html;
  const image = stage.querySelector('img');
  image.loading = 'eager';
  image.alt = slide.title;
  image.addEventListener('error', () => { error.hidden = false; });
  error.hidden = false;
  image.addEventListener('load', () => { error.hidden = true; });
  if (image.complete && image.naturalWidth) error.hidden = true;
  heading.textContent = slide.title;
  document.title = slide.title + ' | 李连凯作品集';
  selector.value = String(current);
  counter.textContent = (current + 1) + ' / ' + slides.length;
  previous.disabled = current === 0;
  next.disabled = current === slides.length - 1;
  const url = new URL(location.href);
  url.searchParams.set('image', String(current));
  history.replaceState(null, '', url);
}
previous.addEventListener('click', () => showSlide(current - 1));
next.addEventListener('click', () => showSlide(current + 1));
selector.addEventListener('change', () => showSlide(Number(selector.value)));
document.addEventListener('keydown', event => {
  if (event.target instanceof Element && event.target.closest('select,input,textarea,button,a')) return;
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showSlide(current + (event.key === 'ArrowRight' ? 1 : -1));
  }
});
let touch;
stage.addEventListener('touchstart', event => { touch = event.changedTouches[0].clientX; }, {passive:true});
stage.addEventListener('touchend', event => {
  const delta = event.changedTouches[0].clientX - touch;
  if (Math.abs(delta) > 50) showSlide(current + (delta < 0 ? 1 : -1));
}, {passive:true});
showSlide(current);
