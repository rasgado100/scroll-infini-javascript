const galerie = document.querySelector('.galerie');
const URL_BASE = 'https://randomfox.ca/images/'; // pas "URL" : ce nom masque le constructeur global du navigateur

function nombreAleatoire() {
  return Math.floor(Math.random() * 100); // de 0 à 99 : regarde l'onglet Réseau, certaines images peuvent être en 404
}

function chargerImages(nombre = 6) {
  for (let i = 0; i < nombre; i++) {
    const img = document.createElement('img');
    img.src = `${URL_BASE}${nombreAleatoire()}.jpg`;
    galerie.appendChild(img);
  }
}

chargerImages(); // le premier lot

// Les limites de cette version (à tester toi-même) :
// - l'événement scroll se déclenche des dizaines de fois par seconde
// - la condition est stricte : avec des pixels décimaux, elle peut ne jamais être vraie
// - on ne charge qu'une fois tout en bas : l'utilisateur attend
// - pas de fin, pas de gestion d'erreur
window.addEventListener('scroll', () => {
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight) {
    chargerImages();
  }
});
