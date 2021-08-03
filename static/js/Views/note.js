let note = {
  rendernotelogin:function(user_object){
    if(user_object.isLogin){
      //顯示Note box & 隱藏note-not-login box
      document.querySelector(".note-list").style.display = "block";
      document.querySelector(".note-not-login").style.display = "none";
    }else{
      //隱藏Note box & 顯示note-not-login box
      document.querySelector(".note-list").style.display = "none";
      document.querySelector(".note-not-login").style.display = "flex";
    }
  },
  renderNotesCount:function(note_object){
    let alert = document.querySelector("#note-alert");
    alert.innerHTML = "(" + (1000 - note_object.note_count) + "/1000)";
    if(1000 - note_object.note_count < 0 ){
      alert.style.color = "red";
    }else{
      alert.style.color = "black";
    }
  },
  renderNotes:function(note_object){
    let result = note_object.note_result;

    //取得 note-show-all
    let div_note_show_all = document.querySelector(".note-show-all");
    //清除包含內容
    while(div_note_show_all.hasChildNodes()){
      div_note_show_all.removeChild(div_note_show_all.firstChild);
    }
    
    if(result != null){
      for(let index=0;index<result.data.length;index++){
        //新增div note-show-list under note-show-all
        let div_note_show_list = document.createElement("div");
        div_note_show_list.className = "note-show-list";

        //新增div note-time-box
        let div_note_time_box = document.createElement("div");
        div_note_time_box.className = "note-time-box";

        //新增div note-time under note-time-box
        let div_note_time = document.createElement("div");
        div_note_time.className = "note-time";
        div_note_time.innerHTML = result.data[index].note_time;

        //新增div note-time-current under note-time-box
        let div_note_time_current = document.createElement("div");
        div_note_time_current.className = "note-time-current";
        div_note_time_current.innerHTML = result.data[index].note_current;
        // console.log(div_note_time_current.innerHTML);

        //新增div note-delete under note-time-box
        let div_note_delete = document.createElement("div");
        div_note_delete.className = "note-delete";
        div_note_delete.id = result.data[index].note_id;
        //新增img note-delete under div note-delete
        let img_note_delete = document.createElement("img");
        img_note_delete.src = "/img/trash.svg";
        div_note_delete.appendChild(img_note_delete);

        div_note_time_box.appendChild(div_note_time);
        div_note_time_box.appendChild(div_note_time_current);
        div_note_time_box.appendChild(div_note_delete);

        // console.log(result.data[index].note_time);
        //新增div note-content under note-show-list
        let div_note_content = document.createElement("div");
        div_note_content.className = "note-content";
        div_note_content.innerHTML = "";
        let lines = result.data[index].note.split("\n");
        for(let line_index=0;line_index<lines.length;line_index++){
          let line = "<p>" + lines[line_index] + "</p>";
          div_note_content.innerHTML += line;
        }
        // console.log(result.data[index].note);
        div_note_show_list.appendChild(div_note_time_box);
        div_note_show_list.appendChild(div_note_content);
        div_note_show_all.appendChild(div_note_show_list);
      }
    }
  },
  renderupdateNote:function(note_object){
    let result = note_object.note_result;
    // console.log("result:" + result);
    //取得 note-show-all
    let div_note_show_all = document.querySelector(".note-show-all");
    //新增div note-show-list under note-show-all
    let div_note_show_list = document.createElement("div");
    div_note_show_list.className = "note-show-list";

    //新增div note-time-box
    let div_note_time_box = document.createElement("div");
    div_note_time_box.className = "note-time-box";

    //新增div note-time under note-show-list
    let div_note_time = document.createElement("div");
    div_note_time.className = "note-time";
    div_note_time.innerHTML = result.data[0].note_time;

    //新增div note-time-current under note-time-box
    let div_note_time_current = document.createElement("div");
    div_note_time_current.className = "note-time-current";
    div_note_time_current.innerHTML = result.data[0].note_current;

    //新增div note-delete under note-time-box
    let div_note_delete = document.createElement("div");
    div_note_delete.className = "note-delete";
    div_note_delete.id = result.data[0].note_id;
    //新增img note-delete under div note-delete
    let img_note_delete = document.createElement("img");
    img_note_delete.src = "/img/trash.svg";
    div_note_delete.appendChild(img_note_delete);

    div_note_time_box.appendChild(div_note_time);
    div_note_time_box.appendChild(div_note_time_current);
    div_note_time_box.appendChild(div_note_delete);

    // console.log(result.data[index].note_time);
    //新增div note-content under note-show-list
    let div_note_content = document.createElement("div");
    div_note_content.className = "note-content";
    let lines = result.data[0].note.split("\n");
    div_note_content.innerHTML = "";
    for(let line_index=0;line_index<lines.length;line_index++){
      let line = "<p>" + lines[line_index] + "</p>";
      div_note_content.innerHTML += line;
    }

    div_note_show_list.appendChild(div_note_time_box);
    div_note_show_list.appendChild(div_note_content);
    div_note_show_all.insertBefore(div_note_show_list,div_note_show_all.childNodes[0]);
  }
}

module.exports = note;
