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
    database: "Learning", //default: User
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  }),
  Learnings:{
    updateLecture_status_SQL:function(user_id,course_id,lectures){
      return new Promise((resolve,reject)=>{
        //V2
        //先判斷使用者學習紀錄是否存在=> update or insert
        //先取出該user, 該course 的所有lecture 資料
        let sql_statement = "select * from learnings where course_id = ? and user_id = ? order by lecture_id ASC";
        let para = [course_id,user_id];
        SQL.pool.query(sql_statement,para,(err,rows,fields)=>{
          // console.log("data_inSQL 1:" + rows[0]);
          if(rows.length == 0){ //SQL 沒有資料，user 沒上過
            for(let index=0;index<lectures.length;index++){
              let lecture_id = lectures[index].lecture_id;
              // console.log("lecture_id: " + lecture_id);
              let lecture_video_current = lectures[index].lecture_video_current;
              let lecture_status = lectures[index].lecture_status;
              sql_statement = "insert into learnings (lecture_video_current,lecture_status,user_id,course_id,lecture_id) values (?,?,?,?,?)"
              para = [lecture_video_current,lecture_status,user_id,course_id,lecture_id];
              SQL.pool.query(sql_statement,para,(err,rows,fields)=>{
                if(err){
                  console.log("insert err: " + err);
                }
              })
            }
          }else{//SQL有資料，user有上過
            for(let index=0;index<lectures.length;index++){
              let data_inSQL = rows[index].lecture_video_current;
              // console.log("data_inSQL:" + data_inSQL);
              let lecture_id = lectures[index].lecture_id;
              // console.log("lecture_id: " + lecture_id);
              let lecture_video_current = lectures[index].lecture_video_current;
              let lecture_status = lectures[index].lecture_status;
              //video觀看時間 > video time in SQL => update
              if(lecture_video_current > rows[index].lecture_video_current){
                sql_statement = "update learnings set lecture_video_current = ? ,lecture_status = ? where user_id = ? and course_id = ? and lecture_id = ?"
                para = [lecture_video_current,lecture_status,user_id,course_id,lecture_id];
                SQL.pool.query(sql_statement,para,(err,rows,fields)=>{
                  if(err){
                    console.log("update err: " + err);
                  }
                })
              }
            }
          }
        })
        let data = {
          "ok": true
        };
        resolve(data);
      })
    },
    getOneLecture_status:function(user_id,course_id,lecture_id){
      //找出該user 該課程 該課堂 的video 進度
      let sql_statement = "select lecture_video_current,lecture_status from learnings where user_id = ? and course_id = ? and lecture_id = ? limit 1 ";
      let para = [user_id,course_id,lecture_id];
      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          // console.log(rows);
          let lecture_video_current = rows[0].lecture_video_current;
          let lecture_status = rows[0].lecture_status;
          // console.log(lecture_id + ":" + lecture_video_current);
          let data = {
            "user_id":user_id,
            "course_id":course_id,
            "lecture_id":lecture_id,
            "lecture_video_current":lecture_video_current,
            "lecture_status":lecture_status,
          };
          resolve(data);
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
    getAllLecture_status:function(user_id,course_id){
      let date = new Date();
      // console.log("start: " + date);
      //找出該user 該課程 該課堂 的video 進度
      let sql_statement = "select * from learnings where user_id = ? and course_id = ? order by lecture_id ASC";
      let para = [user_id,course_id];
      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          // console.log("rows" + rows);
          let data = {
            "user_id":user_id,
            "course_id":course_id,
            "lectures":[],
          };
          if(rows.length != 0){
            // let date = new Date();
            // console.log("for start: " + date);
            for(let index=0;index < rows.length; index++){
              let lecture_info = rows[index];
              let lecture_id = lecture_info.lecture_id;
              let lecture_video_current = lecture_info.lecture_video_current;
              let lecture_status = lecture_info.lecture_status;
              let temp = {
                "lecture_id":lecture_id,
                "lecture_video_current":lecture_video_current,
                "lecture_status":lecture_status,
              };
              data.lectures.push(temp);
            }
            let date2 = new Date();
            // console.log("for end: "+date2);
            // console.log("SQL:" + data);
            resolve(data);
          }else{
            let data = {
              "error":true,
              "message": "不存在資料庫中"
            };
            resolve(data);
          }

        }).catch((err)=>{
          // console.log(err);
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
