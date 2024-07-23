import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';

export function getMysqlUsernameAndPassword(){
    const homedir = os.homedir();
    const usernamePath = path.resolve(homedir, '.vben','username');
    const passwordPath = path.resolve(homedir, '.vben','password');
    const username = fs.readFileSync(usernamePath).toString();
    const password = fs.readFileSync(passwordPath).toString();
    return {
        username: username,
        password: password
    }
}