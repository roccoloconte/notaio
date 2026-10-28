const menu = document.querySelector('.menu');
const nav = document.querySelector('#nav');
function setMenu(open) {
  nav.classList.toggle('open', open);
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Chiudi menu' : 'Apri menu');
  document.body.classList.toggle('menu-open', open);
}
menu.setAttribute('aria-label', 'Apri menu');
menu.addEventListener('click', () => setMenu(!nav.classList.contains('open')));
nav.addEventListener('click', event => { if (event.target.closest('a')) setMenu(false); });
document.addEventListener('keydown', event => { if (event.key === 'Escape' && nav.classList.contains('open')) { setMenu(false); menu.focus(); } });
window.matchMedia('(min-width: 751px)').addEventListener('change', event => { if (event.matches) setMenu(false); });
const year = document.querySelector('#year');
if (year) year.textContent = new Date().getFullYear();

// Inserire l'indirizzo email verificato dello studio per attivare il modulo.
const studioEmail = "";
const contactForm = document.querySelector('#contact-form');
if (contactForm) contactForm.addEventListener('submit', event => {
  event.preventDefault();
  const status = document.querySelector('#form-status');
  if (!studioEmail) { status.textContent = 'Il modulo sarà attivo quando verrà inserito l’indirizzo email dello studio.'; return; }
  const data = new FormData(contactForm);
  const subject = encodeURIComponent(data.get('oggetto'));
  const body = encodeURIComponent('Nome: ' + data.get('nome') + '\nCognome: ' + data.get('cognome') + '\nEmail: ' + data.get('email') + '\n\n' + data.get('messaggio'));
  window.location.href = 'mailto:' + studioEmail + '?subject=' + subject + '&body=' + body;
  status.textContent = 'Completa e invia il messaggio nella tua applicazione email.';
});

const gallery = document.querySelector('[data-gallery]');
const dialog = document.querySelector('.gallery-dialog');
if (gallery && dialog) {
  let current = 0; const total = 3;
  const update = () => { gallery.querySelector('[data-count]').textContent = `${current + 1} / ${total}`; dialog.querySelector('[data-full-count]').textContent = `${current + 1} / ${total}`; gallery.querySelector('.gallery-main').classList.toggle('dark-placeholder', current === 1); dialog.querySelector('.gallery-full-photo').classList.toggle('dark-placeholder', current === 1); };
  const change = n => { current = (current + n + total) % total; update(); };
  gallery.querySelector('[data-prev]').addEventListener('click', () => change(-1));
  gallery.querySelector('[data-next]').addEventListener('click', () => change(1));
  gallery.querySelector('.gallery-main').addEventListener('click', () => dialog.showModal());
  dialog.querySelector('.gallery-close').addEventListener('click', () => dialog.close());
  dialog.querySelector('[data-full-prev]').addEventListener('click', () => change(-1));
  dialog.querySelector('[data-full-next]').addEventListener('click', () => change(1));
  dialog.addEventListener('keydown', e => { if(e.key === 'ArrowLeft') change(-1); if(e.key === 'ArrowRight') change(1); });
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setInterval(() => { if(!dialog.open) change(1); }, 5000);
}

const blogRoot = document.querySelector('[data-blog]');
if (blogRoot && Array.isArray(window.ARTICLES)) {
 const articles = [...window.ARTICLES].sort((a,b) => b.date.localeCompare(a.date) || a.url.localeCompare(b.url));
 const perPage = blogRoot.dataset.blog === 'home' ? 3 : 9;
 const nav = document.querySelector('.blog-pagination');
 let page = 1;
 function render() {
  blogRoot.replaceChildren();
  articles.slice((page-1)*perPage,page*perPage).forEach(item => {
   const card = document.createElement('article'); const link = document.createElement('a'); link.href = item.url;
   const photo = document.createElement('div'); photo.className='blog-photo'; photo.textContent='INSERISCI FOTO';
   const title = document.createElement('h3'); title.textContent=item.title; const excerpt=document.createElement('p'); excerpt.textContent=item.description;
   link.append(photo,title,excerpt); card.append(link); blogRoot.append(card);
  });
  if(nav) { nav.replaceChildren(); const count=Math.ceil(articles.length/perPage); for(let i=1;i<=count;i++){ const button=document.createElement('button'); button.type='button';button.textContent=i;if(i===page)button.setAttribute('aria-current','page');button.addEventListener('click',()=>{page=i;render();blogRoot.scrollIntoView({behavior:'smooth'});});nav.append(button); } }
 } render();
}
