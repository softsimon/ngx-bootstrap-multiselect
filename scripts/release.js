const fs = require('fs');
var copyfiles = require('copyfiles');
const package = require('../package.json');

delete package.scripts;
delete package.devDependencies;

package.main = patchPath(package.main);
package.module = patchPath(package.module);
package.typings = patchPath(package.typings);

try {
  fs.writeFileSync('dist/package.json', JSON.stringify(package, null, '  '));
  console.log('package.json was written');
} catch (e) {
  console.error(`Failed to write package.json file due to: ${e}`);
}

try {
  copyfiles([
    'README.md',
    'LICENSE',
    'yarn.lock',
    'dist' // Destination path
  ], {}, () => null);
  console.log('Copied additional files');
} catch (e) {
  console.error(`Failed to copy additional files due to: ${e}`);
}

function patchPath(path) {
  return path.replace('dist/', '');
}
