let lecture = {
  updateLecture_status:function(lecture_object,user_object){
    // return new Promise((resolve, reject)=>{
      return fetch("/api/learning",{
        method:'PATCH',
        headers: {
          "Content-type":"application/json",
        },
        body: JSON.stringify(lecture_object.allLecture_status),
      }).then((response)=>{
        return response.json();
      }).then((result)=>{
        result = JSON.parse(result);
        if(result.ok){
          user_object.loginSuccess = true;
          user_object.isLogin = true;
        }else{
          user_object.loginSuccess = false;
        }
        // console.log("update done");
        return user_object;
      });
    // });
  },
  getOneLecture_status:function(lecture_object,note_object){
    // return new Promise((resolve, reject)=>{
      return fetch("/api/learning/"+ note_object.course_id+ "/"+ note_object.lecture_id,{
        method:'GET',
        headers: {
          "Content-type":"application/json",
        },
      }).then((response)=>{
        return response.json();
      }).then((result)=>{
        // console.log(result);
        lecture_object.oneLecture_status = result;
        // console.log(typeof(result));
        // console.log(models.user.loginSuccess);
        return lecture_object;
      });
    // });
  },
  getAllLecture_status:function(lecture_object,note_object){
    // return new Promise((resolve, reject)=>{
    let url = "/api/learnings/"+ note_object.course_id;
    return fetch(url,{
      method:'GET',
      headers: {
        "Content-type":"application/json",
      },
    }).then((response)=>{
      return response.json();
    }).then((result)=>{
      // console.log("getAllLecture_status:", result);
      // console.log("js result:" + JSON.stringify(result));
      if(result.error){
        lecture_object.isgetallLecture_status = false;
      }else{
        lecture_object.isgetallLecture_status = true;
        lecture_object.allLecture_status = result;
      }
      // models.lectures.oneLecture_status = result;
      // console.log(typeof(result));
      // console.log(models.user.loginSuccess);
      return lecture_object;
    });
    // });
  },
  getAllLectures:function(lecture_object,note_object){
    // console.log(lecture_object,note_object);
    // return new Promise((resolve, reject)=>{
      // let course_id = location.pathname.split("course/")[1];
      return fetch("/api/course/" + note_object.course_id,{
        method:'GET',
        headers: {
          "Content-type":"application/json",
        },
      }).then((response)=>{
        return response.json();
      }).then((result)=>{
        // console.log(result);
        lecture_object.allLecture_status.course_id = note_object.course_id;
        lecture_object.allLecture_data = result;
        return lecture_object;
      });
    // });
  },
}

module.exports = lecture;
