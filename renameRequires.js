const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'backend');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    if (f !== 'models' && f !== 'node_modules' && isDirectory) {
      walkDir(dirPath, callback);
    } else if (!isDirectory && dirPath.endsWith('.js')) {
      callback(path.join(dir, f));
    }
  });
}

const replacements = [
  { search: /require\("\.\.\/models\/EmailAction"\)/g, replace: 'require("../models/smartlogin/EmailAction")' },
  { search: /require\("\.\.\/models\/AttackLog"\)/g, replace: 'require("../models/smartlogin/AttackLog")' },
  { search: /require\("\.\.\/models\/blockedIP"\)/g, replace: 'require("../models/smartlogin/BlockedIP")' },
  { search: /require\("\.\.\/models\/BlockedIP"\)/g, replace: 'require("../models/smartlogin/BlockedIP")' },
  { search: /require\("\.\.\/models\/User"\)/g, replace: 'require("../models/smartlogin/User")' },
  { search: /require\("\.\.\/models\/Website"\)/g, replace: 'require("../models/threatguard/Website")' },
  { search: /require\("\.\.\/models\/Owner"\)/g, replace: 'require("../models/threatguard/Owner")' }
];

walkDir(directoryPath, function(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;
  
  replacements.forEach(r => {
    newContent = newContent.replace(r.search, r.replace);
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated ${filePath}`);
  }
});

// also process the root backend files if any
const rootFiles = ['server.js', 'append_functions.js'];
rootFiles.forEach(f => {
  const p = path.join(directoryPath, f);
  if (fs.existsSync(p)) {
      let content = fs.readFileSync(p, 'utf8');
      let newContent = content;
      replacements.forEach(r => {
        // Here we search for "./models/" instead of "../models/" just in case
        let rootSearch = new RegExp(r.search.source.replace('\\.\\.', '\\.'), 'g');
        let rootReplace = r.replace.replace('../', './');
        newContent = newContent.replace(rootSearch, rootReplace);
        
        // Also replace if they use the ../ models
        newContent = newContent.replace(r.search, r.replace);
      });
      if (content !== newContent) {
        fs.writeFileSync(p, newContent, 'utf8');
        console.log(`Updated ${p}`);
      }
  }
});
