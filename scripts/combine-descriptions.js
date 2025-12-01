#!/usr/bin/env node
/**
 * Combine item metadata with HTML description files into a single JSON array
 * Usage:
 *   node scripts/combine-descriptions.js --src data/items.json --descDir data/descriptions --out data/prototyping-data.json
 */

const fs = require('fs')
const path = require('path')

function parseArgs(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--src') args.src = argv[++i]
    else if (a === '--descDir') args.descDir = argv[++i]
    else if (a === '--out') args.out = argv[++i]
  }
  return args
}

function loadJson(filePath) {
  const text = fs.readFileSync(filePath, 'utf8')
  try {
    return JSON.parse(text)
  } catch (e) {
    throw new Error(`Failed to parse JSON at ${filePath}: ${e.message}`)
  }
}

function ensureDir(dir) {
  const p = path.resolve(dir)
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

function normalizeIsNew(isNewValue) {
  if (typeof isNewValue === 'boolean') return isNewValue ? 'TRUE' : 'FALSE'
  if (typeof isNewValue === 'string') {
    const v = isNewValue.trim().toLowerCase()
    if (v === 'true' || v === 'yes' || v === '1') return 'TRUE'
    if (v === 'false' || v === 'no' || v === '0' || v === '') return 'FALSE'
  }
  return 'FALSE'
}

function validateItem(i, index) {
  const missing = []
  ;['name', 'ring', 'quadrant'].forEach((k) => {
    if (!i[k] || String(i[k]).trim() === '') missing.push(k)
  })
  if (!i.isNew && !i.status) {
    // allow either isNew or status
    missing.push('isNew/status')
  }
  if (!i.descriptionFile) missing.push('descriptionFile')
  if (missing.length) {
    throw new Error(
      `Item #${index + 1} is missing required fields: ${missing.join(', ')}. Offending item: ${JSON.stringify(i)}`,
    )
  }
}

function main() {
  const { src, descDir, out } = parseArgs(process.argv)
  if (!src || !descDir || !out) {
    console.error('Usage: node scripts/combine-descriptions.js --src <items.json> --descDir <dir> --out <out.json>')
    process.exit(1)
  }

  const srcPath = path.resolve(src)
  const descPath = path.resolve(descDir)
  const outPath = path.resolve(out)

  const items = loadJson(srcPath)
  if (!Array.isArray(items)) throw new Error(`Expected an array in ${srcPath}`)

  const combined = items.map((item, idx) => {
    validateItem(item, idx)
    const filePath = path.join(descPath, item.descriptionFile)
    if (!fs.existsSync(filePath)) {
      throw new Error(`Description file not found: ${filePath}`)
    }
    const descriptionHtml = fs.readFileSync(filePath, 'utf8')
    const outItem = {
      name: String(item.name).trim(),
      ring: String(item.ring).trim(),
      quadrant: String(item.quadrant).trim(),
      description: descriptionHtml.trim(),
    }
    if (item.topic) outItem.topic = String(item.topic).trim()
    if (item.status) outItem.status = String(item.status).trim()
    else outItem.isNew = normalizeIsNew(item.isNew)
    return outItem
  })

  ensureDir(path.dirname(outPath))
  fs.writeFileSync(outPath, JSON.stringify(combined, null, 2) + '\n', 'utf8')
  console.log(`Wrote ${combined.length} items to ${outPath}`)
}

try {
  main()
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
