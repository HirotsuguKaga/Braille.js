///////////////Download///////////////////
var filename = "tactileGraph";

var edl = document.querySelector('#edl');
//var png = document.querySelector('#png');
var esa = document.querySelector('#esa');

edl.onclick = function() {
  var blob = new Blob([ tg.loadEdl() ], { "type" : "text/plain" });
  if (window.navigator.msSaveBlob) { 
    window.navigator.msSaveBlob(blob, filename + ".edl"); 
  } else {
    edl.download =  filename + ".edl";  //ダウンロードするファイル名を設定
    edl.href = window.URL.createObjectURL(blob);
  }
}

esa.onclick = function(){
  imgURL = tg.map2esa();
  // DataURL のデータ部分を抜き出し、Base64からバイナリに変換
  var bin = atob(imgURL.split(',')[1]);
  // 空の Uint8Array ビューを作る
  var buffer = new Uint8Array(bin.length);
  // Uint8Array ビューに 1 バイトずつ値を埋める
  for (var i = 0; i < bin.length; i++) {
    buffer[i] = bin.charCodeAt(i);
  }
  // Uint8Array ビューのバッファーを抜き出し、それを元に Blob を作る
  var blob = new Blob([buffer.buffer], {type: 'image/png'});
  
  if (window.navigator.msSaveBlob) {
  // for IE
  window.navigator.msSaveBlob(blob, filename + '.png'); 
  } else {
    esa.download =  filename + ".png";  //ダウンロードするファイル名を設定
    esa.href = window.URL.createObjectURL(blob);
  }
}


var file = document.querySelector('#getfile');
file.onchange = function (){   //ファイル選択後
  var fileList = file.files;
  load(fileList, 0);
};

function load(fileList, k){
  if(k < fileList.length){  //>
    var reader = new FileReader();
    reader.readAsText(fileList[k]);//読み込み
    reader.onload = function  () {
      tg.readEdl(reader.result);      
    }
  }
}
////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////
var canvas = document.getElementById('b');

var pr = tactileGraphic();
pr.setCanvas('b');
pr.setColor("red");
pr.setAdjust(true);
function hypo(a,b){return Math.sqrt(a*a + b*b)} //hypotenuse


function getMousePosition(canvas, evt) { ///// Mouse move ///////////
  var rect = canvas.getBoundingClientRect();
  return {
    x: Math.round(evt.clientX - rect.left),
    y: Math.round(evt.clientY - rect.top)
  };
}

var lx = ly = -6;

var drawFlag = false;

function draw() {
  window.addEventListener("mousedown", function(){
    drawFlag = true;
  }, false);
  window.addEventListener("mouseup", function(){
    drawFlag = false;lx = ly = -6;
  }, false);

  canvas.addEventListener('mousemove', function (evt) {
    var mousePos = getMousePosition(canvas, evt);
    var message = ' X:' + mousePos.x + ', Y:' + mousePos.y;
    document.getElementById('out').innerHTML = message;
    var x = mousePos.x;
    var y = mousePos.y;

    if(document.getElementById('q1').checked == true && drawFlag){///////////free line
      if(5 < hypo(lx - x, ly - y)){
        if(10 < hypo(lx - x, ly - y) && lx != -6)tg.drawLine(lx,ly,x,y);
        tg.drawDot(x,y);
        lx=x;
        ly=y;
      }
    }else if(document.getElementById('q7').checked == true && drawFlag){  ///////////////clearDot
      for(var i=-5; i<6; i++){
        for(var j=-5; j<6 ; j++){
          tg.clearDot(x+i, y+j);
        }
      }
    }

    if(fx != -1){
      pr.clear();
      if(document.getElementById('q2').checked == true)pr.drawLine(fx, fy, x, y);
      if(document.getElementById('q3').checked == true)pr.strokeRect(fx, fy, x-fx, y-fy);
      if(document.getElementById('q4').checked == true)pr.fillRect(fx, fy, x-fx, y-fy);
      if(document.getElementById('q5').checked == true){
        pr.drawDot(fx, fy);
        pr.strokeCircle(fx, fy, hypo(fx-x, fy-y));
      }
    }
  }, false);
}
//////////////////////////////////////////////////////////////////
var txt = document.querySelector('#txt');
var tg = tactileGraphic();
tg.setCanvas('a');
tg.setAdjust(true);

canvas.addEventListener('click', onClick, false);

var fx = fy = -1;
function onClick (e) {
  var x = y = 0;
  var rect = canvas.getBoundingClientRect();   ///スクロールによる位置のずれを補正
  x = e.clientX - rect.left;
  y = e.clientY - Math.round(rect.top);
  pr.clear();
  if(document.getElementById('q0').checked == true){        //////////////drawDot
    tg.drawDot(x, y);
  }else if(document.getElementById('q2').checked == true){  //////////////drawLine
    if(fx == -1){
      fx = x; fy =y;
    } else {
      tg.drawLine(fx, fy, x, y);
      fx = -1;
    }
  }else if(document.getElementById('q3').checked == true){  ///////////////strokeRect
    if(fx == -1){
      fx = x; fy =y;
    } else {
      tg.strokeRect(fx, fy, x-fx, y-fy);
      fx = -1;
    }
  }else if(document.getElementById('q4').checked == true){  ////////////////fillRect
    if(fx == -1){
      fx = x; fy =y;
    } else {
      tg.clearDot(fx,fy);
      tg.fillRect(fx, fy, x-fx, y-fy);
      fx = -1;
    }
  }else if(document.getElementById('q5').checked == true){  ///////////////strokeCircle
    if(fx == -1){
      fx = x; fy =y;
    } else {
      tg.strokeCircle(fx, fy, hypo(fx-x,fy-y));
      fx = -1;
    }
  }else if(document.getElementById('q6').checked == true){  ///////////////drawBraille
    var str = txt.value;
    tg.drawBraille(str, x, y);
  }else if(document.getElementById('p1').checked == true){  ///////////////pattern
    var h =[[0,6],[0,12],[6,0],[12,0],[18,6],[24,0],[30,0],[36,6],[36,12],[6,18],[12,24],[18,30],[24,24],[30,18]];
    tg.drawPattern(h,x,y);
  }else if(document.getElementById('p2').checked == true){  ///////////////pattern
    var d =[[18,0],[12,6],[6,12],[0,18],[6,24],[12,30],[18,36],[24,30],[30,24],[36,18],[30,12],[24,6]];
    tg.drawPattern(d,x,y);
  }
};
