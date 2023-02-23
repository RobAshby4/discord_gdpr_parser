const adm = require('adm-zip');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

const help = 'usage: node parser.js {path_to_twitter_data.zip}';

function main() {
  // TODO: get the datapath from the user as argv instead of hardcoding
  if (argv['h'] || process.argv.length < 3) {
    console.log(help);
    return;
  }
  const input = argv['_'][0];
  if (!fs.existsSync(input)) {
    console.error("ERROR: Could not find/open given file, do I have proper access?");
    console.error(help);
    return;
  }
  console.log("file exists")
  const zip = new adm(input);

  // extract to temp folder and parse
  zip.extractAllTo('./tmp/');
  const file = fs.readFileSync('./tmp/twtdata/example1.json');
  data = JSON.parse(file);
  console.log(data);

  // clean up temp folder
  fs.rmSync("./tmp", {recursive: true, force: true});
  console.log("cleaning temp")
}

if (require.main === module) {
  main();
}
