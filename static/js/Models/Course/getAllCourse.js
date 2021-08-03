export default function getAllCourse(){
  return new Promise((resolve, reject)=>{
    let url = "/api/courses" + "?page=" + models.courses.allCourse_nextPage + "&category=" + models.courses.allCourse_category + "&university=" + models.courses.allCourse_university;
    return fetch(url).then((response) => {
      return response.json();
    }).then((result) => {
      // allCourse_data = result;
      models.courses.allCourse_data = result;
    });
  });
};
