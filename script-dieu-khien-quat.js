const firebaseConfig = {
  apiKey: "AIzaSyA7iejZnrLVHS1IrYa7Unt5B-csVqKIUug",
  authDomain: "nwng-30d53.firebaseapp.com",
  databaseURL: "https://nwng-30d53-default-rtdb.firebaseio.com",
  projectId: "nwng-30d53",
  storageBucket: "nwng-30d53.appspot.com",
  messagingSenderId: "26507399099",
  appId: "1:26507399099:web:1ee34a6abbf6eea4e23e9e",
  measurementId: "G-WHRHDVT8G1"
};

firebase.initializeApp(firebaseConfig);
var database = firebase.database();
// ????????????????????????????????????????????????????????????????
var monitor_frame = document.getElementById("monitor-frame");
var modal_monitor = document.getElementById("modal-monitor");
var voltage_monitor = document.getElementById("voltage-monitor");
function getArr(arr, newVal) {
  if (arr.length === 0 && !newVal) return [];

  const newArr = [...arr, newVal];
  if (newArr.length > 8) {
      newArr.shift();
  }
  return newArr;
}

var voltage = document.getElementById('chart-voltage').getContext('2d');
var chart_voltage = new Chart(voltage, {
  type: 'line',
  data: {
      labels: [],
      datasets: [{
          label: 'Temp',
          data: [],
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          fill: false
      }
        
    ]
  },
  options: {
      responsive: true,
      animation: {
          duration: 0
      },
      scales: {
          y: {
              min: 15,
              max: 35,
              ticks: {
                  stepSize: 1
              }
          }
      }
  }
});

var time_voltage = [];
var value_voltage = [];
var j = 0;
var volt_out = 0;
var chartinterval;
database.ref("Monitor/TEMP/data").on("value", function (snapshot) {
    volt_out = snapshot.val();
    // document.getElementById("nhietdo").innerHTML = volt_out;   
    //----------------------------- Chart ----------------------------
    // Cập nhật biểu đồ ngay lập tức khi có dữ liệu mới
    updateChartvoltage(volt_out);
});
function updateChartvoltage(volt_out){
  var time = new Date().toLocaleTimeString();
  const data = getArr(chart_voltage.data.datasets[0].data, volt_out);
  const labels = getArr(chart_voltage.data.labels, time);
  chart_voltage.data.labels = labels
  chart_voltage.data.datasets[0].data = data
  chart_voltage.update();
}
// Bắt đầu cập nhật biểu đồ mỗi giây nếu chưa có
if (!chartinterval) {
  chartinterval = setInterval(() => {
      updateChartvoltage(volt_out);
  }, 1000);
}

var water;
database.ref("Control/VIRTUAL OV VALVE/data").on("value", function (snapshot) {
  water = snapshot.val();
  if (water == 1)
  document.getElementById("dong-chay").src ="hinh/dongchaynuoc.gif"
  else document.getElementById("dong-chay").src =""
});

// function
// ????????????????????????????????????????????????????????????????
// get Pressure from firebase (auto update when data change)
database.ref("Monitor/CPS-A/data").on("value", function(snapshot){
  var pres = snapshot.val();
  var pres_ss = document.getElementById('pres-1');
  var frame_thongbao = document.getElementById('frame');
  document.getElementById("apsuat").innerHTML = pres;
  if (pres > 20 && pres < 30) 
    {
      pres_ss.innerHTML = "Bộ lọc bị bụi nhẹ !";
      frame_thongbao.src = "hinh/chat.png";
    }
  else 
  if (pres > 30 && pres > 20) 
    {
      pres_ss.innerHTML = "Bộ lọc bị bụi nặng !";
      frame_thongbao.src = "hinh/chat.png";
    }
  else {
          pres_ss.innerHTML = "";
          frame_thongbao.src = "";
        } 
})
database.ref("Monitor/SPEED/data").on("value", function(snapshot){
  var speed_fan = snapshot.val();
  document.getElementById("speed-fan").innerHTML = speed_fan;
})
// get CURRENT from firebase (auto update when data change)
database.ref("Monitor/CURRENT/data").on("value", function(snapshot){
  var current_fan = snapshot.val();
  document.getElementById("current-fan").innerHTML = current_fan;
})
// get VOLTAGE from firebase (auto update when data change)
database.ref("Monitor/VOLTAGE/data").on("value", function(snapshot){
  var volt_out = snapshot.val();
  document.getElementById("voltage-fan").innerHTML = volt_out;
  // document.getElementById("voltage-concac").innerHTML =volt_out;
})
// get POWER from firebase (auto update when data change)
database.ref("Monitor/POWER/data").on("value", function(snapshot){
  var power_fan = snapshot.val();
  document.getElementById("power-fan").innerHTML = power_fan;
})
 // get TEMP LON from firebase (auto update when data change)
 database.ref("Monitor/Thermos-temp/data").on("value", function(snapshot){
  var thermos_temp = snapshot.val();
  document.getElementById("themotat").innerHTML = thermos_temp/10;
}) 
 // get tân só  from firebase (auto update when data change)
 database.ref("Monitor/OUT FRQ/data").on("value", function(snapshot){
  var frequency = snapshot.val();
  document.getElementById("frq-value").innerHTML = frequency;
}) 

 // get temp  from firebase (auto update when data change)
 database.ref("Monitor/TEMP/data").on("value", function(snapshot){
  var nhietdo_out = snapshot.val();
  document.getElementById("nhietdo").innerHTML = nhietdo_out;
}) 


