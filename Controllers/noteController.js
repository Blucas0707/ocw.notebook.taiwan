const api_notes = require("../Models/notes/API_notes");

let noteController = {
  getNotes:function(req, res){
    let course_id = req.params.course_id;
    let lecture_id = req.params.lecture_id;
    let user_id = req.session.user_id;
    if(!course_id || !lecture_id || !user_id){
      let data = {
        "error":true,
        "message":"參數錯誤"
      };
      res.send(200,data);
    }
    else{
      api_notes.getNotes(course_id,lecture_id,user_id).then((result)=>{
        res.send(200,result);
      });
    }
  },
  postNotes:function(req, res){
    api_notes.postNotes(req.body).then((result)=>{
      res.send(200,result);
    });
  },
  deleteNote:function(req, res){
    let note_id = req.params.note_id;
    api_notes.deleteNote(note_id).then((result)=>{
      res.send(200,result);
    });
  },
};

module.exports = noteController;
