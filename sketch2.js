f = 0
var audio;

function preload(){
    audio = loadSound("data/redbone.mp3");

}

function setup(){
    createCanvas(c = windowWidth, windowHeight);
    audio.play();
    audio.setVolume(0.5);
    amp = new p5.Amplitude();}

function windowResized() {
    resizeCanvas(c = windowWidth, windowHeight);
}

function draw(){
    var vol = amp.getLevel();
	r = random
	m = map(vol, 0, 0.5, 0, 1/5000);
	
	background(0)
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

    stroke(0);
    noFill();
    strokeWeight(width/2)
    ellipse(width/2, height/2, height/2+width/2, height/2+width/2);
}
