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

// Sort skills by order within each ring
Object.keys(grouped).forEach(quadrant => {
  Object.keys(grouped[quadrant]).forEach(ring => {
    grouped[quadrant][ring].sort((a, b) => (a.order || 0) - (b.order || 0));
  });
});

const quadrants = ['Setup and Deployment', 'Components and Patterns', 'Pages and Layouts', 'Data and Logic'];
const rings = ['Working', 'Practitioner', 'Expert', 'Leading'];

// Create a simple grid layout for Miro
let output = '# SKILLS RADAR - GRID LAYOUT FOR MIRO\n\n';
output += '## Quick Stats\n\n';
output += `Total Skills: ${data.length}\n`;
output += `Quadrants: ${quadrants.length}\n`;
output += `Levels: ${rings.length}\n\n`;

output += '## Suggested Miro Board Structure\n\n';
output += 'Create 4 sections (one per quadrant), each with 4 columns (one per ring level).\n';
output += 'Use the color coding: Yellow (Working), Green (Practitioner), Blue (Expert), Purple (Leading)\n\n';

output += '═'.repeat(120) + '\n\n';

quadrants.forEach((quadrant, qIndex) => {
  output += `## QUADRANT ${qIndex + 1}: ${quadrant}\n\n`;

  rings.forEach(ring => {
    const skills = grouped[quadrant]?.[ring] || [];
    if (skills.length > 0) {
      output += `### ${ring.toUpperCase()} (${skills.length} skills)\n\n`;

      skills.forEach((skill, idx) => {
        output += `${idx + 1}. ${skill.name}\n`;
      });
      output += '\n';
    }
  });

  output += '─'.repeat(120) + '\n\n';
});

// Create a summary table
output += '## Summary Table\n\n';
output += '| Quadrant | Working | Practitioner | Expert | Leading | Total |\n';
output += '|----------|---------|--------------|--------|---------|-------|\n';

let totalByRing = { Working: 0, Practitioner: 0, Expert: 0, Leading: 0 };

quadrants.forEach(quadrant => {
  const counts = {};
  let total = 0;

  rings.forEach(ring => {
    const count = grouped[quadrant]?.[ring]?.length || 0;
    counts[ring] = count;
    total += count;
    totalByRing[ring] += count;
  });

  output += `| ${quadrant} | ${counts.Working || 0} | ${counts.Practitioner || 0} | ${counts.Expert || 0} | ${counts.Leading || 0} | **${total}** |\n`;
});

const grandTotal = Object.values(totalByRing).reduce((a, b) => a + b, 0);
output += `| **TOTAL** | **${totalByRing.Working}** | **${totalByRing.Practitioner}** | **${totalByRing.Expert}** | **${totalByRing.Leading}** | **${grandTotal}** |\n\n`;

// Create Miro-specific layout instructions
output += '## Miro Layout Instructions\n\n';
output += '### Step 1: Set Up Your Board\n\n';
output += '1. Create a large frame titled "Prototyping Skills Radar"\n';
output += '2. Divide it into 4 equal sections (quadrants)\n';
output += '3. Label each section with a quadrant name\n\n';

output += '### Step 2: Import Data\n\n';
output += '**Option A - CSV Import (Fastest):**\n';
output += '1. In Miro, click "..." (three dots) → "Import from CSV"\n';
output += '2. Upload `miro-export.csv`\n';
output += '3. All sticky notes will be imported with titles, descriptions, and tags\n';
output += '4. Filter by tag to organize into quadrants\n\n';

output += '**Option B - JSON + Script (Advanced):**\n';
output += '1. Use `miro-export.json` with Miro API\n';
output += '2. This includes color coding for each ring level\n';
output += '3. Requires Miro app/API access\n\n';

output += '**Option C - Manual Entry:**\n';
output += '1. Use this document as reference\n';
output += '2. Create sticky notes for each skill\n';
output += '3. Apply color coding based on ring level\n\n';

