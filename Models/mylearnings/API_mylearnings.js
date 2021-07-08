let SQL = require("./SQL_mylearnings");

const database = "Learning";
//// let statement = 'select * from lectures limit 1;'
//
let api_mylearnings = {
  //取得User 學習紀錄
  getMyLearnings:function(user_id,page,learning_status,learning_category){
    // console.log("API getAllLecture_status:"+user_id+course_id);
    return new Promise((resolve, reject)=>{
      if(user_id != 0){
        // save in sql
        SQL.myLearnings.getMyLearnings(user_id,page,learning_status,learning_category).then((result)=>{
          // console.log("API getAllLecture_status result: " + JSON.stringify(result));
          resolve(JSON.stringify(result));
          })
      }
    });
  },

};

module.exports = api_mylearnings;
