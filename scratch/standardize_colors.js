const fs = require('fs');
const path = require('path');

const DIRECTORIES = ['components', 'app'];
const EXTENSIONS = ['.tsx', '.ts', '.css'];

const REPLACEMENTS = [
  // Hardcoded hex codes to semantic tokens
  { regex: /\[#040605\]/gi, replacement: 'void' },
  { regex: /\[#0A110E\]/gi, replacement: 'panel' },
  { regex: /\[#50E3C2\]/gi, replacement: 'mint' },
  { regex: /\[#3DD9FF\]/gi, replacement: 'blue' },
  { regex: /\[#FF4D3D\]/gi, replacement: 'coral' },
  { regex: /\[#070B08\]/gi, replacement: 'void' },
  { regex: /\[#0D140E\]/gi, replacement: 'panel' },
  { regex: /\[#E8A33D\]/gi, replacement: 'coral' }, // Mapping old amber to new coral glitch
  // Simple global replaces for the missed legacy lime green colors
  { regex: /#7ED321/gi, replacement: '#50E3C2' }, // Lime to Mint
  { regex: /#4C9E0D/gi, replacement: '#3DD9FF' }, // Dark green to Hologram Blue
  
  // Let's also do a safe replace for raw hex strings in style objects or framer motion, e.g. color: '#50E3C2'
  { regex: /['"]#070B08['"]/gi, replacement: "'#040605'" }, // Old void to new void
  { regex: /['"]#0D140E['"]/gi, replacement: "'#0A110E'" }, // Old panel to new panel
  { regex: /['"]#E8A33D['"]/gi, replacement: "'#FF4D3D'" }, // Old amber to coral
  { regex: /['"]#F5F5F0['"]/gi, replacement: "'#FFFFFF'" }, // Old cream to stark white
  { regex: /['"]#8A9488['"]/gi, replacement: "'#9CA3AF'" }  // Old muted to new muted slate
];

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      processDirectory(fullPath);
    } else if (EXTENSIONS.includes(path.extname(fullPath))) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  for (const { regex, replacement } of REPLACEMENTS) {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      hasChanges = true;
    }
  }

  if (hasChanges) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

console.log('Starting color standardization...');
for (const dir of DIRECTORIES) {
  const fullPath = path.join(process.cwd(), dir);
  if (fs.existsSync(fullPath)) {
    processDirectory(fullPath);
  } else {
    console.warn(`Directory not found: ${fullPath}`);
  }
}
console.log('Color standardization complete!');
