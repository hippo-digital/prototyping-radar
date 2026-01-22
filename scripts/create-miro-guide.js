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

// Create Markdown visualization
let markdown = '# Skills Radar - Miro Import Guide\n\n';
markdown += '## Overview\n\n';
markdown += `Total Skills: ${data.length}\n\n`;

markdown += '## Quadrants Structure\n\n';

const quadrants = Object.keys(grouped).sort();
const rings = ['Working', 'Practitioner', 'Expert', 'Leading'];

quadrants.forEach(quadrant => {
  markdown += `### ${quadrant}\n\n`;

  rings.forEach(ring => {
    const skills = grouped[quadrant][ring] || [];
    if (skills.length > 0) {
      markdown += `#### ${ring} (${skills.length} skills)\n\n`;
      skills.sort((a, b) => (a.order || 0) - (b.order || 0));
      skills.forEach(skill => {
        markdown += `- **${skill.name}**\n`;
      });
      markdown += '\n';
    }
  });

  markdown += '\n';
});

// Add import instructions
markdown += '## Miro Import Instructions\n\n';
markdown += '### Method 1: CSV Import (Recommended)\n\n';
markdown += '1. Open your Miro board\n';
markdown += '2. Click the three dots menu (...) in the toolbar\n';
markdown += '3. Select "Import from CSV"\n';
markdown += '4. Upload the `miro-export.csv` file\n';
markdown += '5. Map the columns:\n';
markdown += '   - Title → Title\n';
markdown += '   - Description → Description\n';
markdown += '   - Tags → Tags\n';
markdown += '6. Click Import\n';
markdown += '7. Use tags to filter and organize sticky notes into quadrants\n\n';

markdown += '### Method 2: Manual Layout\n\n';
markdown += '1. Create 4 sections on your Miro board (one for each quadrant)\n';
markdown += '2. Within each section, create 4 columns for the rings:\n';
markdown += '   - 🟡 Working (Yellow sticky notes)\n';
markdown += '   - 🟢 Practitioner (Green sticky notes)\n';
markdown += '   - 🔵 Expert (Blue sticky notes)\n';
markdown += '   - 🟣 Leading (Purple sticky notes)\n';
markdown += '3. Add sticky notes for each skill in the appropriate column\n\n';

markdown += '### Color Coding\n\n';
markdown += '- **Yellow**: Working level skills\n';
markdown += '- **Light Green**: Practitioner level skills\n';
markdown += '- **Blue**: Expert level skills\n';
markdown += '- **Purple**: Leading level skills\n\n';

markdown += '## Suggested Miro Layout\n\n';
markdown += '```\n';
markdown += '┌─────────────────────────────────────────────────────────────────┐\n';
markdown += '│                     PROTOTYPING SKILLS RADAR                     │\n';
markdown += '├─────────────────────────────────────────────────────────────────┤\n';
markdown += '│                                                                  │\n';
markdown += '│  ┌─────────────────────────┐  ┌─────────────────────────┐      │\n';
markdown += '│  │   Setup & Deployment    │  │ Components & Patterns   │      │\n';
markdown += '│  │                         │  │                         │      │\n';
markdown += '│  │  🟡 Working (14)        │  │  🟡 Working (10)        │      │\n';
markdown += '│  │  🟢 Practitioner (13)   │  │  🟢 Practitioner (9)    │      │\n';
markdown += '│  │  🔵 Expert (3)          │  │  🔵 Expert (5)          │      │\n';
markdown += '│  │                         │  │                         │      │\n';
markdown += '│  └─────────────────────────┘  └─────────────────────────┘      │\n';
markdown += '│                                                                  │\n';
markdown += '│  ┌─────────────────────────┐  ┌─────────────────────────┐      │\n';
markdown += '│  │   Pages & Layouts       │  │    Data & Logic         │      │\n';
markdown += '│  │                         │  │                         │      │\n';
markdown += '│  │  🟡 Working (14)        │  │  🟡 Working (8)         │      │\n';
markdown += '│  │  🟢 Practitioner (11)   │  │  🟢 Practitioner (7)    │      │\n';
markdown += '│  │  🔵 Expert (4)          │  │  🔵 Expert (10)         │      │\n';
markdown += '│  │                         │  │                         │      │\n';
markdown += '│  └─────────────────────────┘  └─────────────────────────┘      │\n';
markdown += '│                                                                  │\n';
markdown += '└─────────────────────────────────────────────────────────────────┘\n';
markdown += '```\n';

// Write markdown file
const mdOutputPath = path.join(__dirname, '../MIRO_IMPORT_GUIDE.md');
fs.writeFileSync(mdOutputPath, markdown, 'utf8');
console.log(`✅ Miro import guide created: ${mdOutputPath}`);
