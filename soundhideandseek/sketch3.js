/*
Organic

Author:
  Jason Labbe

Site:
  jasonlabbe3d.com
*/

var audio;

function preload(){
    audio = loadSound("data/redbone.mp3");

}

function setup() {
	createCanvas(windowWidth, windowHeight);
	audio.play();
    audio.setVolume(0.5);
    amp = new p5.Amplitude();

}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }


function draw() {
	var vol = amp.getLevel();
	let f = random(50);
	
	background(0);
	
	stroke(150, map(vol, 0, 0.5, 180, 255), 255);
	strokeWeight(map(vol, 0, 0.5, 1, 3));
	noFill();
	
	push();
	translate(windowWidth / 2, windowHeight / 2);
	rotate(-f * 0.001);
	
	for (let rad = 0; rad < TWO_PI; rad += map(vol, 0, 0.5, 0.1, 0.5)) {
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
	
	stroke(0);
	noFill();
    strokeWeight(windowWidth/2)
    ellipse(width/2, height/2, windowHeight/2+windowWidth/2, windowHeight/2+windowWidth/2);   

}