const fs = require('fs');
const path = require('path');

// Read the JSON file
const dataPath = path.join(__dirname, '../data/prototyping-data-raw.json');
const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

// Create items-md directory if it doesn't exist
const outputDir = path.join(__dirname, '../data/items-md');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

async function generateDescription(item) {
  const prompt = `You are an expert at using the GOV.UK and NHS.UK prototyping kits. Write a helpful description for the following skill used in prototyping.

Skill: ${item.name}
Quadrant: ${item.quadrant}
Ring: ${item.ring}

Write the description in this exact format using markdown:

## What is this skill?

[1-2 sentences explaining what this skill involves]

## Why is it important?

[3-4 bullet points explaining the benefits]

## Where to learn more

[2-3 bullet points with relevant resources - use real GOV.UK, NHS.UK, or official documentation links where possible]

Keep it concise and practical for prototype developers.`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${OPENAI_API_KEY}`
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    })
  });

  const result = await response.json();
  return result.choices[0].message.content;
}

async function main() {
  if (!OPENAI_API_KEY) {
    console.error('Error: Set OPENAI_API_KEY environment variable');
    process.exit(1);
  }

  for (const item of data) {
    const filename = item.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '') + '.md';

    console.log(`Generating: ${item.name}...`);

    const description = await generateDescription(item);

    const content = `---
name: "${item.name}"
ring: "${item.ring}"
quadrant: "${item.quadrant}"
status: "${item.status}"
---

${description}
`;

    const filepath = path.join(outputDir, filename);
    fs.writeFileSync(filepath, content, 'utf8');
    console.log(`✓ Created: ${filename}`);

    // Rate limiting delay
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✓ Created ${data.length} markdown files in ${outputDir}`);
}

main().catch(console.error);
