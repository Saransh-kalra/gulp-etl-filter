var through = require('through2');

export class ConfigObj {
  ColumnName?: string;
  Operator?: string;
  Value?: number;
}

function handleLine (lineObj:any, columnName:string, operator:string, value:any) {        
    // return the changed lineObj
    if (eval(lineObj.record[columnName] + operator + value)) {return lineObj}
    
    // return null to remove this line
    return null;
}

export function MyPlugin (configObj: ConfigObj) {
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
            //Operator?: string[] = ["<",">","<=",">=","==","!="];
            tempLine = handleLine(lineObj, configObj.ColumnName + "", configObj.Operator + "", Number(configObj.Value));
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

  if(configObj.Operator == "<" || configObj.Operator == ">" || configObj.Operator == "<=" || configObj.Operator == ">=" || configObj.Operator == "==" || configObj.Operator == "!=") {
    return through.obj(MyPlugin);
  }
  else{
    console.log("Try Again with a valid operator in [\"<\",\">\",\"<=\",\">=\",\"==\",\"!=\"]")
    return null;
  }
    
};