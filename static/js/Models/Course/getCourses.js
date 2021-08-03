export default function getCourses(allCourse_nextPages,allCourse_datalist,category,university){
    let page = "";
    if (university == ""){
      page = allCourse_nextPages[0];
    }
    else if (university == "台灣大學"){
      page = allCourse_nextPages[1];
    }
    else if (university == "清華大學") {
      page = allCourse_nextPages[2];
    }
    else{
      page = allCourse_nextPages[3];
    }

    let url = "/api/courses" + "?page=" + page + "&category=" + category + "&university=" + university;
    return fetch(url).then((response) => {
      return response.json();
    }).then((result) => {
      if(university == ""){
        allCourse_datalist[0] = result;
        allCourse_nextPages[0] = result.nextPage;
      }
      else if(university == "台灣大學"){
        allCourse_datalist[1] = result;
        allCourse_nextPages[1] = result.nextPage;
      }
      else if (university == "清華大學") {
        allCourse_datalist[2] = result;
        allCourse_nextPages[2] = result.nextPage;
      }
      else{
        allCourse_datalist[3] = result;
        allCourse_nextPages[3] = result.nextPage;
      }
      return [allCourse_nextPages,allCourse_datalist,result,university];
    });
};
