let SQL = require("./SQL_mylearnings");

let api_mylearnings = {
  //取得User 學習紀錄
  getMyLearnings:function(user_id,page,learning_status,learning_category){
    return new Promise((resolve, reject)=>{
      if(user_id != 0){
        // save in sql
        SQL.myLearnings.getMyLearnings(user_id,page,learning_status,learning_category).then((result)=>{
          resolve(JSON.stringify(result));
          })
      }
    });
  },

};

module.exports = api_mylearnings;
