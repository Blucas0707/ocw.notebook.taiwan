require('dotenv').config({path:__dirname+'/../../.env'});

const mysql = require('mysql2');
//建立SQL物件
let SQL = {
  host: process.env.RDS_SQL_HOST,
  sql_execute_statement:null,
  pool:mysql.createPool({
    host: process.env.RDS_SQL_HOST,
    port: process.env.RDS_SQL_PORT,
    user: process.env.RDS_SQL_USER,
    password: process.env.RDS_SQL_PASSWORD,
    database: "Learning", //default: User
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }),
  myLearnings:{
    //取得學習紀錄
    getMyLearnings:function(user_id,page,learning_status,learning_category){
      // console.log(learning_category);
      //取得課程資訊 by page & category 每頁12筆
      let next_page = parseInt(page,10) + 1;
      let offset = page * 12;
      // console.log("sql:",user_id,page,learning_status,learning_category,offset);
      let data_dict = {
            "nextPage": next_page,
            "data":[]
        };
      let sql_statement, para;
      if(learning_status==0 || learning_status==100) { //進度尚未開始 or 已完成
        if(learning_category != "%"){
            sql_statement = "select a.course_id,a.course_status , b.course_name, b.course_teacher,b.course_description,b.course_cover from Learning.course_status as a NATURAL JOIN Course.courses as b  where a.user_id = ? and a.course_status = ? and b.course_category = ? order by a.course_id ASC limit ?,12;";
            para = [user_id,learning_status,learning_category,offset];
        }else{
          sql_statement = "select a.course_id,a.course_status , b.course_name, b.course_teacher,b.course_description,b.course_cover from Learning.course_status as a NATURAL JOIN Course.courses as b  where a.user_id = ? and a.course_status = ? order by a.course_id ASC limit ?,12;";
          para = [user_id,learning_status,offset];
        }

      }else if(learning_status==-1){ //全部
        if(learning_category != "%"){
          sql_statement = "select a.course_id,a.course_status , b.course_name, b.course_teacher,b.course_description,b.course_cover from Learning.course_status as a NATURAL JOIN Course.courses as b  where a.user_id = ? and a.course_status >= ? and b.course_category = ? order by a.course_id ASC limit ?,12;";
          para = [user_id,learning_status+1,learning_category,offset];
        }else{
          sql_statement = "select a.course_id,a.course_status , b.course_name, b.course_teacher,b.course_description,b.course_cover from Learning.course_status as a NATURAL JOIN Course.courses as b  where a.user_id = ? and a.course_status >= ? order by a.course_id ASC limit ?,12;";
          para = [user_id,learning_status+1,offset];
        }
      }else{ //進行中
        if(learning_category != "%"){
          sql_statement = "select a.course_id,a.course_status , b.course_name, b.course_teacher,b.course_description,b.course_cover from Learning.course_status as a NATURAL JOIN Course.courses as b  where a.user_id = ? and a.course_status >= ? and a.course_status < 100 and b.course_category = ? order by a.course_id ASC limit ?,12;";
          para = [user_id,learning_status,learning_category,offset];
        }else{
          sql_statement = "select a.course_id,a.course_status , b.course_name, b.course_teacher,b.course_description,b.course_cover from Learning.course_status as a NATURAL JOIN Course.courses as b  where a.user_id = ? and a.course_status >= ? and a.course_status < 100 order by a.course_id ASC limit ?,12;";
          para = [user_id,learning_status,offset];
        }
      }
      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          if(rows.length != 0){
            for(let index=0;index < rows.length; index++){
              let course_info = rows[index];
              let course_id = course_info.course_id;
              let course_name = course_info.course_name;
              // let course_category = course_info.course_category;
              let course_teacher = course_info.course_teacher;
              let course_description = course_info.course_description;
              let course_cover = course_info.course_cover;
              let course_status = course_info.course_status;
              let temp = {
                "user_id":user_id,
                "course_id":course_id,
                "course_name":course_name,
                // "course_category":course_category,
                "course_teacher":course_teacher,
                "course_description":course_description,
                "course_cover":course_cover,
                "course_status":course_status
              };
              data_dict.data.push(temp);
            }
            resolve(data_dict);
          }else{
            let data = {
              "nextPage": null,
              "data":null
            };
            resolve(data);
          }
        }).catch((err)=>{
          console.log(err);
          let data = {
            "error": true,
            "message": "伺服器內部錯誤"
          };
          resolve(data);
        })
      });
    },
  },
};
module.exports = SQL;
