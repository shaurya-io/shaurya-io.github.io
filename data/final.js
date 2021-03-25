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
	footsteps = loadSound("data/footsteps.mp3");
	breathing = loadSound("data/breathing.mp3");
	neighbor = loadSound("data/neighbor.mp3");

	// Images
    heart = loadImage("data/img2heart.png");

}

// Setup
function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 255);
//	mouseX = width;
	backgroundSounds.play();
    backgroundSounds.setVolume(0.5);
    ampBackground = new p5.Amplitude();

	ampBackground.setInput(backgroundSounds);

	heartbeat.play();
    heartbeat.setVolume(0.5);
    ampHeartbeat = new p5.Amplitude();
	ampHeartbeat.setInput(heartbeat);

	footsteps.play();
    footsteps.setVolume(0.5);
    ampFootsteps = new p5.Amplitude();
	ampFootsteps.setInput(footsteps);

	breathing.play();
    breathing.setVolume(0.8);
    ampBreathing = new p5.Amplitude();
	ampBreathing.setInput(breathing);

	neighbor.play();
    neighbor.setVolume(0.5);
    ampNeighbor = new p5.Amplitude();
	ampNeighbor.setInput(neighbor);

}

// Resize Window
function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}

//-----------------------------------------------

function dot(x, y, vx, vy) {
	this.pos = new p5.Vector(x, y);
	this.vel = new p5.Vector(vx, vy);
}

//-----------------------------------------------

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

//-----------------------------------------------

function mask(){
    push();
    stroke(0);
    fill(255);
    strokeWeight(width/2)
    ellipse(width/2, height/2, height/2+width/2, height/2+width/2);
    pop();
}

//-----------------------------------------------

function keyPressed(){
    if (keyCode === RIGHT_ARROW){
        picker +=1;
    }
    if (keyCode === LEFT_ARROW){
        picker -=1;
    }
    
    if (picker>4){
        picker = 0;
    }
    if (picker<0){
        picker = 4;
    }

}


//--------------------------------------------------------------------//
//This is where the main functions for the visualizers go//
//--------------------------------------------------------------------//

function sketch0(){
    push();
    //imageMode(CENTER);
	translate(windowWidth/2, windowHeight/2);
    image(heart, 0,0);
    pop();}

function heartresize(){   
	imageMode(CENTER);
	var heartSize = map(heartbeatVol, 0.3, 0.5, 1728, 1920);
	image(heart,windowWidth/2,windowHeight/2,heartSize*1.5,heartSize);
}
//-----------------------------------------------

function sketch1(){

    spawn();
	

	
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
		
		stroke(h, 255, 255, falloff);
		strokeWeight(0.5);
		fill(h, 255, 255, falloff);
		
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
	m = map(neighborVol, 0, 0.5, 0, 1/5000);
    c = windowWidth;
	

    strokeWeight(1)
	
	for (i = c; i--;) {
		x = r(c)
		y = r(c)
		push()
		translate(x, y)
		rotate(noise((x + f) * m, (y + f + c) * m) * 45)
        stroke(random(0,255),255, 255)
		line(-100, 0, 100, 0)
		pop()
	}
	
	f+=5
}

//-----------------------------------------------

function sketch3(){

    let f = random(50);
	

	
	stroke(150, map(breathingVol, 0, 0.5, 180, 255), 255);
	strokeWeight(map(breathingVol, 0, 0.5, 1, 3));
	noFill();
	
	push();
	translate(windowWidth / 2, windowHeight / 2);
	rotate(-f * 0.001);
	
	for (let rad = 0; rad < TWO_PI; rad += map(breathingVol, 0, 0.5, 0.1, 0.5)) {
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

  strokeWeight(1.5)

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
      
      stroke(80,map(backgroundVol, 0.1, 0.4, 180, 255),255);
      line(x, y, x + o, y + p)
    }
  }
pop();
}


//--------------------------------------------------------------------//
//This is where the main draw() goes//
//--------------------------------------------------------------------//

function draw(){
    background(0);
	backgroundVol = ampBackground.getLevel();
	breathingVol = ampBreathing.getLevel();
	footstepsVol = ampFootsteps.getLevel();
	heartbeatVol = ampHeartbeat.getLevel();
	neighborVol = ampNeighbor.getLevel();

    if (picker ==0){
       sketch0();
       heartresize(); 
    }
    if (picker==1){
        sketch1();
    }
    if (picker==2){
        sketch2();
    }
    if(picker==3){
        sketch3();
    }
    if(picker==4){
        sketch4();
    }


    mask();
}
