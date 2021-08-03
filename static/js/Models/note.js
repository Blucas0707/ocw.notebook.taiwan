let note = {
  deleteNote:function(object){
    let url = "/api/note/"+ object.delete_note_id;
    return fetch(url,{
      method:'delete',
      headers: {
        "Content-type":"application/json",
      },
    }).then((response)=>{
      return response.json();
    }).then((result)=>{
      return result;
    });
  },
  getNotes:function(object){
    let url = "/api/note/"+ object.course_id+ "/"+ object.lecture_id;
    return fetch(url,{
      method:'GET',
      headers: {
        "Content-type":"application/json",
      },
    }).then((response)=>{
      return response.json();
    }).then((result)=>{
      if(result.error){
        object.note_result = null;
      }else{
        object.note_result = result;
      }
      return object;
    });
  },
  postNotes:function(note_object,user_object){
    let course_id = note_object.course_id;
    let lecture_id = note_object.lecture_id;
    let user_id = user_object.user_id;
    let note = document.querySelector("#note-input-content").value;
    let data = {
        "course_id":course_id.toString(),
        "lecture_id":lecture_id.toString(),
        "user_id":user_id.toString(),
        "note":note_object.post_note,
        "note_video_current":note_object.post_note_video_current,
        "note_record_time":note_object.post_note_record_time
      };
    return fetch("/api/note",{
      method:"POST",
      headers: {
        "Content-type":"application/json",
      },
      body: JSON.stringify(data)
    }).then((response)=>{
      return response.json();
    }).then((result)=>{
      note_object.note_result = result;
      return note_object
    });
  },
}

module.exports = note;
