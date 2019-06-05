var through = require('through2');

export function log (label:any) {
    function log (file:any, enc:any, cb:any) {
        console.log(label, ":", file.path);
        cb(null, file);
    }

    return through.obj(log);
};