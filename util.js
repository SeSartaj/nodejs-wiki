const fs = require("fs");
const path = require('path');

const dir = "entries";

// using promise 
function list_entries() {
    return new Promise((resolve, reject) => {
        let files = [];
        try {
            let f = fs.readdirSync(dir);
            f.forEach((name) => {
                files.push(remove_ext(name));
            });
            resolve(files);
        } catch (error) {
            reject(null);
        }
    });
}


function remove_ext(filename) {
    return filename.split('.')[0];
}

function save_entry(title, content) {
    return new Promise((resolve, reject) => {
    fs.writeFile(path.join(dir, title + '.md'), content, (err) => {
            if(err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}


function get_entry(title) {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(dir, title + '.md'), {encoding: 'utf8'}, (err, content) => {
            if(err) {
                reject(err);
            }
            else {
                resolve(content);
            }
        })
    });// end of promise  
}

module.exports = {
    list_entries, 
    get_entry, 
    save_entry
}

