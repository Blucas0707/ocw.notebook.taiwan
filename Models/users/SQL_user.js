require('dotenv').config({path:__dirname+'/../../.env'});
// console.log(process.env.RDS_SQL_HOST);
const argon2 = require('argon2');
const mysql = require('mysql2');
//驗證
// let hashVerify = async function(hashkey,password){
//   const verification = await argon2.verify(hashkey, password);
// };
function hashVerify(hashkey,password){
  return new Promise((resolve,reject)=>{
    const verification = argon2.verify(hashkey, password);
    // console.log(hashkey);
    resolve(verification);
  });
};
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
    login:function(email){
      // check user eisted
      let isUserExisted = null;
      let sql_statement = "select user_password from users where user_email = ?";
      let para = [email];
      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          console.log(rows,rows.length);

          if(rows.length != 0){ //user existed
            let hashPassword = rows[0]["user_password"];
            console.log("login:" + hashPassword);
            if(hashPassword){ //user existed
                resolve(hashPassword);
              }
            else{
              let data = {
                "error": true,
                "message": "登入失敗，帳號或密碼錯誤或其他原因"
              };
              resolve(data);
            }
          }else{ //user not existed
            let data = {
              "error": true,
              "message": "登入失敗，帳號或密碼錯誤或其他原因"
            };
            resolve(data);
          }
        }).catch(()=>{
          let data = {
            "error": true,
            "message": "伺服器內部錯誤"
          };
          resolve(data);
        })
      });
    },
    GoogleLogin:function(name,email,password,hashPassword){
      // check user eisted
      let isUserExisted = null;
      let sql_statement = "select user_password from users where user_email = ?";
      let para = [email];
      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          if(rows[0] != undefined){ //user existed
            let hashPassword_SQL = rows[0]["user_password"];
            hashVerify(hashPassword_SQL,password).then((verification)=>{
              if(verification){ //user existed
                  let data = {
                    "ok": true
                  };
                  resolve(data);
                }
              else{
                let data = {
                  "error": true,
                  "message": "密碼錯誤"
                };
                resolve(data);
              }
            });
          }
          else{ // user not existed => register
            sql_statement = "insert into users (user_name, user_email, user_password)  values (?,?,?)";
            para = [name,email,hashPassword];
            promisePool.query(sql_statement, para).then(([rows, fields])=>{
              let data = {
                "ok": true
              };
              resolve(data);
            }).catch((err)=>{
              // console.log("GR: "+err);
              let data = {
                "error": true,
                "message": "伺服器內部錯誤,註冊失敗！"
              };
              resolve(data);
            });
          }
        }).catch(()=>{
          let data = {
            "error": true,
            "message": "伺服器內部錯誤"
          };
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
          if(rows[0]["count(*)"] == 0){ //not existed
            this.isUserExisted = false;
            //update user to SQL
            sql_statement = "insert into users (user_name, user_email, user_password)  values (?,?,?)";
            para = [name,email,password];
            promisePool.query(sql_statement, para).then(([rows, fields])=>{
              let data = {
                "ok": true
              };
              resolve(data);
            })
          }else{
            this.isUserExisted = true;
            let data = {
              "error": true,
              "message": "註冊失敗，重複的 Email 或其他原因"
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
    checkLogin:function(email){
      // check user eisted
      let isUserExisted = null;
      let sql_statement = "select user_id,user_name,user_email,user_password,user_sub from users where user_email = ? limit 1 ";
      let para = [email];
      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          if(rows[0]["user_id"] && rows[0]["user_name"] && rows[0]["user_email"]){ //user existed
            let data = {
              "data":{
                "id": rows[0]["user_id"],
                "name": rows[0]["user_name"],
                "email": rows[0]["user_email"],
                "password":rows[0]["user_password"],
                "sub":rows[0]["user_sub"]
              }
            };
            resolve(data);
          }else{
            let data = null;
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
