let SQL = require("./SQL_course");

//// const database = "Course";
// let statement = 'select * from lectures limit 1;'

let api_courses = {
  //取得 GET
  getAllCourse:function(page,category,university){
    return new Promise((resolve, reject)=>{
      // get courses bt page & category from SQL
      SQL.Course.getCourses(page,category,university).then((result)=>{
        // console.log("result: " + JSON.stringify(result));
        // console.log("result: " + typeof(JSON.stringify(result)));
        resolve(result);
      })
    });
  },
};
// api_user.Get();
module.exports = api_courses;
