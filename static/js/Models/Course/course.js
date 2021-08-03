let course = {
  getCourses:function(object){
      let page = "";
      if (object.allCourse_university == ""){
        page = object.allCourse_nextPages[0];
      }
      else if (object.allCourse_university == "台灣大學"){
        page = object.allCourse_nextPages[1];
      }
      else if (object.allCourse_university == "清華大學") {
        page = object.allCourse_nextPages[2];
      }
      else{
        page = object.allCourse_nextPages[3];
      }
      let url = "/api/courses" + "?page=" + page + "&category=" + object.allCourse_category + "&university=" + object.allCourse_university;
      return fetch(url).then((response) => {
        return response.json();
      }).then((result) => {
        object.allCourse_result = result;
        if(object.allCourse_university == ""){
          object.allCourse_datalist[0] = result;
          object.allCourse_nextPages[0] = result.nextPage;
        }
        else if(object.allCourse_university == "台灣大學"){
          object.allCourse_datalist[1] = result;
          object.allCourse_nextPages[1] = result.nextPage;
        }
        else if (object.allCourse_university == "清華大學") {
          object.allCourse_datalist[2] = result;
          object.allCourse_nextPages[2] = result.nextPage;
        }
        else{
          object.allCourse_datalist[3] = result;
          object.allCourse_nextPages[3] = result.nextPage;
        }
        return object;
      });
  },
  searchKeyword:function(object){
    // return new Promise((resolve, reject)=>{
      // let url = "https://search-courses-ptaras3nil34n6zdm7mfwnljhe.us-east-2.es.amazonaws.com/courses/_search?analyzer=ik_max_word&default_operator=AND&q=course_name:" + keyword;
      let url = "/api/search?keyword=" + object.searchkeyword;
      return fetch(url,{
        method:"GET",
      }).then((response)=>{
        return response.json();
      }).then((result)=>{
        object.searchResult = result;
        return object;
      });
    // });
  },
}

module.exports = course;
