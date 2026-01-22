const fs = require('fs');
const path = require('path');

// Read the prototyping data
const dataPath = path.join(__dirname, '../data/prototyping-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Sort by quadrant and ring for organized output
const sorted = data.sort((a, b) => {
  if (a.quadrant !== b.quadrant) return a.quadrant.localeCompare(b.quadrant);
  if (a.ring !== b.ring) {
    const ringOrder = { 'Working': 0, 'Practitioner': 1, 'Expert': 2, 'Leading': 3 };
    return ringOrder[a.ring] - ringOrder[b.ring];
  }
  return (a.order || 0) - (b.order || 0);
});

// Create simple CSV with just title and category
const csvRows = ['Title,Quadrant,Ring'];
sorted.forEach(item => {
  csvRows.push(`"${item.name}","${item.quadrant}","${item.ring}"`);
});

const csvContent = csvRows.join('\n');
const outputPath = path.join(__dirname, '../miro-simple.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`✅ Simple CSV created: ${outputPath}`);
console.log(`📊 Total: ${data.length} skills`);

// Also create a tab-separated version for easy copy-paste
const tsvRows = ['Title\tQuadrant\tRing'];
sorted.forEach(item => {
  tsvRows.push(`${item.name}\t${item.quadrant}\t${item.ring}`);
});

const tsvContent = tsvRows.join('\n');
const tsvOutputPath = path.join(__dirname, '../miro-simple.tsv');
fs.writeFileSync(tsvOutputPath, tsvContent, 'utf8');

console.log(`✅ Tab-separated file created: ${tsvOutputPath}`);
console.log('\n📋 You can now:');
console.log('   1. Open miro-simple.csv in Miro (Import from CSV)');
console.log('   2. Or open miro-simple.tsv and copy-paste directly into Miro');
