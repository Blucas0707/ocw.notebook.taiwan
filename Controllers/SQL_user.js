require('dotenv').config({path:__dirname+'/../.env'});
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
    database: "User", //default: User
    waitForConnections: true,
    connectionLimit: 3,
    queueLimit: 0
  }),
  User:{
    login:function(email,password){
      // check user eisted
      let isUserExisted = null;
      let sql_statement = "select count(*) from users where user_email = ? and user_password = ? ";
      let para = [email, password];
      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          // console.log(rows[0]["count(*)"])
          if(rows[0]["count(*)"] == 1){ //user existed
              let data = {
                "ok": true
              };
              // console.log("data:" + data);
              resolve(data);
            }
          else{
            let data = {
              "error": true,
              "message": "登入失敗，帳號或密碼錯誤或其他原因"
            };
            // console.log("data:" + data);
            resolve(data);
          }
          // console.log(this.isUserExisted);
        }).catch(()=>{
          let data = {
            "error": true,
            "message": "伺服器內部錯誤"
          };
          // console.log("data:" + data);
          resolve(data);
        })
      });
    },
    register:function(name,email,password){
      // check user eisted
      let isUserExisted = null;
      let sql_statement = "select count(*) from users where user_email = ? limit 1 ";
      let para = [email];
      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          // console.log(rows[0]["count(*)"])
          if(rows[0]["count(*)"] == 0){ //not existed
            this.isUserExisted = false;
            //update user to SQL
            sql_statement = "insert into users (user_name, user_email, user_password)  values (?,?,?)";
            para = [name,email,password];
            promisePool.query(sql_statement, para).then(([rows, fields])=>{
              // console.log(rows);
              let data = {
                "ok": true
              };
              // console.log("data:" + data);
              resolve(data);

            })
          }else{
            this.isUserExisted = true;
            let data = {
              "error": true,
              "message": "註冊失敗，重複的 Email 或其他原因"
            };
            // console.log("data:" + data);
            resolve(data);
          }
          // console.log(this.isUserExisted);
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
    checkLogin:function(email,password){
      // check user eisted
      let isUserExisted = null;
      let sql_statement = "select * from users where user_email = ? and user_password = ? limit 1 ";
      let para = [email,password];
      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          console.log(rows);
          if(rows[0]["user_id"] && rows[0]["user_name"] && rows[0]["user_email"]){ //user existed
            let data = {
              "data":{
                "id": rows[0]["user_id"],
                "name": rows[0]["user_name"],
                "email": rows[0]["user_email"]
              }
            };
            console.log("data:" + data);
            resolve(data);

          }else{
            let data = null;
            // console.log("data:" + data);
            resolve(data);
          }
          console.log(this.isUserExisted);
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
  },
};
module.exports = SQL;
