let click = {
  renderUsername:function(object){
    let nav_myname = document.querySelector(".nav-myname");
    nav_myname.innerHTML = object.user_name;
  },
  allCourse:function(object,index){
    return new Promise((resolve, reject)=>{
      let previous = document.querySelectorAll(".previous-arrow")[index];
      let next = document.querySelectorAll(".next-arrow")[index];
      console.log(models.courses.allCourse_nextPages[index]);
      if(models.courses.allCourse_nextPages[index]==0){
        //隱藏previous btn
        previous.style.display="none";
      }else if (models.courses.allCourse_nextPages[index]==null) {
        //隱藏next btn
        next.style.display="none";
      }else{
        //顯示previous & next btn
        previous.style.display="flex";
        next.style.display="flex";
      }
      resolve(true);
    });
  }
};

module.exports = click;
