#!/usr/bin/env node
/**
 * Build JSON data from a folder of Markdown files with frontmatter.
 *
 * Frontmatter supports at minimum:
 *   name: string (required)
 *   ring: string (required)
 *   quadrant: string (required)
 *   status: string (optional) — one of: New, Moved In, Moved Out, No Change
 *   isNew: boolean|string (optional) — used if status is not provided
 *   topic: string (optional)
 *   order: number (optional) — custom sort order within ring/quadrant
 *
 * The Markdown body will be converted to HTML and used as `description`.
 *
 * Usage:
 *   node scripts/build-from-markdown.js --srcDir data/items-md --out data/prototyping-data.json
 */

const fs = require('fs')
const path = require('path')
const matter = require('gray-matter')
const { marked } = require('marked')

function parseArgs(argv) {
  const args = {}
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--srcDir') args.srcDir = argv[++i]
    else if (a === '--out') args.out = argv[++i]
    else if (a === '--recursive') args.recursive = true
  }
  return args
}

function ensureDir(dir) {
  const p = path.resolve(dir)
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true })
}

function listMarkdownFiles(dir, recursive = false) {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  let files = []
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (recursive) files = files.concat(listMarkdownFiles(full, true))
    } else if (e.isFile() && e.name.toLowerCase().endsWith('.md')) {
      files.push(full)
    }
  }
  return files.sort((a, b) => a.localeCompare(b))
}

function normalizeIsNew(val) {
  if (typeof val === 'boolean') return val ? 'TRUE' : 'FALSE'
  if (typeof val === 'string') {
    const v = val.trim().toLowerCase()
    if (['true', 'yes', 'y', '1', 'new'].includes(v)) return 'TRUE'
    if (['false', 'no', 'n', '0', ''].includes(v)) return 'FALSE'
  }
  return 'FALSE'
}

function validateFrontmatter(fm, file) {
  const missing = []
  ;['name', 'ring', 'quadrant'].forEach((k) => {
    if (!fm[k] || String(fm[k]).trim() === '') missing.push(k)
  })
  if (!fm.status && (fm.isNew === undefined || fm.isNew === null || String(fm.isNew).trim() === '')) {
    missing.push('status|isNew')
  }
  if (missing.length) {
    const hint = 'Required frontmatter: name, ring, quadrant, and either status or isNew.'
    throw new Error(`Invalid frontmatter in ${file}: missing ${missing.join(', ')}. ${hint}`)
  }
}

function fmToOutput(fm, html) {
  const out = {
    name: String(fm.name).trim(),
    ring: String(fm.ring).trim(),
    quadrant: String(fm.quadrant).trim(),
    description: String(html).trim(),
  }
  if (fm.topic) out.topic = String(fm.topic).trim()

  // Always include order field for consistency, even if null
  if (fm.order !== undefined && fm.order !== null) {
    const orderNum = Number(fm.order)
    out.order = !isNaN(orderNum) ? orderNum : null
  } else {
    out.order = null
  }

  if (fm.status && String(fm.status).trim() !== '') out.status = String(fm.status).trim()
  else out.isNew = normalizeIsNew(fm.isNew)
  return out
}

function main() {
  const { srcDir, out, recursive } = parseArgs(process.argv)
  if (!srcDir || !out) {
    console.error('Usage: node scripts/build-from-markdown.js --srcDir <dir> --out <file> [--recursive]')
    process.exit(1)
  }

  const srcPath = path.resolve(srcDir)
  const outPath = path.resolve(out)
  if (!fs.existsSync(srcPath) || !fs.statSync(srcPath).isDirectory()) {
    console.error(`Source directory not found: ${srcPath}`)
    process.exit(1)
  }

  const mdFiles = listMarkdownFiles(srcPath, !!recursive)
  if (mdFiles.length === 0) {
    console.error(`No Markdown files found in ${srcPath}`)
    process.exit(1)
  }

  const results = []
  for (const file of mdFiles) {
    const raw = fs.readFileSync(file, 'utf8')
    const parsed = matter(raw)
    try {
      validateFrontmatter(parsed.data, file)
    } catch (e) {
      console.error(e.message)
      process.exit(1)
    }
    // Convert Markdown body to HTML
    const html = marked.parse(parsed.content || '')
    results.push(fmToOutput(parsed.data, html))
  }

  ensureDir(path.dirname(outPath))
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2) + '\n', 'utf8')
  console.log(`Wrote ${results.length} items to ${outPath}`)
}

try {
  main()
} catch (e) {
  console.error(e.message)
  process.exit(1)
}
