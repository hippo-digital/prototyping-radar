const fs = require('fs');
const path = require('path');

// Read the prototyping data
const dataPath = path.join(__dirname, '../data/prototyping-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Function to escape CSV fields
function escapeCsv(field) {
  if (field === null || field === undefined) return '';
  const str = String(field);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Function to strip HTML and create clean description
function cleanDescription(html) {
  if (!html) return '';
  // Remove HTML tags but preserve newlines
  return html
    .replace(/<h2>/g, '\n\n')
    .replace(/<\/h2>/g, ':\n')
    .replace(/<li>/g, '• ')
    .replace(/<\/li>/g, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')
    .replace(/\n\n+/g, '\n\n')
    .trim();
}

// Group by quadrant and ring
const grouped = {};
data.forEach(item => {
  if (!grouped[item.quadrant]) {
    grouped[item.quadrant] = {};
  }
  if (!grouped[item.quadrant][item.ring]) {
    grouped[item.quadrant][item.ring] = [];
  }
  grouped[item.quadrant][item.ring].push(item);
});

// Define colors for rings (Miro sticky note colors)
const ringColors = {
  'Working': 'yellow',
  'Practitioner': 'light_green',
  'Expert': 'blue',
  'Leading': 'purple'
};

// Create CSV for Miro import
// Miro CSV format: Title, Description, Tags
const csvRows = [];
csvRows.push('Title,Description,Tags');

// Add header cards for each quadrant
const quadrants = Object.keys(grouped).sort();
quadrants.forEach(quadrant => {
  csvRows.push(escapeCsv(`🎯 ${quadrant}`) + ',' +
    escapeCsv('Quadrant') + ',' +
    escapeCsv('quadrant'));
});

// Add all skills
data.forEach(item => {
  const title = item.name;
  const description = `${item.ring} | ${item.quadrant}\n\n${cleanDescription(item.description)}`;
  const tags = `${item.ring},${item.quadrant},${item.status || ''}`.toLowerCase().replace(/\s+/g, '-');

  csvRows.push(
    escapeCsv(title) + ',' +
    escapeCsv(description) + ',' +
    escapeCsv(tags)
  );
});

// Write CSV
const csvContent = csvRows.join('\n');
const outputPath = path.join(__dirname, '../miro-export.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`✅ Miro CSV export created: ${outputPath}`);
console.log(`📊 Total items: ${data.length}`);
console.log(`📋 Quadrants: ${quadrants.length}`);
console.log('\nQuadrant breakdown:');
quadrants.forEach(q => {
  const rings = Object.keys(grouped[q]);
  console.log(`  ${q}:`);
  rings.forEach(r => {
    console.log(`    ${r}: ${grouped[q][r].length} skills`);
  });
});

// Also create a JSON file for more advanced Miro imports
const miroJson = {
  type: 'sticky_notes',
  quadrants: quadrants,
  rings: ['Working', 'Practitioner', 'Expert', 'Leading'],
  data: data.map(item => ({
    title: item.name,
    quadrant: item.quadrant,
    ring: item.ring,
    description: cleanDescription(item.description),
    color: ringColors[item.ring] || 'yellow',
    tags: [item.ring, item.quadrant, item.status].filter(Boolean)
  }))
};

const jsonOutputPath = path.join(__dirname, '../miro-export.json');
fs.writeFileSync(jsonOutputPath, JSON.stringify(miroJson, null, 2), 'utf8');
console.log(`\n✅ Miro JSON export created: ${jsonOutputPath}`);
console.log('\nImport instructions:');
console.log('1. CSV Import: In Miro, click "..." menu → "Import from CSV"');
console.log('2. Upload miro-export.csv');
console.log('3. Map columns: Title → Title, Description → Description, Tags → Tags');
console.log('4. Arrange sticky notes by tags to create the radar structure');
