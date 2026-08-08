const fs = require('fs');
const path = require('path');
function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = dir + '/' + file;
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(file));
    } else {
      results.push(file);
    }
  });
  return results;
}
const files = walk('./src').filter(f => f.endsWith('.tsx') || f.endsWith('.ts'));
files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('fraktur.className') || content.includes('fraktur.style') || content.includes('UnifrakturMaguntia')) {
    content = content.replace(/\$\{fraktur\.className\}/g, 'font-fraktur');
    content = content.replace(/import\s*\{[^}]*UnifrakturMaguntia[^}]*\}\s*from\s*['"]next\/font\/google['"];?/g, (match) => {
        if(match.includes(',')) {
            return match.replace(/,\s*UnifrakturMaguntia|\s*UnifrakturMaguntia\s*,?/, '');
        }
        return '';
    });
    content = content.replace(/const\s+fraktur\s*=\s*UnifrakturMaguntia\(\{[\s\S]*?\}\);?/g, '');
    fs.writeFileSync(f, content);
    console.log('Updated', f);
  }
});
