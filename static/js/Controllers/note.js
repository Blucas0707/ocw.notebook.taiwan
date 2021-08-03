const view_note = require('../Views/note.js');
const model_note = require('../Models/note.js');


let note = {
  cancelNote:function(note_object){
    let cancel_btn = document.querySelector("#note-cancel-btn");
    cancel_btn.addEventListener("click",()=>{
      let notebox = document.querySelector("#note-input-content");
      notebox.value = "";
      //字數顯示
      note_object.note_count = 0;
      view_note.renderNotesCount(note_object);
    });
  },
  postNotes:function(note_object,user_object){
    let save_btn = document.querySelector("#note-save-btn");
    save_btn.addEventListener("click",async ()=>{
      let note = document.querySelector("#note-input-content").value;
      if(note.toString().length != 0 && note.toString().length <= 1000){
        //字數顯示
        note_object.note_count = 0;
        view_note.renderNotesCount(note_object);
        let time_now = new Date();
        let note_record_time = time_now.getFullYear()+"/"+(time_now.getMonth()+1).toString().padStart(2,"0")+"/"+(time_now.getDate()).toString().padStart(2,"0")+ " "+(time_now.getHours()).toString().padStart(2,"0")+":"+(time_now.getMinutes()).toString().padStart(2,"0")+":"+(time_now.getSeconds()).toString().padStart(2,"0");
        let note_video_current = document.querySelector("#note-video-current").innerHTML.substr(3);
        note_object.post_note = note.toString();
        note_object.post_note_record_time = note_record_time;
        note_object.post_note_video_current = note_video_current;
        note_object = await model_note.postNotes(note_object,user_object);
        document.querySelector("#note-input-content").value = "";
        view_note.renderupdateNote(note_object);
        this.clickNoteCurrent();
        this.clickNoteDelete(note_object);
        return note_object;
      }
    });
  },
  notesAlert:function(note_object){
    let notes = document.querySelector("#note-input-content");
    notes.addEventListener("input",()=>{
      let notes_count = notes.value.length;
      if(notes_count >= 1000){
        note_object.noteIsOverload = true;
      }
      note_object.note_count = notes_count;
      view_note.renderNotesCount(note_object);
    });
  },
  getNotes:async function(note_object){
    note_object = await model_note.getNotes(note_object);
    view_note.renderNotes(note_object);
    note.clickNoteCurrent();
    note.clickNoteDelete(note_object);
    return note_object;
  },
  clickNoteDelete:function(note_object){
    let note_delete_list = document.querySelectorAll(".note-delete");
    for(let index=0;index<note_delete_list.length;index++){
      let note_delete = note_delete_list[index];
      note_delete.addEventListener("click",async ()=>{
        let note_id = note_delete.id;
        note_object.delete_note_id = note_id;
        note_object = await model_note.deleteNote(note_object);
        //移除 note-show-list
        note_delete.parentElement.parentElement.remove();
      })
    }
  },
  clickNoteCurrent:function(){
    let note_current_list = document.querySelectorAll(".note-time-current");
    for(let index=0;index<note_current_list.length;index++){
      let note_current = note_current_list[index];
      note_current.addEventListener("click",()=>{
        let video_currents = note_current.innerHTML.split(":");
        let hour = parseInt(video_currents[0])*3600;
        let min = parseInt(video_currents[1])*60;
        let sec = parseInt(video_currents[2]);
        let video_current = hour + min + sec;
        //設定影片時間
        let video = document.querySelector(".lecture-video");
        video.currentTime = video_current;
      })
    }
  },
};

module.exports = note;
