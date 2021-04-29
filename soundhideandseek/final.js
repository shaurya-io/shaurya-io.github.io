// IM Assignment 3: hide and seek. (p5.JS)
// Description: This is the p5.js script for the site.
// =========================================================================================================
// =========================================================================================================
// Global Variables


// Audio Files
var backgroundSounds;
var heartbeat;
var breathing;
var footsteps;
var neighbor;
var count = 0;

var firstTouch = false;
var isEnded = false;


// Volumes

var backgroundVol;
var heartbeatVol;
var breathingVol;
var footstepsVol;
var neighborVol;

// Image File
var heart;

f = 0;
var picker = 0;

var dotsholder = [];



// =========================================================================================================
// =========================================================================================================
// Setup Functions

// Preload. Load sounds and images before the start of draw().
function preload(){
	// Audio
    backgroundSounds = loadSound("data/background.mp3");
	heartbeat = loadSound("data/heartbeats.mp3");
	footsteps = loadSound("data/breathingfootsteps.mp3");
 
	// Images
    heart = loadImage("data/img2heart.png");

}

// Setup
function setup() {
	createCanvas(windowWidth, windowHeight);
//	mouseX = width;

	ampBackground = new p5.Amplitude();
	ampBackground.setInput(backgroundSounds);
	fftBackground = new p5.FFT();
	fftBackground.setInput(backgroundSounds);

	ampHeartbeat = new p5.Amplitude();
	ampHeartbeat.setInput(heartbeat);
	fftHeartbeat = new p5.FFT();
	fftHeartbeat.setInput(heartbeat);
	heartbeat.onended(function(){
		var currentimage = document.getElementById("image1");
		$('#image1').animate({opacity:1}).delay(1500);
		currentimage.src = "data/ending.gif";
		$('#reload').animate({opacity:1});
	});

	ampFootsteps = new p5.Amplitude();
	ampFootsteps.setInput(footsteps);
	fftFootsteps = new p5.FFT();
	fftFootsteps.setInput(footsteps);

}

// Resize Window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}


// Dot
function dot(x, y, vx, vy) {
	this.pos = new p5.Vector(x, y);
	this.vel = new p5.Vector(vx, vy);
}

// Spawn
function spawn() {
	let choice = int(random(4));

	if (choice == 0) {
		// Spawn on the left.
		dotsholder.push(new dot(
			random(-50, 0), random(height/4, 3*height/4), 
			random(0, 4), random(-4, -2)));
	} else if (choice == 1) {
		// Spawn on the right.
		dotsholder.push(new dot(
			random(width, width + 50), random(height/4, 3*height/4), 
			random(-4, 0), random(-4, -2)));
	} else if (choice == 2) {
		// Spawn in the bottom.
		dotsholder.push(new dot(
			random(0, width), height + 100, 
			random(-3, 3), random(-4, -2)));
    } else if (choice == 3) {
        // Spawn in the top.
        dotsholder.push(new dot(
            random(0, width), height - 100, 
            random(-3, 3), random(-4, -1)));}

	
}

// Masking
function mask(){
    push();
    stroke(0);
    noFill();
    strokeWeight(width/2)
    ellipse(width/2, height/2, height/2+width/2, height/2+width/2);
    pop();
}

// Keypressed
function keyPressed(){
    if (keyCode === RIGHT_ARROW){
        picker +=1;
    }
    if (keyCode === LEFT_ARROW){
        picker -=1;
    }
    
    if (picker>5){
        picker = 0;
    }
    if (picker<0){
        picker = 5;
    }

}


//--------------------------------------------------------------------//
//This is where the main functions for the visualizers go//
//--------------------------------------------------------------------//

function sketch0(){
    push();
    imageMode(CENTER);
    image(heart, windowWidth/2,windowHeight/2);
    pop();}

function heartresize(){   
	imageMode(CENTER);
	var heartSize = map(heartbeatVol, 0.4, 0.5, 1920, 1824);
	image(heart,windowWidth/2,windowHeight/2,heartSize*0.88,heartSize*9/16*.88);
}
//-----------------------------------------------

function sketch1(){

	spawn();
	
	push();
	colorMode(RGB);
	
	let threshold = map(footstepsVol, 0, 0.5, 100, 500);
	
	for (let i = dotsholder.length - 1; i > -1; i--) {
		let dot = dotsholder[i];
		dot.pos.add(dot.vel);
		
		if (dot.pos.y < -100 || dot.pos.x < -100 || dot.pos.x > width + 100) {
			dotsholder.splice(i, 1);
		}
	}
	
	for (let i = 0; i < dotsholder.length; i++) {
		let dot = dotsholder[i];
		
		let h = map(dot.pos.x, 0, width, 0, 255);
		let d = dist(dot.pos.x, dot.pos.y, width / 2, 0);
		let falloff = 10;
		
		if (d < 900) {
			falloff = map(d, 0, 900, -50, 50);
		}
		
		stroke(h, 255, 255, 125);
		strokeWeight(2);
		point(dot.pos.x, dot.pos.y);
		
		if (falloff < 0) {
			continue;
		}
		
		stroke(255, 255, 255, falloff);
		strokeWeight(0.5);
		fill(255, 255, 255, falloff);
		
		let foundCount = 0;
		
		beginShape();
		vertex(dot.pos.x, dot.pos.y);
		
		for (let j = 0; j < dotsholder.length; j++) {
			if (foundCount > 5) {
				break;
			}
			
			if (i == j) {
				continue;
			}
			
			let otherdot = dotsholder[j];
			
			let d = dist(dot.pos.x, dot.pos.y, otherdot.pos.x, otherdot.pos.y);
			if (d > threshold) {
				continue;
			}
			
			vertex(otherdot.pos.x, otherdot.pos.y);
			foundCount++;
		}
		
		endShape(CLOSE);
	}

}

