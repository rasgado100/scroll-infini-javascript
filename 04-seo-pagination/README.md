# 04 · Pagination SEO

Ici, le scroll infini est doublé de **vraies pages avec une URL** (`/?page=2`, `/?page=3`…), pour que Googlebot, qui ne scrolle pas, puisse tout explorer.

Cette démo a besoin d'un petit serveur, parce que chaque page doit être renvoyée **en HTML par le serveur**, pas construite en JavaScript. Pas de dépendance à installer, seulement Node 18 ou plus.

## Lancer

```bash
cd 04-seo-pagination
npm start
```

Puis ouvre http://localhost:3000.

## À tester

1. **Sans JavaScript** : ouvre les DevTools, désactive JavaScript, recharge, puis clique sur « Page suivante ». Chaque page marche, et c'est ce que voit un robot.
2. **Avec JavaScript** : scrolle. Les lots se chargent tout seuls, et l'URL dans la barre d'adresse suit (`replaceState`).
3. **Code source** : clic droit, « Afficher le code source » sur `/?page=2`. Tu vois les articles 11 à 20 dans le HTML, avec leur propre `<title>`, leur propre `canonical` et un lien vers la page suivante.
4. **Les limites** : recharge la page quand tu es à `?page=3` : tu ne retrouves que le lot 3. C'est le compromis de cette méthode.

## Ce que fait le serveur (`server.js`)

- Une page par lot de 10 articles, sans chevauchement entre les pages.
- Chaque page a son propre `<title>`, sa propre balise `canonical` (jamais celle de la page 1) et des liens `<a href>` vers la page précédente et la suivante.
- Les pages hors série (`?page=0`, `?page=11`) renvoient une 404.
