import { readFileSync, readdirSync, writeFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const puzzlesDir = join(__dirname, '..', 'puzzles');
const outFile = join(__dirname, 'src', 'puzzles.json');

const files = readdirSync(puzzlesDir).filter(f => f.endsWith('.txt')).sort();
const puzzles = files.map(f => {
  const lines = readFileSync(join(puzzlesDir, f), 'utf-8')
    .split('\n')
    .map(l => l.trim())
    .filter(Boolean);
  return { secret: lines[0].toLowerCase(), clues: lines.slice(1) };
});

writeFileSync(outFile, JSON.stringify(puzzles));
console.log(`wrote ${puzzles.length} puzzles to src/puzzles.json`);
