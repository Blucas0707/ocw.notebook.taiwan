let fade = {
  fadeout:function(elem){
    let speed = 10;
    let num = 1000;
    let timer = setInterval(()=>{
      // views.isFadeout = false;
      num -= speed;
      elem.style.opacity = (num / 1000);
      // console.log(main.style.opacity);
      if(num <= 0){
        clearInterval(timer);
        // views.isFadeout = true;
        resolve(true);
      }
    },10);
  },
  fadein:function(elem){
    let speed = 10;
    let num = 0;
    let timer = setInterval(()=>{
      // views.isFadein = false;
      num += speed;
      elem.style.opacity = (num / 1000);
      // console.log(main.style.opacity);
      if(num >= 1000){
        clearInterval(timer);
        // views.isFadein = true;
        // resolve(true);
      }
    },10);
  },
};

module.exports = fade;
