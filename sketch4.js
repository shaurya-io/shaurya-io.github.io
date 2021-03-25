var audio;

function preload(){
    audio = loadSound("data/redbone.mp3");

}

function setup(){
    createCanvas(windowWidth, windowHeight)
    audio.play();
    audio.setVolume(0.5);
    amp = new p5.Amplitude();
}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
  }


function draw(){

  var vol = amp.getLevel();
  strokeWeight(1.5)
  background(0)
  smooth();

  translate(windowWidth/4, windowHeight/4)
	
	s = map(vol, 0.45, 0.5, 0.01, 0.1)
    r = map(vol, 0.2, 0.5, 100, 600)
	f = frameCount * s
	n = noise

	
  for (x = 0; x < r; x += 15) {
    for (y = 0; y < r; y += 5) {
			o = n(i = f + x * s, j = f + y * s) * windowWidth/2
      p = n(j, i) * windowHeight/2
      
      stroke(80, map(vol, 0.2, 0.4, 180, 255), 255);
      line(x, y, x + o, y + p)
    }
  }

  stroke(0);
  noFill();
  strokeWeight(windowWidth/2)
  ellipse(windowWidth/4, windowHeight/4, windowHeight/2+windowWidth/2, windowHeight/2+windowWidth/2); 
}