database.ref("Control/O ENABLE/data").on("value", function(snapshot){
  var mode = snapshot.val();
  document.getElementById("read").innerHTML = mode;
  if (mode == 0) 
    {
      document.getElementById("image-status-fan").src = "hinh/fan speed high.gif";
      document.getElementById("flow").src = "hinh/flow.gif";
      // database.ref("Control/O VALUE/data").on("value", function(snapshot1){
      //   var mode = snapshot1.val();
      //   document.getElementById("read1").innerHTML = mode;
      // })
      document.getElementById('lock').src="hinh/padlock.png";
      document.getElementById('lock2').src="hinh/padlock.png";
      document.getElementById("btn-fan").disabled = true;
      document.getElementById("btn-coil").disabled = true;
      document.getElementById("myCheck").checked = true;
    }
  else if (mode == 1) 
    { 
      fan();
      document.getElementById("myCheck").checked = false;
      document.getElementById('lock').src="";
      document.getElementById('lock2').src="";
      document.getElementById("btn-fan").disabled = false;
      document.getElementById("btn-coil").disabled = false;

    }    
})
      

// --------------------------------------------------------------------END MODAL THERMOSTAT-----------------------------------------
var btnOn = document.getElementById("btn-valve-on");
var btnOff = document.getElementById("btn-valve-off");
var img1 = document.getElementById("img-van1");
var img2 = document.getElementById("img-van2");

//Get led from firebase (auto update when data change)
database.ref("Control/VIRTUAL OV VALVE/data").on("value", function(snapshot){
  var led_valve = snapshot.val();
  if(led_valve==1){
    document.getElementById("img-van1").src ="hinh/led-on.png"
    document.getElementById("img-van2").src ="hinh/led-on.png"
    }
  else{
      document.getElementById("img-van1").src ="hinh/led-off.png"
       document.getElementById("img-van2").src ="hinh/led-off.png"
      }
})

btnOn.onclick = function(){
    database.ref("Control/VIRTUAL OV VALVE").update({"data" : 1});
}

btnOff.onclick = function(){
    database.ref("Control/VIRTUAL OV VALVE").update({"data" : 0});
}

document.getElementById('run-thuan').addEventListener('click', function(){
  // Lấy giá trị từ các input
    var tanso = document.getElementById('set-frq').value;
    var acc   = document.getElementById('set-acc').value;
    var dec   = document.getElementById('set-dec').value;
  // Gửi dữ liệu mới qua Firebase
  database.ref("Control").update({
    "O VALUE/data": tanso,
    "VIRTUAL ACC/data": acc,
    "VIRTUAL DEC/data": dec,
    "VIRTUAL RUN CM/data": 2,
  });
  fan();
});
// ///////-----////------NHAP GIA TRI SET POINT ---------////////-------------------///////////////
document.getElementById('submit-setpoint').addEventListener('click', function(event){
  // Prevent the default form submission
  event.preventDefault();

  // Lấy giá trị từ các input
  
  var setpoint_temp = document.getElementById('set-point-value').value;
  // Gửi dữ liệu mới qua Firebase
  database.ref("Control").update({
      "VIRTUAL SET POINT/data": setpoint_temp

  });
});
// ----------------------------------STOP STOP STOP STOP STOP STOP STOP STOP -------------
document.getElementById('run-stop').addEventListener('click', function()
{
  database.ref("Control/VIRTUAL RUN CM").update({"data" : 0})
    // event3.preventDefault();      
      fan();      
})

