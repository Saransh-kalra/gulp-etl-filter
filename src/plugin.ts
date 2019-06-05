// import {handlelines} from 'gulp-etl-handlelines'
// const handleLine = (lineObj:any) => {        
//     // return null to remove this line
//     if (lineObj.record["price"] < 20000) {return null}
    
//     // return the changed lineObj
//     return lineObj;
// }

// export function MyPlugin() {
//     return handlelines({}, { transformCallback: handleLine })
// };

var through = require('through2');


function handleLine (lineObj:any) {        
    // return null to remove this line
    if (lineObj.record["price"] > 20000) {return null}
    
    // return the changed lineObj
    return lineObj;
}

export function MyPlugin () {
    function MyPlugin (file:any, enc:any, cb:any) {
      // strArray will hold file.contents, split into lines
      const strArray = (file.contents as Buffer).toString().split(/\r?\n/)
      let resultArray = [];
      // we'll call handleLine on each line
      for (let dataIdx in strArray) {
        try {
          let lineObj
          let tempLine
          if (strArray[dataIdx].trim() != "") {
            lineObj = JSON.parse(strArray[dataIdx])
            tempLine = handleLine(lineObj)
            // add newline before every line execept the first
            if (dataIdx != "0") {
              resultArray.push('\n');
            }
            if (tempLine){
              resultArray.push(JSON.stringify(tempLine));
            }
          }
        } catch (err) {
          console.log(err);
        }
      }
      let data:string = resultArray.join('')
      file.contents = Buffer.from(data)

      // send the transformed file through to the next gulp plugin, and tell the stream engine that we're done with this file
      cb(null, file)
    }

    return through.obj(MyPlugin);
};