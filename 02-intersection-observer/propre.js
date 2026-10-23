const galerie = document.querySelector('.galerie');
const sentinelle = document.querySelector('#sentinelle');
const statut = document.querySelector('#statut');

const URL_BASE = 'https://randomfox.ca/images/';
const TOTAL_IMAGES = 121; // d'après la documentation communautaire de l'API : à vérifier
const LOT = 6;
const dejaVues = new Set();

function imageUnique() {
  if (dejaVues.size >= TOTAL_IMAGES) return null; // plus rien à montrer
  let id;
  do {
    id = Math.floor(Math.random() * TOTAL_IMAGES) + 1;
  } while (dejaVues.has(id));
  dejaVues.add(id);
  return id;
}

function creerImage(id) {
  const img = document.createElement('img');
  img.src = `${URL_BASE}${id}.jpg`;
  img.alt = 'Un renard';
  img.width = 400;
  img.height = 400;
  img.loading = 'lazy';
  img.decoding = 'async';
  img.addEventListener('error', () => img.remove()); // image cassée : on la retire
  return img;
}

const observateur = new IntersectionObserver(
  ([entree]) => {
    if (entree.isIntersecting) chargerImages();
  },
  { rootMargin: '400px 0px' }
);

function chargerImages() {
  for (let i = 0; i < LOT; i++) {
    const id = imageUnique();
    if (id === null) {
      observateur.disconnect();
      statut.textContent = 'Tu as vu tous les renards !';
      return;
    }
    galerie.append(creerImage(id));
  }

  observateur.unobserve(sentinelle);
  observateur.observe(sentinelle);
}

observateur.observe(sentinelle);