database.ref("Control/ON OFF THERMOSTAT/data").on("value", function(snapshot){
  var thermosonoff = snapshot.val();
  document.getElementById("read3").innerHTML = thermosonoff;
  if (thermosonoff == 0) 
    {
      document.getElementById("imageCheckbox-thermostat").checked = false;
      document.getElementById('checkboxImage-thermostat').src="hinh/THERMOS-OFF.png";
      document.getElementById("myCheck").disabled= false;
      // document.getElementById("myCheck").checked = true;
      document.getElementById('lock1').src="";
      database.ref("Control/O ENABLE").update({"data" : 1})
      document.getElementById("run-thuan").disabled= false;
      document.getElementById("run-srop").disabled= false;
      fan();
    }
  else if (thermosonoff == 1)
    {
      document.getElementById('lock1').src="hinh/padlock.png";
      document.getElementById("imageCheckbox-thermostat").checked = true;
      document.getElementById('checkboxImage-thermostat').src="hinh/THERMOS-ON.png";
      document.getElementById("myCheck").checked = false;
      document.getElementById("myCheck").disabled= true;
      document.getElementById("run-thuan").disabled= true;
      document.getElementById("run-srop").disabled= true;
      fan();
    }
}) 

// Get the modal..............................................................CHO CÁI QUAT....................
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("btn-fan");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks on the button, open the modal
btn.onclick = function() {
  modal.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}
// Get the modal..............................................................CHO CÁI COIL.............................
var modal1 = document.getElementById("myModal1");

// Get the button that opens the modal
var btn1 = document.getElementById("btn-coil");

// Get the <span> element that closes the modal
var span1 = document.getElementsByClassName("close1")[0];

// When the user clicks on the button, open the modal
btn1.onclick = function() {
  modal1.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span1.onclick = function() {
  modal1.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal1) {
    modal1.style.display = "none";
  }
}
// --------------------------------------------------------------------END MODAL C0IL-----------------------------------------
// Get the modal..............................................................CHO CÁI THERMOSTAT.............................
var modal3 = document.getElementById("myModal3");

// Get the button that opens the modal
var btn3 = document.getElementById("nut-thermostat");

// Get the <span> element that closes the modal
var span3 = document.getElementsByClassName("close3")[0];

// When the user clicks on the button, open the modal
// btn3.onclick = function() {
//   modal3.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
span3.onclick = function() {
  modal3.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal3) {
    modal3.style.display = "none";
  }
}




function myFunction() {
  // Get the checkbox
  var checkBox = document.getElementById("myCheck");
  // Get the output text
  var text = document.getElementById("set-point-display");

  // If the checkbox is checked, display the output text
  if (checkBox.checked == true){
    text.style.display = "block";
    database.ref("Control/O ENABLE").update({"data" : 0});
    
    // document.getElementById("submit-setpoint").disabled = true;
  } else {
    text.style.display = "none";
    database.ref("Control/O ENABLE").update({"data" : 1});
    // document.getElementById("submit-setpoint").enabled = true;

  }
}


// ------------------------MODAL CHO CAIS HIEN THI THEM DETAIL CUAR DONG CO---------------------------------------------------
var modal2 = document.getElementById("myModal2");

// Get the button that opens the modal
var btn2 = document.getElementById("btn-them-detail");

// Get the <span> element that closes the modal
var span2 = document.getElementsByClassName("close2")[0];

// When the user clicks on the button, open the modal
btn2.onclick = function() {
  modal2.style.display = "block";
}

