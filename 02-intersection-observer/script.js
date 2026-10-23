const galerie = document.querySelector('.galerie');
const sentinelle = document.querySelector('#sentinelle');
const URL_BASE = 'https://randomfox.ca/images/';

function nombreAleatoire() {
  return Math.floor(Math.random() * 100);
}

// L'observateur prévient le navigateur : "dis-moi quand la sentinelle approche de l'écran"
const observateur = new IntersectionObserver(
  ([entree]) => {
    if (entree.isIntersecting) {
      chargerImages();
    }
  },
  { rootMargin: '400px 0px' } // on charge 400px AVANT que la sentinelle soit visible
);

function chargerImages(nombre = 6) {
  for (let i = 0; i < nombre; i++) {
    const img = document.createElement('img');
    img.src = `${URL_BASE}${nombreAleatoire()}.jpg`;
    galerie.appendChild(img);
  }

  // Relance l'observation : si la sentinelle est encore visible (grand écran), on recharge.
  // Essaie de commenter ces deux lignes sur un grand écran : la page reste à moitié vide.
  observateur.unobserve(sentinelle);
  observateur.observe(sentinelle);
}

observateur.observe(sentinelle); // le premier lot est chargé par l'observateur lui-même
