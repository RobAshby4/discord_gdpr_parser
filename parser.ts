const adm = require('adm-zip');
const fs = require('fs');
const argv = require('minimist')(process.argv.slice(2));

const help = 'usage: node parser.js {path_to_discord_data.zip}';

type User = {
    id: string;
    username: string;
    email: string;
    phone: string;
    hasMobile: boolean;
    ip: string;
    userActivityId: string[];
    userActivityTime: number[];
    totalTime: number;
}

function cleanTmp() {
    // clean up temp folder
    fs.rmSync('./tmp', {recursive: true, force: true});
    console.log('cleaning temp')
}

function getUserData(): User {
    let usr: User = {
        id: "",
        username: "",
        email: "",
        phone: "",
        hasMobile: false,
        ip: "",
        userActivityId: [],
        userActivityTime: [],
        totalTime: 0,
    };
    if (!fs.existsSync('./tmp/account/user.json')) {
        console.error('ERROR: Could not find/open user data, do I have proper access?');
        cleanTmp();
        process.exit(1);
    }
    const userFile = fs.readFileSync('./tmp/account/user.json')
    const userData = JSON.parse(userFile)
    usr.id = userData.id;
    usr.username = userData.username;
    usr.email = userData.email;
    usr.phone = userData.phone;
    usr.hasMobile = userData.has_mobile;
    usr.ip = userData.ip;
    userData["user_activity_application_statistics"].forEach((activity) => {
        usr.userActivityId.push(activity.application_id);
        usr.userActivityTime.push(activity.total_duration);
    });
    usr.totalTime = usr.userActivityTime.reduce((acc, a) => acc + a, 0);
    return usr;
}

function displayUserInfo(usr: User): void {
    console.log('Important User Data:');
    console.log('User ID: ' + usr.id);
    console.log('| Discord uses a unique user ID to keep track of you')
    console.log('Username and email: ' + usr.username + ' ' + usr.email);
    if (usr.hasMobile) {
        console.log('Phone number: ' + usr.phone);
    }
    console.log('Account ip: ' + usr.ip);
    console.log('| An account ip that is associated with your account.\n| Can provide inferences to things like location and ISP');

    console.log('Logged open applications: ' + usr.userActivityId.length);
    let timeStr = '';
    timeStr = timeStr + Math.floor(((usr.totalTime / 60) / 60) / 24).toString() + ' Days, ';
    timeStr = timeStr + Math.floor((usr.totalTime / 60) / 60 % 24).toString() + ' Hours, ';
    timeStr = timeStr + Math.floor(usr.totalTime / 60 % 60).toString() + ' Minutes, ';
    timeStr = timeStr + Math.floor(usr.totalTime % 60).toString() + ' Seconds';
    console.log('time logged on applications: ' + timeStr);
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
    console.log('file exists')
    const zip = new adm(input);

    // extract to temp folder and parse
    zip.extractAllTo('./tmp/');
    const userData: User = getUserData();
    displayUserInfo(userData);
     
    cleanTmp();
}

if (require.main === module) {
    main();
}
