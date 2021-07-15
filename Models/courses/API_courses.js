let SQL = require("./SQL_course");

let api_courses = {
  //取得 GET
  getAllCourse:function(page,category,university){
    return new Promise((resolve, reject)=>{
      // get courses bt page & category from SQL
      SQL.Course.getCourses(page,category,university).then((result)=>{
        resolve(result);
      })
    });
  },
};
module.exports = api_courses;
