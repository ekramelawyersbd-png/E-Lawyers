// Just to make sure we have at least one normal article for the Home page to show something
const fs = require('fs');
let content = fs.readFileSync('src/data/mockData.ts', 'utf8');

if (!content.includes('id: "200"')) {
  const dummyArticle = `
  {
    id: "200",
    title: "Understanding Corporate Tax in Bangladesh",
    excerpt: "A comprehensive guide to corporate tax rates, filing requirements, and planning strategies.",
    content: "Corporate tax in Bangladesh varies based on whether a company is publicly traded or not. Understanding these brackets is essential for tax planning.",
    categoryId: "tax",
    category: "Tax Updates",
    author: mockAuthors.a1,
    publishedAt: new Date(Date.now() - 86400000).toISOString(),
    readTime: 4,
    imageUrl: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&q=80&w=800",
    tags: ["Corporate Tax", "Bangladesh"],
    likes: 42,
    comments: 5
  },`;

  const newContent = content.replace('export const mockArticles: Article[] = [', 'export const mockArticles: Article[] = [' + dummyArticle);
  fs.writeFileSync('src/data/mockData.ts', newContent);
}
