let SQL = require("./SQL_learnings");

const database = "Learning";
// let statement = 'select * from lectures limit 1;'

let api_learnings = {
  //更新 Lecture status
  updateLecture_status:function(data){
    return new Promise((resolve, reject)=>{
      let user_id = data.user_id.toString();
      let course_id = data.course_id.toString();
      let lectures = data.lectures;
      if(user_id != 0){
        // save in sql
        SQL.Learnings.updateLecture_status_SQL(user_id,course_id,lectures).then((result)=>{
          resolve(JSON.stringify(result));
          console.log("updateLecture_status Done!");
          })
      }
    });
  },
  //取得單一課堂 GET
  getOneLecture_status:function(user_id,course_id,lecture_id){
    return new Promise((resolve, reject)=>{
      if(user_id != 0){
        // save in sql
        SQL.Learnings.getOneLecture_status(user_id,course_id,lecture_id).then((result)=>{
          resolve(JSON.stringify(result));
          })
      }
    });
  },
  //取得該課程全課堂 GET
  getAllLecture_status:function(user_id,course_id){
    return new Promise((resolve, reject)=>{
      if(user_id != 0){
        // save in sql
        SQL.Learnings.getAllLecture_status(user_id,course_id).then((result)=>{
          resolve(JSON.stringify(result));
          })
      }
    });
  },

};

module.exports = api_learnings;
