// One-off: turn the sentiment tool's tier files into src/data/lexicon.json ({ word: points }).
// Usage: node scripts/build-lexicon.mjs <path to the tool's lexicons/general folder>
import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const dir = process.argv[2]
if (!dir) throw new Error('usage: node scripts/build-lexicon.mjs <lexicons/general folder>')

// Same lookup order as get_word_points_with_pos: strong, medium, mild; positive before negative.
const tiers = [
  ['pos_strong', 3],
  ['pos_medium', 2],
  ['pos_mild', 1],
  ['neg_strong', -3],
  ['neg_medium', -2],
  ['neg_mild', -1],
]

const lexicon = {}
for (const [file, points] of tiers) {
  for (const line of readFileSync(join(dir, file), 'utf8').split(/\r?\n/)) {
    const word = line.trim().toLowerCase()
    if (word && !(word in lexicon)) lexicon[word] = points
  }
}

const out = new URL('../src/data/lexicon.json', import.meta.url)
writeFileSync(out, JSON.stringify(lexicon))
console.log(`lexicon: ${Object.keys(lexicon).length} words`)
