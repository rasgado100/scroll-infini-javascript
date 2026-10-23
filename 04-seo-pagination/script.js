// Amélioration progressive : la page marche déjà sans JavaScript (liens ?page=N).
// Le JavaScript ajoute le chargement automatique par-dessus.
const liste = document.querySelector('#liste');
const sentinelle = document.querySelector('#sentinelle');

let lienSuivant = document.querySelector('a.page-suivante');
let chargement = false;

const observateur = new IntersectionObserver(
  ([entree]) => {
    if (entree.isIntersecting) chargerPageSuivante();
  },
  { rootMargin: '400px 0px' }
);

function relancerObservation() {
  observateur.unobserve(sentinelle);
  observateur.observe(sentinelle);
}

async function chargerPageSuivante() {
  if (chargement || !lienSuivant) return;
  chargement = true;

  try {
    const reponse = await fetch(lienSuivant.href);
    if (!reponse.ok) throw new Error(`Erreur HTTP ${reponse.status}`);

    // On lit la page suivante telle que le serveur la renvoie, et on en extrait les éléments
    const doc = new DOMParser().parseFromString(await reponse.text(), 'text/html');
    liste.append(...doc.querySelectorAll('#liste > li'));

    // L'URL suit le lot chargé, sans ajouter d'entrée dans l'historique
    history.replaceState(null, '', lienSuivant.href);

    // Le lien vers la page encore après : s'il n'existe plus, on a tout chargé
    const prochain = doc.querySelector('a.page-suivante');
    if (prochain) {
      lienSuivant.href = prochain.href;
      relancerObservation();
    } else {
      lienSuivant.remove();
      lienSuivant = null;
      observateur.disconnect();
    }
  } catch (erreur) {
    // Le lien "Page suivante" reste cliquable : rien n'est perdu
  } finally {
    chargement = false;
  }
}

if (lienSuivant) observateur.observe(sentinelle);
