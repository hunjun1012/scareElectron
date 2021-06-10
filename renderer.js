const Serialport = require('serialport'); 
const mdbConn = require('./mariaDBConn.js');
const db = require('./mariaDBConn');
const tableify = require('tableify');
const ByteLength = require('@serialport/parser-byte-length');
const remote = require('electron').remote;  
var bcrypt = require('bcrypt-nodejs');
//app.allowRendererProcessReuse = false;
// loggedin = true;
// name = db.insertLoggedin('SELECT name FROM users where isLogged = 1');

console.log("db connection try");
mdbConn.getUserList()
  .then((rows) => {
    console.log(rows);
  })
  .catch((errMsg) => {
    console.log(errMsg);
  })

  function getParam(sname) {
    var params = location.search.substr(location.search.indexOf("?") + 1);
    var sval = "";
    params = params.split("&");
    for (var i = 0; i < params.length; i++) {
        temp = params[i].split("=");
        if ([temp[0]] == sname) { sval = temp[1]; }
    }
    return sval;
  }

  //로그아웃시 0으로 업데이트
  document.getElementById('logoutbtn').onclick = logoutbtn;
      function logoutbtn() {
          console.log(getParam('userid'));
          getUser(getParam('userid')).then((rows) => {
            var user = rows[0];
            console.log(user);
            setTemp(user.id, user.temperature, user.addtemperature, 0);
            insertLoggedin(user.id, user.name, user.team, 0);
            location.href = 'index.html';
          });  
        }
      
  //X로 종료시 로그아웃
  document.getElementById('closelogout').onclick = logoutbtn2;
      function logoutbtn2() {
          getUser(getParam('userid')).then((rows) => {
            var user = rows[0];
            setTemp(user.id, user.temperature, user.addtemperature, 0);
            insertLoggedin(user.id, user.name, user.team, 0);
            location.href = 'index.html';
          });  
      }

      

Serialport.list((err, ports) => {
  console.log('ports', ports);
  if (err) {
    document.getElementById('error').textContent = err.message;
    return
  } else {
    document.getElementById('error').textContent = '';
  }
  if (ports.length == 0) {
    document.getElementById('error').textContent = 'No ports discovered';
  }

  tableHTML = tableify(ports);
  document.getElementById('ports').innerHTML = tableHTML;

  //보정값
  // defaultValue = 100;


  //연결된 포트 "04D8" 1A86
  ports.forEach(port => {
    if (port.vendorId == "1A86") {
      document.getElementById('portNumber').textContent = "사용포트 : " + port.comName;
      const serial = new Serialport(port.comName, {
        baudRate: 115200
      });

      const parser = serial.pipe(new ByteLength({ length: 1 }))
      sample = [];
      sensorValueRecords = {};
      parser.on('data', function (data) {
        uint = new Uint32Array(data);
        
        //현재시간
        dt = new Date();
        if(data == "T"){
          sample = [];
        }
        if(data == "\n"){
          var serialData = sample.join('');
          var tag = sample.splice(0,4).join('');
          var temp = sample.splice(1,5).join('');
          console.log("[tag] : " + tag);
          
          if(tag == "TEMP"){
            console.log("[serial data] : " + serialData );
            console.log("[temp data] : " +  temp);
            // console.log("[defaultValue data] : " +  defaultValue);

            //보정값 더하기
            //addtemp = document.getElementById('addTemp').value;
            db.getUser(getParam('userid')).then((rows)=>{
              addtemp = rows[0].addtemperature;
              document.getElementById('addTemp').value = addtemp;
              temp = Number(temp) + Number(addtemp);

               //status.html에서 체온 37.5도 일때 이상, 아닐시 정상
              function statuschange() {
                if (temp > 37.5) {
                  document.getElementById("table01").style.backgroundColor = "#D51212";
                  document.getElementById("tempText").style.backgroundColor = "#D51212";
                  document.getElementById("sensorValue").style.backgroundColor = "#D51212";
                } else {
                  document.getElementById("table01").style.backgroundColor = "#3769F3";
                  document.getElementById("tempText").style.backgroundColor = "#3769F3";
                  document.getElementById("sensorValue").style.backgroundColor = "#3769F3";
                }   
              }statuschange();

              //status.html에서 sensorValue값 보여주기  
              document.getElementById('sensorValue').value = temp + " ℃";
              
              /* console.log("온도: " + temp);  
              console.log("포트번호: " + port.comName);
              console.log("아이디: " + getParam('userid')); */

              if (sample.length > 345) {
                console.log(uint[0]);
                sample = [];
              }

              getUser(getParam('userid')).then((rows) => {
                var user = rows[0];
                console.log("온도 입력테스트: ", user);
                db.setTemp(getParam('userid'), temp, addtemp, user.isLoggedin);
                db.insertTemp(user.id, user.name, user.team, temp, addtemp);
              });
              
            });
            
            
            


            
          }
          sample = [];
          
        } else if(data != " "){
          sample.push(data);
        } 
      })
    }
  });
});


