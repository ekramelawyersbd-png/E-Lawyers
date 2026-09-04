import { mockArticles } from './src/data/mockData';
console.log("Length:", mockArticles.length);
console.log("Undefined items:", mockArticles.filter(a => !a).length);
console.log("Items without id:", mockArticles.filter(a => a && !a.id).length);
