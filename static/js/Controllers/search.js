const model_course = require('../Models/Course/course.js');
const view_search = require('../Views/search.js');

let search = {
  allCourse_list:async function(course_object){ // All台清交
      let keyword = decodeURIComponent(window.location.search).split("=")[1];
      course_object.searchkeyword = keyword;
      course_object = await model_course.searchKeyword(course_object);
      view_search.renderAllSearch(course_object);
      // });
    },
};

module.exports = search;
