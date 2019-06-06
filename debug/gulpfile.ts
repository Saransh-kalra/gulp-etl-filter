/* TypeScript: pfilters records in ndjson file according to the condition provided */

import { src, dest } from 'gulp'
import * as rename from 'gulp-rename'
const errorHandler = require('gulp-error-handle'); // handle all errors in one handler, but still stop the stream if there are errors

import {log} from '../src/log'
import {MyPlugin} from '../src/plugin'

export function processCsv(callback: any) {
    try {    
        return src(['../testdata/*.ndjson'], {buffer: true})
        .pipe(errorHandler(function(err:any) {
            console.error('oops: ' + err)
            callback(err)
          }))        
        .on('data', function (file:any) {
            console.log('TypeScript: Starting processing on ' + file.basename)
        })  
        .pipe(rename({ extname: ".ndjson" })) // rename to *.ndjson
        .on('data', function (file:any) {
            console.log('Done parsing ' + file.basename)
        })  
        .pipe(MyPlugin({ColumnName:"price",Operator:"<",Value:20000}))
        .pipe(rename({suffix:"-parsed", extname: ".ndjson" })) // rename to *-parsed.ndjson
        .on('data', function (file:any) {
            console.log('Done processing on ' + file.basename)
        })
        .pipe(log('gulpfile'))  
        .pipe(dest('../testdata/processed/'));
    }
    catch (err) {
        console.error(err)    
    }
}