require('dotenv').config({path:__dirname+'/../../.env'});
// console.log(process.env.RDS_SQL_HOST);
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
    database: "Course", //default: User
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0
  }),
  Course:{
    getLectures:function(course_id){
      // 取得課堂資訊 by course_id
      let data_dict = {
        "course_id":course_id,
        "course_name":"",
        "total":"",
        "data":[]
      };
      let sql_statement = "select courses.course_name,lectures.lecture_id,lectures.lecture_name,lectures.lecture_video,lectures.lecture_duration,lectures.lecture_note,lectures.lecture_reference from lectures inner join courses on lectures.course_id = courses.course_id where lectures.course_id = ?";
      let para = [course_id];

      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          // console.log(rows);
          // console.log(rows.length);
          //沒有資料
          if(rows.length == 0){
            data_dict["total"] = 0;
            data_dict["data"] = null;
          }
          else{
            data_dict["total"] = rows.length;
            data_dict["course_name"] = rows[0]["course_name"];
            for(let index=0;index < rows.length; index++){
                let new_dict = {};
                new_dict["lecture_id"] = index+1;
                new_dict["lecture_name"] = rows[index]["lecture_name"];
                new_dict["lecture_video"] = rows[index]["lecture_video"];
                new_dict["lecture_note"] = rows[index]["lecture_note"];
                new_dict["lecture_reference"] = rows[index]["lecture_reference"];
                data_dict["data"].push(new_dict);
            }
          }
          // console.log(data_dict);
          resolve(data_dict);
        }).catch((err)=>{
          // console.log(err);
          let data = {
            "error": true,
            "message": "伺服器內部錯誤"
          };
          // console.log("data:" + data);
          resolve(data);
        })
      });
    },
  },
};
module.exports = SQL;
