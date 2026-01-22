const fs = require('fs');
const path = require('path');

// Read the prototyping data
const dataPath = path.join(__dirname, '../data/prototyping-data.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

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

// Sort skills within each ring
Object.keys(grouped).forEach(quadrant => {
  Object.keys(grouped[quadrant]).forEach(ring => {
    grouped[quadrant][ring].sort((a, b) => (a.order || 0) - (b.order || 0));
  });
});

const quadrants = ['Setup and Deployment', 'Components and Patterns', 'Pages and Layouts', 'Data and Logic'];
const rings = ['Working', 'Practitioner', 'Expert', 'Leading'];

let output = '';

// Create chunks organized by quadrant and ring
quadrants.forEach(quadrant => {
  output += `\n${'='.repeat(80)}\n`;
  output += `${quadrant.toUpperCase()}\n`;
  output += `${'='.repeat(80)}\n\n`;

  rings.forEach(ring => {
    const skills = grouped[quadrant]?.[ring] || [];
    if (skills.length > 0) {
      output += `--- ${ring} (${skills.length}) ---\n\n`;
      skills.forEach(skill => {
        output += `${skill.name}\n`;
      });
      output += '\n';
    }
  });
});

// Write the file
const outputPath = path.join(__dirname, '../miro-copy-paste.txt');
fs.writeFileSync(outputPath, output.trim(), 'utf8');

console.log(`✅ Copy-paste file created: ${outputPath}`);
console.log('\n📋 Instructions:');
console.log('   1. Open miro-copy-paste.txt');
console.log('   2. Copy a section (e.g., all "Working" skills from one quadrant)');
console.log('   3. In Miro, paste to create sticky notes');
console.log('   4. Each line becomes a separate sticky note!');
