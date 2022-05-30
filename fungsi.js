

var firebaseConfig = {

    databaseURL: "https://absensi2020face.firebaseio.com/",
 
	};
    firebase.initializeApp(firebaseConfig);
   


    function tampilData()
	{
	// Buat referensi database firebase---------------------
		var dbRef = firebase.database();
		var statusAlat = dbRef.ref("status-alat");
	// Dapatkan referensi table
		var table = document.getElementById("tabel-status-alat").getElementsByTagName('tbody')[0];
	// Membuang semua isi table	---------------
		$("#tabel-status-alat").find("tr:gt(0)").remove();

	// Memuat Data------------------------
		statusAlat.on("child_added", function(data, prevChildKey) {
		   	var newstatusAlat = data.val();
		   	var row = table.insertRow(table.rows.length);
		   	var cell1 = row.insertCell(0);
			  var cell2 = row.insertCell(1);
			  var cell3 = row.insertCell(2);
		   	cell1.innerHTML = newstatusAlat.id; 
		   	cell2.innerHTML = newstatusAlat.nama_alat;
        cell3.innerHTML = newstatusAlat.tanggal_alat;
        
       
		});
	}

// Mengambil id terakhir dan membahkan dengan 1 dan memasukkan kedalam text id di modal tambah-----------

    //variabel jam------------------
    var d = new Date();
    var n = d.toLocaleDateString();
    var a = d.toLocaleTimeString();
    document.getElementById("t4_tanggal_alat_add").value=n+" "+a;
/*
    function ambilDataTerakhir()
    {

      var dbRef_ambilDataTerakhir = firebase.database();
      var cariAkhir = dbRef_ambilDataTerakhir.ref("status-alat");
      cariAkhir.limitToLast(1).on('child_added', function(dataAkhir) {
      var snap = dataAkhir.val();
     var id_record_terakhir = snap.id;
      document.getElementById("T4_add").value = id_record_terakhir+1;
      });
  
      }
       setTimeout(function(){ recognition.start(); }, 5000);  
  */
      function addData_Proses()
      {
      //  var id_add_proses = $('#T4_add').val();
        var nama_alat_add_proses = $('#output').val();
        var tanggal_alat_add_proses = $('#t4_tanggal_alat_add').val();
        var dbRef_add_proses = firebase.database();
        var statusAlat = dbRef_add_proses.ref("status-alat/" + a);
          statusAlat.set({
          id : (a),
          nama_alat : nama_alat_add_proses,
          tanggal_alat : tanggal_alat_add_proses
            });   
         //   location.replace("index.html");
            setTimeout(function(){  location.replace("index.html"); }, 3000);  
        }



  
//play audio------------------------  

function play(audioId) {
        $('#audio-' + audioId)[0].play();
        }
function activate() {
      play('activated');
          }
function bukapanel() {
       play('target-lost');
           }
function Fire() {
        play('fire');
         } 
function salah() {
  play('i-see-you');
           }       

//jquery menampilkan data-------------
$(document).ready(function(){
  $("#btn").click(function(){
  $("#DIV").show(1000);
  webcamMgr.startCamera();
  bukapanel();  
  });
});


//memulai speech recognation----------------
try {
  var SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  var recognition = new SpeechRecognition();
}

catch(e) {
 console.error(e);
 $('.no-browser-support').show();
 $('.app').hide();
}

var noteTextarea = $('#note-textarea');
var instructions = $('#recording-instructions');
var notesList = $('ul#notes');
var noteContent = '';
//var notes = getAllNotes();
//renderNotes(notes);

/*-----------------------------
      Voice Recognition 
------------------------------*/
recognition.continuous =true;//default true

recognition.onresult = function(event) {
  var current = event.resultIndex;
  var transcript = event.results[current][0].transcript;
  var mobileRepeatBug = (current == 1 && transcript == event.results[0][0].transcript);
  if(!mobileRepeatBug) {
    noteContent += transcript;
    noteTextarea.val(noteContent);
  }
 
  var x = document.getElementById("note-textarea").value;
  if(x=="buka"){
  $("#DIV").show(1000);
  webcamMgr.startCamera();
  init();
  bukapanel();
  }
  else{
  salah();
  setTimeout(function(){  location.replace("index.html"); }, 10000);  
  text=" ";
  }
 
};

recognition.onstart = function() { 
  instructions.text(' recognasi aktif');
  
}
recognition.onspeechend = function() {
  instructions.text(' recognasi non aktif');
}
recognition.onerror = function(event) {
  if(event.error == 'tidak ada suara') {
    instructions.text('tidak ada suara ulangi lagi.');  
  };
}



/*-----------------------------
      App buttons and input 
------------------------------*/

$('#start-record-btn').on('click', function(e) {
  if (noteContent.length) {
    noteContent += ' ';
  }
  recognition.start();
});
$('#pause-record-btn').on('click', function(e) {
  recognition.stop();
  instructions.text('Voice recognition paused.');
});

// Sync the text inside the text area with the noteContent variable.------------------------
noteTextarea.on('input', function() {
  noteContent = $(this).val();
})

/*-----------------------------
      Speech Synthesis 
------------------------------*/

