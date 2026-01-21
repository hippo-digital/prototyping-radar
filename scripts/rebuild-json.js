const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');
const { marked } = require('marked');

const srcDir = 'data/items-md';
const files = fs.readdirSync(srcDir).filter(f => f.endsWith('.md'));
const items = files.map(f => {
  const content = fs.readFileSync(path.join(srcDir, f), 'utf8');
  const parsed = matter(content);
  return {
    name: parsed.data.name,
    ring: parsed.data.ring,
    quadrant: parsed.data.quadrant,
    description: marked(parsed.content),
    filename: f.replace('.md', ''),
    order: parsed.data.order,
    status: parsed.data.status || 'No Change'
  };
});
fs.writeFileSync('data/prototyping-data.json', JSON.stringify(items, null, 2));
console.log('Wrote', items.length, 'items');
const heroku = items.filter(i => i.name && i.name.includes('Heroku'));
heroku.forEach(h => console.log(h.name, '-', h.ring, '- order:', h.order));
