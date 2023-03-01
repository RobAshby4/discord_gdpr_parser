const adm = require('adm-zip');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

const help = 'usage: node parser.js {path_to_discord_data.zip}';

type User = {
    id: string;
    username: string;
    email: string;
    phone: string;
    has_mobile: boolean;
    ip: string;
    user_activity_id: string[];
    user_activity_time: number[];
}


function getUserData(): User {
    let usr: User = {
        id: "",
        username: "",
        email: "",
        phone: "",
        has_mobile: false,
        ip: "",
        user_activity_id: [],
        user_activity_time: []
    };
    if (!fs.existsSync('./tmp/package/data/user.json')) {
        console.error('ERROR: Could not find/open user data, do I have proper access?');
        process.exit(1);
    }
    const userFile = fs.readFileSync('./tmp/package/data/user.json')
    const userData = JSON.parse(userFile)
    usr.id = userData.id;
    usr.username = userData.username;
    usr.email = userData.email;
    usr.phone = userData.phone;
    usr.has_mobile = userData.has_mobile;
    usr.ip = userData.ip;
    userData["user_activity_application_statistics"].forEach((activity) => {
        usr.user_activity_id.push(activity.application_id);
        usr.user_activity_time.push(activity.total_duration);
    });
    return usr;
}

function main() {
  if (argv['h'] || process.argv.length < 3) {
    console.log(help);
    return;
  }
  const input = argv['_'][0];
  if (!fs.existsSync(input)) {
    console.error('ERROR: Could not find/open given file, do I have proper access?');
    console.error(help);
    return;
  }
  console.log("file exists")
  const zip = new adm(input);

  // extract to temp folder and parse
  zip.extractAllTo('./tmp/');
  const usrData: User = getUserData();
  console.log(usrData);

  // clean up temp folder
  fs.rmSync("./tmp", {recursive: true, force: true});
  console.log("cleaning temp")
}

if (require.main === module) {
  main();
}
