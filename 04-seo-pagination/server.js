// Petit serveur sans dépendance : il renvoie une vraie page HTML pour chaque ?page=N.
// C'est ce que voit Googlebot, qui ne scrolle pas.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');

const PORT = process.env.PORT || 3000;
const PAR_PAGE = 10;
const TOTAL = 100;
const NB_PAGES = Math.ceil(TOTAL / PAR_PAGE);

const articles = Array.from({ length: TOTAL }, (_, i) => ({
  titre: `Article ${i + 1}`,
  texte: `Le texte de l'article numéro ${i + 1}. Chaque article n'apparaît que sur une seule page de la série.`,
}));

function echapper(texte) {
  return texte
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Chaque page a sa propre URL (et sa propre URL canonique)
function lien(page) {
  return page === 1 ? '/' : `/?page=${page}`;
}

function rendrePage(page, origine) {
  const debut = (page - 1) * PAR_PAGE;
  const lot = articles.slice(debut, debut + PAR_PAGE);

  const cartes = lot
    .map(
      (a) => `<li class="carte"><h3>${echapper(a.titre)}</h3><p>${echapper(a.texte)}</p></li>`
    )
    .join('\n      ');

  const precedent =
    page > 1 ? `<a class="page-precedente" href="${lien(page - 1)}">Page précédente</a>` : '';
  const suivant =
    page < NB_PAGES ? `<a class="page-suivante" href="${lien(page + 1)}">Page suivante</a>` : '';

  return `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Articles : page ${page} sur ${NB_PAGES}</title>
  <meta name="description" content="Les articles ${debut + 1} à ${debut + lot.length}, page ${page} sur ${NB_PAGES}.">
  <link rel="canonical" href="${origine}${lien(page)}">
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <main>
    <h1>Scroll infini avec pages paginées</h1>
    <p class="note">
      Page ${page} sur ${NB_PAGES}. Désactive JavaScript dans les DevTools : tu peux toujours
      naviguer avec les liens. C'est ce que voit Googlebot.
    </p>
    <ul id="liste">
      ${cartes}
    </ul>
    <div id="sentinelle" aria-hidden="true"></div>
    <nav aria-label="Pagination">
      ${precedent}
      ${suivant}
    </nav>
  </main>
  <script src="/script.js" defer></script>
</body>
</html>
`;
}

const serveur = http.createServer((req, res) => {
  const origine = `http://${req.headers.host}`;
  const url = new URL(req.url, origine);

  // Les deux seuls fichiers statiques
  if (url.pathname === '/style.css' || url.pathname === '/script.js') {
    const type = url.pathname.endsWith('.css')
      ? 'text/css; charset=utf-8'
      : 'text/javascript; charset=utf-8';
    return fs.readFile(path.join(__dirname, url.pathname), (erreur, contenu) => {
      if (erreur) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        return res.end('Introuvable');
      }
      res.writeHead(200, { 'Content-Type': type });
      res.end(contenu);
    });
  }

  if (url.pathname !== '/') {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Page introuvable');
  }

  const page = Number.parseInt(url.searchParams.get('page') ?? '1', 10);
  if (!Number.isInteger(page) || page < 1 || page > NB_PAGES) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    return res.end('Page introuvable');
  }

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(rendrePage(page, origine));
});

serveur.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
