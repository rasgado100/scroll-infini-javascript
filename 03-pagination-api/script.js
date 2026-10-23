const liste = document.querySelector('#liste');
const sentinelle = document.querySelector('#sentinelle');
const statut = document.querySelector('#statut');
const boutonPlus = document.querySelector('#plus');
const boutonReessayer = document.querySelector('#reessayer');

const LIMITE = 10;
let page = 1;
let chargement = false;
let fin = false;

function creerCarte({ title, body }) {
  const carte = document.createElement('li');
  carte.className = 'carte';

  const titre = document.createElement('h3');
  titre.textContent = title; // textContent : jamais innerHTML avec des données externes

  const texte = document.createElement('p');
  texte.textContent = body;

  carte.append(titre, texte);
  return carte;
}

const observateur = new IntersectionObserver(
  ([entree]) => {
    if (entree.isIntersecting) chargerPlus();
  },
  { rootMargin: '400px 0px' }
);

function relancerObservation() {
  observateur.unobserve(sentinelle);
  observateur.observe(sentinelle);
}

async function chargerPlus() {
  if (chargement || fin) return; // garde-fou : un seul chargement à la fois
  chargement = true;
  boutonPlus.disabled = true;
  boutonReessayer.hidden = true;
  statut.textContent = 'Chargement…';

  try {
    const reponse = await fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${LIMITE}`
    );
    if (!reponse.ok) throw new Error(`Erreur HTTP ${reponse.status}`);

    const articles = await reponse.json();
    liste.append(...articles.map(creerCarte));
    page++;

    if (articles.length < LIMITE) {
      fin = true; // moins d'éléments que demandé : il n'y en a plus
      observateur.disconnect();
      boutonPlus.hidden = true;
      statut.textContent = 'Tu as tout vu !';
    } else {
      statut.textContent = '';
      relancerObservation();
    }
  } catch (erreur) {
    statut.textContent = 'Le chargement a échoué.';
    boutonReessayer.hidden = false; // on ne relance pas tout seul : on laisse l'utilisateur décider
  } finally {
    chargement = false;
    boutonPlus.disabled = false;
  }
}

// Bouton "Charger plus" : accessible au clavier, et il déplace le focus sur le premier nouvel élément
boutonPlus.addEventListener('click', async () => {
  const avant = liste.children.length;
  await chargerPlus();

  const premierNouveau = liste.children[avant];
  if (premierNouveau) {
    premierNouveau.tabIndex = -1; // rend l'élément focusable par script
    premierNouveau.focus();
  }
});

boutonReessayer.addEventListener('click', chargerPlus);

observateur.observe(sentinelle);
