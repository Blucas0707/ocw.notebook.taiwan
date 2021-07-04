let SQL = require("./SQL_lectures");

// const database = "Course";
// let statement = 'select * from lectures limit 1;'

let api_lectures = {
  //取得lectures GET
  getAllLectures:function(course_id){
    return new Promise((resolve, reject)=>{
      // get courses bt page & category from SQL
      SQL.Course.getLectures(course_id).then((result)=>{
        // console.log("result: " + JSON.stringify(result));
        // console.log("result: " + typeof(JSON.stringify(result)));
        resolve(result);
      })
    });
  },
};
// api_user.Get();
module.exports = api_lectures;
