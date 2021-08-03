function tensorflow_handpose(){
  let play_video = document.querySelector(".lecture-video");
  const ctx = document.querySelector("#cvs").getContext("2d");
  const video = document.createElement("video");
  video.className = "input_video";
  // 建立初始化程序 1.載入模型 2.建立視訊
  let model = null;
  async function init(){
    model = await handpose.load();
  }
  init();
  let last_handmarks = [];
  let intervalId = null;
  //開啟/關閉攝像頭
  let cameraisOn = false;
  function cameraOn(){
    const camera_btn = document.querySelector(".hand_direction_btn");
    camera_btn.addEventListener("click",()=>{
      if(cameraisOn === false){ // 開啟Camera
        navigator.mediaDevices.getUserMedia({audio:false,video:true}).then((stream)=>{
          video.srcObject = stream;
          video.play();
          cameraisOn = true;
          camera_btn.innerHTML = "關閉手勢偵測";
          video.addEventListener("loadeddata",ontime_refresh);
          //顯示說明
          document.querySelector(".hand_direction_description").style.display = "block";
        })
      }else{ // 關掉Camera
        const stream = video.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach(function(track) {
          track.stop();
        });
        video.srcObject = null;
        cameraisOn = false;
        camera_btn.innerHTML = "開啟手勢偵測";
        window.clearInterval(intervalId);
        //隱藏hand_direction
        document.querySelector(".hand_direction_description").style.display = "none";
        //影片黑屏
        ctx.fillRect(0,0,ctx.canvas.width,ctx.canvas.height);
      }
    })
  }
  cameraOn();
  function ontime_refresh(){
    intervalId = window.setInterval(refresh,10); //每0.01秒執行refresh
  }
  // video.removeEventListener("loadeddata",ontime_refresh);
  async function refresh() {
    //利用模型對圖片/影片等物件做手勢辨識
    const predictions = await model.estimateHands(video);
    //設定畫布尺寸
    ctx.canvas.width = video.videoWidth;
    ctx.canvas.height = video.videoHeight;
    if (predictions.length > 0) {
      //取出每隻手的keypoints[]
      for(let i = 0; i < predictions.length; i++){
        const keypoints = predictions[i].landmarks;
        let now_handmarks = keypoints;
        detectDirection(last_handmarks,now_handmarks);
        last_handmarks = now_handmarks;
        // 該手的keypoints
        // for(let i = 0; i < keypoints.length; i++){
        //   const [x, y, z] = keypoints[i];
        //   console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
        //   顯示數字
        //   ctx.fillStyle = "rgb(200,0,0)";
        //   ctx.font = "16pt Arial";
        //   ctx.fillText(i,x+10,y+10);
        //   ctx.fillRect(x-5,y-5,10,10);
        // }
        //連接keypoints線條
        drawLine(keypoints);
      }
    }
    //補上影片背景
    ctx.save();
    ctx.globalCompositeOperation = "destination-atop"; //圖片組合規則
    ctx.drawImage(video,0,0);
    ctx.restore();
  }

  function drawLine(keypoints){
    // 畫出節點
    for(let i = 0; i < keypoints.length; i++){
      const [x, y, z] = keypoints[i];
      // console.log(`Keypoint ${i}: [${x}, ${y}, ${z}]`);
      //畫出節點＆數字
      ctx.fillStyle = "rgb(200,0,0)";
      ctx.fillRect(x-5,y-5,10,10);
    }

    //draw 0=>1,5,9,13,17
    let draw_lists = [keypoints[0],keypoints[1],keypoints[5],keypoints[9],keypoints[13],keypoints[17]];
    for(let i = 1; i < draw_lists.length; i++){
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "green";
      ctx.stroke();
      ctx.moveTo(draw_lists[0][0],draw_lists[0][1]);
      ctx.lineTo(draw_lists[i][0],draw_lists[i][1]);
      ctx.stroke();
      ctx.closePath();
    }
    //draw 1,2,3,4
    for(let i = 1; i < 4; i++){
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "green";
      ctx.stroke();
      ctx.moveTo(keypoints[i][0],keypoints[i][1]);
      ctx.lineTo(keypoints[i+1][0],keypoints[i+1][1]);
      ctx.stroke();
      ctx.closePath();
    }
    //draw 5,6,7,8
    for(let i = 5; i < 8; i++){
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "green";
      ctx.stroke();
      ctx.moveTo(keypoints[i][0],keypoints[i][1]);
      ctx.lineTo(keypoints[i+1][0],keypoints[i+1][1]);
      ctx.stroke();
      ctx.closePath();
    }
    //draw 9,10,11,12
    for(let i = 9; i < 12; i++){
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "green";
      ctx.stroke();
      ctx.moveTo(keypoints[i][0],keypoints[i][1]);
      ctx.lineTo(keypoints[i+1][0],keypoints[i+1][1]);
      ctx.stroke();
      ctx.closePath();
    }
    //draw 13,14,15,16
    for(let i = 13; i < 16; i++){
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "green";
      ctx.stroke();
      ctx.moveTo(keypoints[i][0],keypoints[i][1]);
      ctx.lineTo(keypoints[i+1][0],keypoints[i+1][1]);
      ctx.stroke();
      ctx.closePath();
    }
    //draw 17,18,19,20
    for(let i = 17; i < 20; i++){
      ctx.beginPath();
      ctx.lineWidth = "3";
      ctx.strokeStyle = "green";
      ctx.stroke();
      ctx.moveTo(keypoints[i][0],keypoints[i][1]);
      ctx.lineTo(keypoints[i+1][0],keypoints[i+1][1]);
      ctx.stroke();
      ctx.closePath();
    }
  }
  //偵測手勢左右
  function detectDirection(last_handmarks,now_handmarks){
    let play_video = document.querySelector(".lecture-video");
    if(last_handmarks.length === 0 || now_handmarks.length === 0){
      return ;
    }
    //hand position : https://google.github.io/mediapipe/solutions/hands
    // x(左到右):1=>0 , y(上到下):0=>1
    //握拳停止
    //MCP
    let last_MCP_y_avg = (last_handmarks[5][1] + last_handmarks[9][1] + last_handmarks[13][1] + last_handmarks[17][1]) / 4;
    let now_MCP_y_avg = (now_handmarks[5][1] + now_handmarks[9][1] + now_handmarks[13][1] + now_handmarks[17][1]) / 4;
    let last_MCP_x_avg = (last_handmarks[5][0] + last_handmarks[9][0] + last_handmarks[13][0] + last_handmarks[17][0]) / 4;
    let now_MCP_x_avg = (now_handmarks[5][0] + now_handmarks[9][0] + now_handmarks[13][0] + now_handmarks[17][0]) / 4;
    //TIP
    let last_TIP_y_avg = (last_handmarks[8][1] + last_handmarks[12][1] + last_handmarks[16][1] + last_handmarks[20][1]) / 4;
    let now_TIP_y_avg = (now_handmarks[8][1] + now_handmarks[12][1] + now_handmarks[16][1] + now_handmarks[20][1]) / 4;
    let last_TIP_x_avg = (last_handmarks[8][0] + last_handmarks[12][0] + last_handmarks[16][0] + last_handmarks[20][0]) / 4;
    let now_TIP_x_avg = (now_handmarks[8][0] + now_handmarks[12][0] + now_handmarks[16][0] + now_handmarks[20][0]) / 4;
    //  手勢條件
    // console.log(now_TIP_x_avg,last_TIP_x_avg,(now_TIP_x_avg - last_TIP_x_avg));
    if ((now_TIP_x_avg - last_TIP_x_avg) > 300) { //向左揮動
      let direction = document.querySelector(".hand-direction");
      direction.innerHTML = "左";
      play_video.currentTime = play_video.currentTime - 10; //+ 10 secs
    }else if ((now_TIP_x_avg - last_TIP_x_avg) < -300) { //向右揮動
      let direction = document.querySelector(".hand-direction");
      direction.innerHTML = "右";
      play_video.currentTime = play_video.currentTime + 10; //- 10 secs
    }

    //影片暫停or播放 => 握拳/鬆手
    // console.log(now_TIP_y_avg,last_TIP_y_avg,now_TIP_y_avg,now_MCP_y_avg,(now_TIP_x_avg - now_MCP_x_avg));
    // if (now_TIP_y_avg < last_TIP_y_avg && now_TIP_y_avg<now_MCP_y_avg) { //鬆開
    //   let direction = document.querySelector(".hand-direction");
    //   direction.innerHTML = "繼續播放";
    //   // play_video.play();
    // }
    // if(now_TIP_y_avg > last_TIP_y_avg && now_TIP_y_avg>now_MCP_y_avg && (now_TIP_x_avg - now_MCP_x_avg < 100)){ //握拳停止
    //   let direction = document.querySelector(".hand-direction");
    //   direction.innerHTML = "暫停";
    //   // play_video.pause();
    // }

    if(play_video.paused){ //暫停
      if (now_TIP_y_avg < last_TIP_y_avg && now_TIP_y_avg<now_MCP_y_avg) { //鬆開
        let direction = document.querySelector(".hand-direction");
        direction.innerHTML = "繼續播放";
        play_video.play();
      }
    }else{
      if(now_TIP_y_avg > last_TIP_y_avg && now_TIP_y_avg>now_MCP_y_avg && (now_TIP_x_avg - now_MCP_x_avg < 100)){ //握拳停止
        let direction = document.querySelector(".hand-direction");
        direction.innerHTML = "暫停";
        play_video.pause();
      }
    }
  }
}

module.exports = tensorflow_handpose;
