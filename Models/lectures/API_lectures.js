let SQL = require("./SQL_lectures");

let api_lectures = {
  //取得lectures GET
  getAllLectures:function(course_id){
    return new Promise((resolve, reject)=>{
      // get courses bt page & category from SQL
      SQL.Course.getLectures(course_id).then((result)=>{
        resolve(result);
      })
    });
  },
};
// api_user.Get();
module.exports = api_lectures;