// When the user clicks on <span> (x), close the modal
span2.onclick = function() {
  modal2.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
// window.onclick = function(event) {
//   if (event.target == modal2) {
//     modal2.style.display = "none";
//   }
// }
// ---------------------END-----------------CHO CAI HIEN THI DETAIL CUA DONG CO-----------------------------------------------
// document.getElementById(ba-mode).style.visibility = "hidden";
// document.getElementById("bot-ma").style.visibility = "visible";

// /////------------------------------------- THERMOSTAT  ON- OFF----------------------///////////////////////////////////
function toggleImage() {
  var checkbox_thermostat = document.getElementById('imageCheckbox-thermostat');
  var image = document.getElementById('checkboxImage-thermostat');
  // var div = document.getElementById('bot-ma');
  if (checkbox_thermostat.checked) {
      image.src = "hinh/THERMOS-ON.png";
      // document.getElementById("btn-coil").disabled = true;
      document.getElementById("btn-fan").disabled = true;
      database.ref("Control/ON OFF THERMOSTAT").update({"data" : 1});
      document.getElementById('lock').src="hinh/padlock.png";
      // document.getElementById('lock1').src="/hinh/padlock.png";
      document.getElementById("submit-setpoint").disabled = true;
      document.getElementById("submit-setpoint").disabled = true;
      // document.getElementById("myCheck").disabled=true;
      document.getElementById("bot-ma").innerHTML = "High <br> Medium <br> Low <br> Auto";
      // document.getElementById("bot-ma").innerHTML = "Medium";
      // document.getElementById("bot-ma").innerHTML = "Low";
      // document.getElementById("bot-ma").innerHTML = "Auto";
      // else {
      //   x.style.display = "block";
      // }
      // text_bamode.style.display = 'block';                 
      // var status_thermos_img = document.getElementById('status-thermos');
      database.ref("Control/STATUS/data").on("value", function (snapshot) {
        status_thermos = snapshot.val();
        if(status_thermos==2) document.getElementById('status-thermos').src="hinh/thermostat status.png";
          else if(status_thermos==1) document.getElementById('status-thermos').src="hinh/thermostat status1.png" ;
          else if(status_thermos==0) document.getElementById('status-thermos').src="hinh/thermostat status2.png";
          else if(status_thermos==3) document.getElementById('status-thermos').src="hinh/thermostat status3.png";
          
      });
  } else {
      image.src = "hinh/THERMOS-OFF.png";
      document.getElementById("btn-fan").disabled = false;
      database.ref("Control/ON OFF THERMOSTAT").update({"data" : 0});
      document.getElementById('lock').src="";
      // document.getElementById('lock1').src="";
      document.getElementById("submit-setpoint").disabled = false;
      // document.getElementById("myCheck").disabled=false;
      document.getElementById('status-thermos').src="";
      document.getElementById("bot-ma").innerHTML = "";
  }
}

/////////////////////////////////////////////////////
// function toggleImage1() {
//   var checkbox_thermostat = document.getElementById('imageCheckbox-thermostat1');
//   var image = document.getElementById('checkboxImage-thermostat1');
//   if (checkbox_thermostat.checked) {
//       image.src = "/hinh/THERMOS-ON.png";
//       database.ref("Control/ON OFF THERMOSTAT").update({"data" : 1});
      
//       }
//    else {
//       image.src = "/hinh/THERMOS-OFF.png";
//       document.getElementById("btn-fan").disabled = false;
//       database.ref("Control/ON OFF THERMOSTAT").update({"data" : 0});
//       document.getElementById('lock').src="";
//       document.getElementById('lock1').src="";
//       document.getElementById("submit-setpoint").disabled = false;
//       document.getElementById("myCheck").disabled=false;
//       document.getElementById('status-thermos').src="";
//       document.getElementById("bot-ma").innerHTML = "";
//   }
// }
// ///////////////////////////////////////////////////////////////

function fan(){
  const frq_monitor = database.ref("Control/O VALUE/data")
  const run_cm      = database.ref("Control/VIRTUAL RUN CM/data");
  const thermos      = database.ref("Control/ON OFF THERMOSTAT/data");
  Promise.all([frq_monitor.get(), run_cm.get(), thermos.get()])
          .then((snapshots) => {
              const frqData   = snapshots[0].val();
              const runCmData = snapshots[1].val();
              const thermosc = snapshots[2].val();
              document.getElementById("read1").innerHTML = frqData;
              document.getElementById("read2").innerHTML = runCmData;
              if ((frqData > 0 && runCmData > 0) ||(frqData > 0 && thermosc > 0))
                {
                  document.getElementById("image-status-fan").src = "hinh/fan speed high.gif";
                  document.getElementById("flow").src = "hinh/flow.gif";
                }
              else if (frqData == 0 || runCmData == 0 || thermosc == 0 )
                {
                  document.getElementById("image-status-fan").src = "hinh/fan.png";
                  document.getElementById("flow").src = "";
                }
          })}