function readOutLoud(message) {
	var speech = new SpeechSynthesisUtterance();
  // Set the text and voice attributes.
	speech.text = message;
	speech.volume = 1;
	speech.rate = 1;
	speech.pitch = 1;
  window.speechSynthesis.speak(speech);

}


    const URL = "https://teachablemachine.withgoogle.com/models/Op2KTK74/";
    let model, webcam, labelContainer, maxPredictions;

    async function init() {
        const modelURL = URL + "model.json";
        const metadataURL = URL + "metadata.json";

        model = await tmImage.load(modelURL, metadataURL);
        maxPredictions = model.getTotalClasses();
        const flip = true; 
        webcam = new tmImage.Webcam(200, 200, flip); 

        await webcam.setup();
        await webcam.play();
        

        window.requestAnimationFrame(loop);
       document.getElementById("webcam-container").appendChild(webcam.canvas);
        labelContainer = document.getElementById("label-container");
       
        
        for (let i = 0; i < maxPredictions; i++) { 
            labelContainer.appendChild(document.createElement("div"));
        }
       
    }
    

    async function loop() {
    webcam.update();
    await predict();
    window.requestAnimationFrame(loop);
    
    }

    async function predict() {
        const prediction = await model.predict(webcam.canvas);
        for (let i = 0; i < maxPredictions; i++) {
            const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2);
            labelContainer.childNodes[i].innerHTML = classPrediction;

            document.getElementById("input").value=prediction[0].probability.toFixed(1);
            document.getElementById("input1").value=prediction[1].probability.toFixed(1);
            document.getElementById("input2").value= prediction[2].probability.toFixed(1);

            
          
        } 
       
    }



      
    function kirimdata(){
        var logika1  = document.getElementById("input").value;
        var logika2  = document.getElementById("input1").value;
        var logika3  = document.getElementById("input2").value;
        //logika statement pemilihan model
        var  text;
        if (logika1 > 0.90){
        text ="widhi"; 
        }
        else if(logika2 > 0.90){                
        text= "hp";
        }
        else if(logika3 > 0.90){
        text= "mouse";
        }
        else {
        text="tidak dikenali";
        }
        document.getElementById("output").value=text;

//  var y =document.getElementById('output').value;
    switch (text) {
    
    case "widhi":
    addData_Proses();
    break;
    case "hp":
    addData_Proses();
    break;
    case "mouse":
    addData_Proses();
    break;
    case "tidak dikenali":
    addData_Proses();
    break;
		    
  }


    }


    var camStreamWidth = 640;
    var camStreamHeight = 480;

    var VIEW_WIDTH = 320;
    var VIEW_HEIGHT = 240;

    var video = document.getElementById("video");
    var canvas = document.getElementById("canvas");

    canvas.width = VIEW_WIDTH;
    canvas.height = VIEW_HEIGHT;

    var webcamParams = {
        video: {
            mandatory: {
                maxWidth: camStreamWidth,
                maxHeight: camStreamHeight,
                minWidth: camStreamWidth,
                minHeight: camStreamHeight
            }
        }
    };
    var webcamMgr = new WebCamManager(
        {
            webcamParams: webcamParams, //Set params for web camera
            testVideoMode: false,//true:force use example video for test false:use web camera
            videoTag: video
        }
    );

    var faceDetector = new FaceDetector(
        {
            video: webcamMgr.getVideoTag(),
            flipLeftRight: false,
            flipUpsideDown: false
        }
    );
    
  
    webcamMgr.setOnGetUserMediaCallback(function () {
      faceDetector.startDetecting();
      
    });

    faceDetector.setOnFaceAddedCallback(function (addedFaces, detectedFaces) {
     

        for (var i = 0; i < addedFaces.length; i++) {
   //  console.log("[facedetector] New face detected id=" + addedFaces[i].faceId + " index=" + addedFaces[i].faceIndex);
   // document.getElementById("T4_add").value= addedFaces[i].faceIndex;

        }
    });

    faceDetector.setOnFaceLostCallback(function (lostFaces, detectedFaces) {
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
        for (var i = 0; i < lostFaces.length; i++) {
      // console.log("[facedetector] Face removed id=" + lostFaces[i].faceId + " index=" + lostFaces[i].faceIndex);
      
        }

    });
    faceDetector.setOnFaceUpdatedCallback(function (detectedFaces) {
      function play(audioId) {$('#audio-' + audioId)[0].play();
    }
      function fire() {play('fire');
    }
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);
        ctx.strokeStyle = "green";
        ctx.lineWidth = 4;
        ctx.fillStyle = "yellow";
        ctx.font = "italic small-caps bold 20px arial";
        for (var i = 0; i < detectedFaces.length; i++) {
            var face = detectedFaces[i];
           var t=document.getElementById('output').value;
  
         // console.log(face.faceId);
         kirimdata();
         fire();
            ctx.fillText(
              //face.faceId+""+
            t,face.x * VIEW_WIDTH, face.y * VIEW_HEIGHT);
            ctx.strokeRect(face.x * VIEW_WIDTH, face.y * VIEW_HEIGHT , face.width * VIEW_WIDTH, face.height * VIEW_HEIGHT);
        }
      
    }
   
    );


  
