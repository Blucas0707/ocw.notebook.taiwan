let learning = {
  getLearningData:function(learning_object){
    let url = "/api/mylearnings" + "?page=" + learning_object.allLearning_nextPage + "&status=" + learning_object.allLearning_status + "&category=" + learning_object.allLearning_category;
    return fetch(url).then((response) => {
      return response.json();
    }).then((result) => {
      learning_object.allLearning_data = result;
      learning_object.allLearning_nextPage = result.nextPage;
      return learning_object;
    });
  },
}

module.exports = learning;
