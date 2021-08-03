const model_lecture = require('../Models/lecture.js');

function leavePage(user_object,lecture_object){
  window.onbeforeunload = function(){
    if(user_object.isLogin){
      lecture_object.allLecture_status.user_id = user_object.user_id;
      user_object = model_lecture.updateLecture_status(lecture_object, user_object);
    }
  };
}

module.exports = leavePage;