output += '### Step 3: Organize by Rings\n\n';
output += 'Within each quadrant, arrange sticky notes in columns:\n\n';
output += '```\n';
output += 'Quadrant: [Name]\n';
output += '┌──────────────┬──────────────┬──────────────┬──────────────┐\n';
output += '│   Working    │ Practitioner │    Expert    │   Leading    │\n';
output += '│   (Yellow)   │   (Green)    │    (Blue)    │   (Purple)   │\n';
output += '├──────────────┼──────────────┼──────────────┼──────────────┤\n';
output += '│ [skills...]  │ [skills...]  │ [skills...]  │ [skills...]  │\n';
output += '└──────────────┴──────────────┴──────────────┴──────────────┘\n';
output += '```\n\n';

output += '### Step 4: Add Visual Elements\n\n';
output += '- Use frames to separate quadrants\n';
output += '- Add connector lines to show skill progressions\n';
output += '- Use shapes/icons to highlight key skills\n';
output += '- Add notes for context or questions\n\n';

output += '### Color Guide\n\n';
output += '- 🟡 **Yellow** = Working level (foundational skills)\n';
output += '- 🟢 **Green** = Practitioner level (intermediate skills)\n';
output += '- 🔵 **Blue** = Expert level (advanced skills)\n';
output += '- 🟣 **Purple** = Leading level (cutting-edge skills)\n\n';

// Write the file
const outputPath = path.join(__dirname, '../MIRO_LAYOUT.txt');
fs.writeFileSync(outputPath, output, 'utf8');
console.log(`✅ Miro layout guide created: ${outputPath}`);

// Also create a simplified checklist
let checklist = '# MIRO IMPORT CHECKLIST\n\n';
checklist += '## Files Available\n\n';
checklist += '- [ ] `miro-export.csv` - CSV file for direct import to Miro\n';
checklist += '- [ ] `miro-export.json` - JSON with structured data and color codes\n';
checklist += '- [ ] `MIRO_IMPORT_GUIDE.md` - Detailed guide with all skills listed\n';
checklist += '- [ ] `MIRO_LAYOUT.txt` - Grid layout and instructions\n\n';

checklist += '## Import Steps\n\n';
checklist += '1. [ ] Open Miro board\n';
checklist += '2. [ ] Click "..." menu → "Import from CSV"\n';
checklist += '3. [ ] Upload `miro-export.csv`\n';
checklist += '4. [ ] Map columns (Title → Title, Description → Description, Tags → Tags)\n';
checklist += '5. [ ] Click Import\n';
checklist += '6. [ ] Filter by tag "components-and-patterns" to find those skills\n';
checklist += '7. [ ] Move to appropriate section\n';
checklist += '8. [ ] Repeat for other tags: "data-and-logic", "pages-and-layouts", "setup-and-deployment"\n';
checklist += '9. [ ] Apply color coding: Yellow (working), Green (practitioner), Blue (expert), Purple (leading)\n';
checklist += '10. [ ] Arrange in grid layout with rings as columns\n\n';

checklist += '## Quick Reference\n\n';
checklist += `Total skills to import: ${data.length}\n\n`;

checklist += '### By Quadrant:\n';
quadrants.forEach(quadrant => {
  const count = Object.values(grouped[quadrant] || {}).reduce((sum, skills) => sum + skills.length, 0);
  checklist += `- ${quadrant}: ${count} skills\n`;
});

checklist += '\n### By Ring:\n';
rings.forEach(ring => {
  checklist += `- ${ring}: ${totalByRing[ring]} skills\n`;
});

const checklistPath = path.join(__dirname, '../MIRO_CHECKLIST.md');
fs.writeFileSync(checklistPath, checklist, 'utf8');
console.log(`✅ Miro checklist created: ${checklistPath}`);

console.log('\n📦 All export files ready!');
console.log('   - miro-export.csv (for direct import)');
console.log('   - miro-export.json (structured data)');
console.log('   - MIRO_IMPORT_GUIDE.md (detailed guide)');
console.log('   - MIRO_LAYOUT.txt (grid layout)');
console.log('   - MIRO_CHECKLIST.md (import steps)');
