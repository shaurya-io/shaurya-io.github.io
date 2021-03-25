/*
Razer node network

Trying to recreate a cool wallpaper I saw in a computer store.
Framerate takes a bit of a hit since it's not very optimized.

Controls:
	- Move the mouse along its width to change the distance threshold.

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var dotsholder = [];
var audio;

function preload(){
    audio = loadSound("data/redbone.mp3");

}


function setup() {
	createCanvas(windowWidth, windowHeight);
	colorMode(HSB, 255);
	mouseX = width;
    audio.play();
    audio.setVolume(0.5);
    amp = new p5.Amplitude();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }


function draw() {

	// var vol = amp.getLevel();
	spawn();
	
	background(0);



	
	let threshold = map(vol, 0, 0.5, 0, 500);
	
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
	
	noStroke();
	fill(255);

    stroke(0);
    noFill();
    strokeWeight(width/2)
    ellipse(width/2, height/2, height/2+width/2, height/2+width/2);
}


function dot(x, y, vx, vy) {
	this.pos = new p5.Vector(x, y);
	this.vel = new p5.Vector(vx, vy);
}


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