//-----------------------------------------------

function sketch2(){

	r = random
	m = map(backgroundVol, 0, 0.5, 0, 1/3000);
    c = windowWidth;
	

    strokeWeight(0.5)
	
	for (i = c; i--;) {
		x = r(c)
		y = r(c)
		push()
		translate(x, y)
		rotate(noise((x + f) * m, (y + f + c) * m) * 45)
        stroke(255,255, 255)
		line(-100, 0, 100, 0)
		pop()
	}
	
	f+=5
}

//-----------------------------------------------

function sketch3(){

    let f = random(50);
	

	
	stroke(255,255, 255);
	strokeWeight(map(footstepsVol, 0, 0.5, 1, 4));
	noFill();
	
	push();
	translate(windowWidth / 2, windowHeight / 2);
	rotate(-f * 0.001);
	
	for (let rad = 0; rad < TWO_PI; rad += map(footstepsVol, 0, 0.5, 0.1, 0.5)) {
		push();
	

		rotate(rad);
		
		// Kill noise at start/end so they don't overlap.
		let weight = 1;
		if (rad < QUARTER_PI) {
			weight = map(rad, 0, QUARTER_PI, 0, 1);
		} else if (rad > TWO_PI - QUARTER_PI) {
			weight = map(rad, TWO_PI - QUARTER_PI, TWO_PI, 1, 0);
		}
		
		let n1 = map(noise(f * 0.005 + rad), 0, 1, -2, 2) * weight;
		let n2 = map(noise((1000 + f) * 0.001 + rad), 0, 1, -2, 2) * weight;
		
		beginShape();
		curveVertex(0, 0);
		curveVertex(sin(f * 0.04 - 5 + n1) * 25, 100);
		curveVertex(cos(f * 0.04 - 2.5 + n2) * 50, 200);
		curveVertex(sin(f * 0.04 + n1) * 75, 300);
		curveVertex(0, 400);
		curveVertex(0, 500);
		endShape();
		
		pop();
	}

	pop();


}

//-----------------------------------------------

function sketch4(){

  strokeWeight(map(backgroundVol, 0, 0.5, 0.5, 2.5))

  smooth();

  push();
  colorMode(RGB)

  translate(windowWidth/4, windowHeight/4)
	
    let s = map(backgroundVol, 0, 0.5, 0.01, 0.1)
    let r = map(backgroundVol, 0, 0.5, 100, 600)
    let f = frameCount * s
    let n = noise

	
  for (x = 0; x < r; x += 15) {
    for (y = 0; y < r; y += 5) {
			o = n(i = f + x * s, j = f + y * s) * windowWidth/2
      p = n(j, i) * windowHeight/2
      
      stroke(255,255,255);
      line(x, y, x + o, y + p)
    }
  }
	pop();
}

function sketch5(){

	push();
	colorMode(RGB);
	var backgroundWave = fftBackground.waveform();
	var heartbeatWave = fftHeartbeat.waveform();

	fill(255);

	for(let i = 0; i < backgroundWave.length; i++){
		// Map x location using index number of waveform array
		let x = map(i, 0, backgroundWave.length, 0, windowWidth);
		// May y location using the amplitude value for the specific time segment
		let y = map(backgroundWave[i], -1, 1, windowHeight, 0);
		
		circle(x, y, 3);
	  }

	
	fill('red');
	for(let i = 0; i < heartbeatWave.length; i++){
		// Map x location using index number of waveform array
		let x = map(i, 0, heartbeatWave.length, 0, windowWidth);
		// May y location using the amplitude value for the specific time segment
		let y = map(heartbeatWave[i], -1, 1, windowHeight, 0);
		
		circle(x, y, 3);
	  }
	
	pop();

}

function mousePressed(){
	if(count == 5){
		count++;
	}
}

function setAudio(){
	backgroundSounds.play();
	heartbeat.play();
	footsteps.play();
	backgroundSounds.setVolume(0.5);
	heartbeat.setVolume(0.5);
	footsteps.setVolume(0.5);
	count++;
}


// =========================================================================================================
// =========================================================================================================
// Main Execution

function draw(){

	if (count == 4){
		firstTouch = true;
	}

	if(firstTouch == true){
		setAudio();
		firstTouch = false;
	}
	else{
		background(0);
		backgroundVol = ampBackground.getLevel();
		footstepsVol = ampFootsteps.getLevel();
		heartbeatVol = ampHeartbeat.getLevel();
	
		if (picker ==0){
		   sketch0();
		   heartresize(); 
		}
		else if (picker==1){
			sketch1();
		}
		else if (picker==2){
			sketch2();
		}
		else if (picker==3){
			sketch3();
		}
		else if (picker==4){
			sketch4();
		}
		else if (picker==5){
			sketch5();
		}
	}
	



    mask();
}
