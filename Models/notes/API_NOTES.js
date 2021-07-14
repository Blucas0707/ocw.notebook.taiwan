let SQL = require("./SQL_notes");

const database = "User";
// let statement = 'select * from lectures limit 1;'

let api_notes = {
  //註冊 POST
  postNotes:function(data){
    return new Promise((resolve, reject)=>{
      let user_id = data.user_id.toString();
      let course_id = data.course_id.toString();
      let lecture_id = data.lecture_id.toString();
      let note = data.note.toString();
      let note_record_time = data.note_record_time.toString();
      let note_video_current = data.note_video_current.toString();
      // save in sql
      SQL.Note.postNotes(course_id,lecture_id,user_id,note,note_video_current,note_record_time).then((result)=>{
        // console.log("result: " + result);
        // resolve(JSON.stringify(result));
        resolve(result);
      })

    });
  },
  //取得 GET
  getNotes:function(course_id,lecture_id,user_id){
    return new Promise((resolve, reject)=>{
        // 取得notes by course_id, lecture_id & user_id
        SQL.Note.getnotes(course_id,lecture_id,user_id).then((result)=>{
          // console.log("result: " + JSON.stringify(result));
          // resolve(JSON.stringify(result));
          resolve(result);
        })

    });
  },
  //刪除 Delete
  deleteNote:function(note_id){
    return new Promise((resolve, reject)=>{
        // 取得notes by course_id, lecture_id & user_id
        SQL.Note.deleteNote(note_id).then((result)=>{
          // console.log("result: " + JSON.stringify(result));
          // resolve(JSON.stringify(result));
          resolve(result);
        })

    });
  },
};
// api_user.Get();
module.exports = api_notes;
