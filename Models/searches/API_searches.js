let ES = require("./ES");

//// const database = "Course";
// let statement = 'select * from lectures limit 1;'

let api_searches = {
  //取得 GET
  searchKeyword:function(keyword){
    return new Promise((resolve, reject)=>{
      // get courses bt page & category from SQL
      ES.searchKeyword(keyword).then((result)=>{
        // console.log("result: " + JSON.stringify(result));
        // console.log("result: " + typeof(JSON.stringify(result)));
        resolve(result);
      })
    });
  },
};
// api_user.Get();
module.exports = api_searches;
