var i=0;
var preguntas=['Cuales son las primeras diferencias que encuentras entre UX y UY',
'Consideras tener una amplia experienciaq en el tema de diseno de productos igitales?',
'En donde te ves en 5 anos',
'Cuales son tus metas?',
'Cuales son las primeras diferencias que encuentras entre UX y UI? has tenido experiencia'];
var bd;
var job;
var videoArray=[];
var array=[];
var arrayvideo="";
		//var videosrc = document.getElementById('videosrc');
		//var mvideo = document.querySelector('#mvideo');
		var indexedDB=window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
		var video = document.querySelector('#video');
			navigator.webcam = (
			navigator.msGetUserMedia ||
			navigator.mozGetUserMedia ||
			navigator.webkitGetUserMedia ||
			navigator.getUserMedia
		);
		function iniciar(){
			job = prompt('Ingrese su job?');
			grabar=document.getElementById("grabar");
			terminar=document.getElementById("terminar");
			document.getElementById("pre").innerHTML=preguntas[0];
			//id=guid();
			//var d = new Date();
			//createdAt=d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
			var solicitud=indexedDB.open("bds");
			solicitud.onsuccess=function(e){
				bd=e.target.result;
				//bd.createObjectStore("gente",{UUID:"_id",STRING: "job",UUID:"user",ISODATE:"createdAt",ARRAY:"video"});
				//objectStore.createIndex("job", "string", { unique: false });
  				//objectStore.createIndex("user", "string", { unique: false });
  				//objectStore.createIndex("createdAt", "string", { unique: false });
  				//objectStore.createIndex("video", "array", { unique: false });
			}
			solicitud.onupgradeneeded=function(e){
				bd=e.target.result;
				//bd.createObjectStore("gente",{UUID:"_id",STRING: "job",UUID:"user",ISODATE:"createdAt",ARRAY:"video"});
				objectStore=bd.createObjectStore("gente",{keyPath:"_id",autoIncrement: false});
				//objectStore.createIndex("job", "string", { unique: false });
  				//objectStore.createIndex("user", "string", { unique: false });
  				//objectStore.createIndex("createdAt", "string", { unique: false });
  				//objectStore.createIndex("video", "array", { unique: false });
  			}
			terminar.disabled=true;
		}

		function success(stream) {
			grabar.addEventListener("click",agregarVideo,false);
			terminar.addEventListener("click",stop,false);
			video.srcObject=stream;
			video.play();
			//var options = {mimeType: 'video/mp4'};
			var mediaRecorder = new MediaRecorder(stream);
			//video.src = window.URL.createObjectURL(stream)
			//console.log(mediaRecorder.state);
			function stop(e){
			//var mvideo = document.querySelector('#mvideo');
			mediaRecorder.stop();
			console.log(mediaRecorder.state);
      		console.log("recorder stopped");		
			//video.stop();
			grabar.style.background = null;
			grabar.disabled=false;
			terminar.disabled=true;			
			}
			mediaRecorder.onstop = function(e) {
			if(preguntas.length>i){
				if (preguntas.length-2==i) {
					document.getElementById("pre").innerHTML=preguntas[i+1];
				}
		  	console.log("data available after MediaRecorder.stop() called.");
		  	var blob = new Blob(array, { 'type' : 'video/webm; codecs=opus' });
		  	array=[];
		  	var d = new Date();
			var id=guid();
			var title=preguntas[i];
			var host="";
			var createdAt=d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
		  	var videoURL = window.URL.createObjectURL(blob);
		  	var vod=new Object;
		  	vod._id=id;
		  	vod.title=title;
		  	vod.key=videoURL;
		  	vod.host=host;
		  	vod.createdAt=createdAt;
		  	videoArray.push(vod);
		  	arrayvideo = "<video class='misvideo' id='mvideo"+i+"' controls></video>"+arrayvideo;
		  	document.getElementById('videosrc').innerHTML=arrayvideo;
		  	i++;
		  	
			for (var j =videoArray.length-1 ; j >= 0; j--) {
				mvideo = document.querySelector("#mvideo"+j);
				mvideo.src=videoArray[j].key;				
			}
			if (preguntas.length-1==i) {
				var id=guid();
				//var job=document.getElementById("job").value;
				var createdAt=d.getFullYear()+"-"+d.getMonth()+"-"+d.getDate()+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
				//var user=document.getElementById("user").value;
				var user=guid();
				console.log(id);				
				console.log(job);
				console.log(user);
				console.log(createdAt);
				console.log(videoArray);
				var transaccion=bd.transaction(["gente"],"readwrite");
				var almacen=transaccion.objectStore("gente");
				console.log(almacen);
				var agregar=almacen.add({ _id: id,job:job,user:user,createdAt:createdAt,video:videoArray });
				agregar.addEventListener("success",console.log("hecho"),false);
				grabar.disabled=true;
				terminar.disabled=true;	
			}
			}
		  	//mvideo.src = videoURL;
		  	
		  	//window.open(videoURL);
      		}
      		
			function agregarVideo(){
			mediaRecorder.start();
			console.log(mediaRecorder.state);
      		console.log("recorder started"); 
      		grabar.style.background = "red";
      		grabar.disabled=true;
      		terminar.disabled=false;     		
			}
			mediaRecorder.ondataavailable = function(e) {
      		array.push(e.data);      		
			}	
		}
		function error(error) {
			alert('Sucedió un error al acceder a la webcam :(');
			console.log(error);
		}
		navigator.webcam({video:true,audio:true}, success, error);
		
		
		window.addEventListener("load",iniciar,false);
		///////////////////////////////////////////////////////////
	

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}