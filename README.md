# Scroll infini en JavaScript : les démos

Le code qui accompagne l'article **« Scroll infini en JavaScript : le guide complet »** : [lien vers l'article](https://blog.cyrillerasgado.com/blog/scroll-infini-en-javaScript-le-guide-complet).

Quatre versions, de la plus simple à la plus complète, en HTML, CSS et JavaScript pur. Pas de framework.

## Lancer le projet

1. Clone le repo :
   ```bash
   git clone https://github.com/rasgado100/scroll-infini-javascript.git
   cd scroll-infini-javascript
   ```
2. **Démos 01 à 03** : ouvre `index.html` dans ton navigateur et clique sur la démo. Il faut une connexion internet (images Random Fox et API de test JSONPlaceholder).
3. **Démo 04** : elle demande un petit serveur Node (sans dépendance) :
   ```bash
   cd 04-seo-pagination
   npm start
   ```
   Puis ouvre http://localhost:3000.

## Ce qu'il y a dedans

| Dossier | Ce que tu y trouves |
| --- | --- |
| `01-scroll-event` | La version simple avec l'événement `scroll`, et ses limites |
| `02-intersection-observer` | La sentinelle, `rootMargin`, la relance de l'observation, et une version propre (`propre.html`) |
| `03-pagination-api` | `fetch` paginé, garde-fous, fin de liste, erreurs, bouton « Charger plus » accessible |
| `04-seo-pagination` | Pages `?page=N` avec liens, History API et amélioration progressive |

Chaque script est commenté aux endroits où il y a un piège.

## Comment t'en servir

Ouvre l'article à côté, puis **casse le code volontairement** pour voir ce qui se passe :

- **01** : sur un grand écran, la page n'est pas assez haute pour scroller. Réduis la fenêtre ou zoome, et regarde combien de fois la fonction se déclenche.
- **02** : commente les deux lignes `unobserve` et `observe` à la fin de `chargerImages()`, puis ouvre la page sur un grand écran : elle reste à moitié vide. Essaie aussi de retirer `width` et `height` dans `propre.js`.
- **03** : retire le `finally`, ou coupe le réseau dans les DevTools (onglet Réseau, « Hors connexion ») pour voir l'erreur et le bouton « Réessayer ».
- **04** : désactive JavaScript et vérifie que les liens marchent toujours.

## Une précision sur l'API Random Fox

Les démos 01 et 02 tirent des numéros d'images au hasard. D'après la documentation communautaire de l'API, ses identifiants vont de 1 à 121, ce qui est à vérifier : si tu vois des images cassées dans l'onglet Réseau, ajuste `TOTAL_IMAGES` dans `02-intersection-observer/propre.js`. Dans les versions 01 et 02 de base, `Math.random() * 100` peut donner 0 : une 404 de temps en temps est normale.

## Licence

MIT : fais-en ce que tu veux.

Une question, une idée d'amélioration ?  écris-moi.
