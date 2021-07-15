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
    getCourses:function(page,category,university){
      // 取得課程資訊 by page & category 每頁4筆
      let next_page = parseInt(page,10) + 1;
      let offset = page * 4;
      let data_dict = {
            "nextPage": next_page,
            "data":[]
        };
      let sql_statement,para;
      if(category=="%" && university== "%"){
        sql_statement = "select course_id,course_university,course_category,course_name,course_cover,course_teacher,course_description from courses order by course_establish DESC limit ?,4";
        para = [offset];
      }else if (category=="%") {
        sql_statement = "select course_id,course_university,course_category,course_name,course_cover,course_teacher,course_description from courses where course_university = ? order by course_establish DESC limit ?,4";
        para = [university,offset];
      }else if (university== "%") {
        sql_statement = "select course_id,course_university,course_category,course_name,course_cover,course_teacher,course_description from courses where course_category = ? order by course_establish DESC limit ?,4";
        para = [category,offset];
      }

      let promisePool = SQL.pool.promise();
      return new Promise((resolve, reject)=>{
        promisePool.query(sql_statement,para).then(([rows, fields])=>{
          // console.log(rows);
          //後面沒有資料
          if(rows.length == 0){
            data_dict["nextPage"] = null
            data_dict["data"] = null
          }
          else{
            for(let index=0;index < rows.length; index++){
                let new_dict = {}
                new_dict["course_id"] = rows[index]["course_id"]
                new_dict["course_university"] = rows[index]["course_university"]
                new_dict["course_category"] = rows[index]["course_category"]
                // new_dict["course_semester"] = rows[index]["course_semester"]
                // new_dict["course_department"] = rows[index]["course_department"]
                // new_dict["course_establish"] = rows[index]["course_establish"]
                new_dict["course_name"] = rows[index]["course_name"]
                new_dict["course_cover"] = rows[index]["course_cover"]
                new_dict["course_teacher"] = rows[index]["course_teacher"]
                new_dict["course_description"] = rows[index]["course_description"]
                // new_dict["course_link"] = rows[index]["course_link"]
                data_dict["data"].push(new_dict);
            }
          }
          resolve(data_dict);
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
  },
};
module.exports = SQL;
