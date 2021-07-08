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
    connectionLimit: 3,
    queueLimit: 0,
    // timezone: '+8:00',
    // dateStrings: true,
  }),
  Note:{
    getnotes:function(course_id,lecture_id,user_id){
      let sql_statement = "select * from notes where course_id = ? and lecture_id = ? and user_id = ? order by record_date DESC";
      let para = [course_id,lecture_id,user_id];
      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          // console.log(rows);
          let data ={
            "data":[],
          };
          if(rows.length == 0){
            resolve(data);
          }else{
            for(let index=0;index<rows.length;index++){
              let note_id = index + 1;
              let note = rows[index].note;
              let note_time = rows[index].record_date;
              let temp = {
                "note_id":note_id,
                "note":note,
                "note_time":note_time
              };
              data.data.push(temp);
            }
            // console.log("data:" + JSON.stringify(data));
            resolve(data);
          }
        }).catch((err)=>{
          console.log(err);
          let data = {
            "error": true,
            "message": "伺服器內部錯誤"
          };
          // console.log("data:" + data);
          resolve(data);
        })
      });
    },
    postNotes:function(course_id,lecture_id,user_id,note){
      let sql_statement = "insert into notes (course_id, lecture_id, user_id, note)  values (?,?,?,?)";
      let para = [course_id,lecture_id,user_id,note];
      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        // promisePool.query("set time_zone = '+8:00'");
        promisePool.query(sql_statement,para).then(()=>{
          sql_statement = "select * from notes where course_id = ? and lecture_id = ? and user_id = ? order by record_date DESC limit 1"
          promisePool.query(sql_statement,para).then((rows)=>{
            console.log(rows[0][0],rows[0][0].note);
            let data ={
              "data":[],
            };
            let note_id = 1;
            let note = rows[0][0].note;
            let note_time = rows[0][0].record_date;
            let temp = {
              "note_id":note_id,
              "note":note,
              "note_time":note_time
            };
            data.data.push(temp);
          console.log("data:" + JSON.stringify(data));
          // console.log
          resolve(data);
          })
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