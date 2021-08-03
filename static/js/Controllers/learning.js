const show = require('../Views/show.js');
const view_learning = require('../Views/learning.js');
const model_lecture = require('../Models/lecture.js');
const model_learning = require('../Models/learning.js');
const actions = require('./actions.js');
const model_user = require('../Models/User/user.js');


let learning = {
  checkLogin:function(user_object){
      return new Promise(async (resolve, reject)=>{
        user_object = await model_user.checkLogin(user_object);
        view_learning.isLogin(user_object);
        resolve(user_object);
      })
    },
    logout:function(user_object){
      return new Promise((resolve, reject)=>{
        let logout_btn = document.querySelector("#logout-btn");
        logout_btn.addEventListener("click", async ()=>{
          user_object = await model_user.logout(user_object);
          view_learning.Logout(user_object);
          resolve(true);
        });
      })
    },
  initialfadein:function(){
    return new Promise((resolve,reject)=>{
      let html = document.querySelector("html");
      view_learning.fadein(html).then(()=>{
        resolve(true);
      });
    })
  },
  getAllLearnings:function(learning_object){
    learning.initialfadein().then(async ()=>{
      learning_object = await model_learning.getLearningData(learning_object);
        view_learning.renderData(learning_object);
        learning.chooseCourse();
    });
  },
  chooseCourse:function(){
    let course_list = document.querySelectorAll(".course-class");
    for(let index=0;index<course_list.length;index++){
      let url = "/course/" + course_list[index].id;
      course_list[index].addEventListener("mouseover",()=>{
        course_list[index].style.opacity = 0.5;
      });
      course_list[index].addEventListener("mouseout",()=>{
        course_list[index].style.opacity = 1;
      });

      course_list[index].addEventListener("click",()=>{
        window.location.assign(url);
      });
    }
  },
};

module.exports = learning;
