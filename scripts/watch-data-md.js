#!/usr/bin/env node
/**
 * Watch a folder of Markdown files and rebuild JSON on changes.
 *
 * Usage:
 *   node scripts/watch-data-md.js --srcDir data/items-md --out data/prototyping-data.json [--recursive]
 */

const path = require('path')
const { spawn } = require('child_process')
const chokidar = require('chokidar')

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

function runBuild({ srcDir, out, recursive }) {
  return new Promise((resolve) => {
    const args = ['scripts/build-from-markdown.js', '--srcDir', srcDir, '--out', out]
    if (recursive) args.push('--recursive')
    const proc = spawn(process.execPath, args, { stdio: 'inherit' })
    proc.on('exit', (code) => resolve(code === 0))
  })
}

function debounce(fn, delay) {
  let t
  return (...args) => {
    clearTimeout(t)
    t = setTimeout(() => fn(...args), delay)
  }
}

async function main() {
  const { srcDir, out, recursive } = parseArgs(process.argv)
  if (!srcDir || !out) {
    console.error('Usage: node scripts/watch-data-md.js --srcDir <dir> --out <file> [--recursive]')
    process.exit(1)
  }

  const srcPath = path.resolve(srcDir)
  const outPath = path.resolve(out)
  console.log(`[watch:data:md] Watching ${srcPath} -> ${outPath}${recursive ? ' (recursive)' : ''}`)

  // Initial build
  await runBuild({ srcDir: srcPath, out: outPath, recursive })

  const patterns = [path.join(srcPath, '**/*.md')]
  const watcher = chokidar.watch(patterns, {
    ignoreInitial: true,
  })

  const rebuild = debounce(async (event, file) => {
    console.log(`[watch:data:md] Change detected (${event}): ${file}`)
    const ok = await runBuild({ srcDir: srcPath, out: outPath, recursive })
    if (ok) console.log(`[watch:data:md] Rebuilt ${outPath}`)
    else console.error('[watch:data:md] Build failed. Waiting for further changes…')
  }, 250)

  watcher
    .on('add', (f) => rebuild('add', f))
    .on('change', (f) => rebuild('change', f))
    .on('unlink', (f) => rebuild('unlink', f))
    .on('error', (err) => console.error('[watch:data:md] Watcher error:', err))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
