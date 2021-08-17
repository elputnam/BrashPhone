let swarm = [];
let pix = [];
let num;
let heartRate = [];
let B = 0;
let list1 = [];

function preload(){
    //Load list of json file names
    list1 = loadStrings('dataList.txt');
}
function setup() {
  createCanvas(windowWidth, windowHeight);
  colorMode(HSB, 360, 100, 100, 100);
  frameRate(25);
  num = height*0.3;
  for (let i = 0; i < num; i++) {
    swarm.push(new Screen());
  }

  //select day 
  let day = int(random(1,131));
  heartRate = loadJSON(list1[day]);
}

function draw() {
  background(320, 50, 100, 10);
  
  
  if (frameCount >= 100){
    //screens
    for (let i = 0; i < swarm.length; i++) {
      swarm[i].run();
    }

    //heartrate data mapping
    bpm = heartRate[B].value['bpm'];
    colA = map(bpm, 60, 170, 0, 360);
    colB = map(bpm, 60, 170, 360, 0);
    len = map(bpm, 60, 170, 100, 500);
    sw = map(bpm, 60, 170, 10, 1);
    B += 1;

    //pixels
    pix.push(new Pixel(createVector(mouseX, mouseY)));
    for(let i = pix.length - 1; i >= 0; i--){
      let p = pix[i];
      p.run();
      if (p.ghost()){
        pix.splice(i, 1);
     }
    }
  }
}

class Screen {
  constructor() {
    this.loc = createVector(random(width), random(height));
    this.vel = createVector(0, 0);
    this.ts = 5;
    this.len = random(20);
    this.shade = random(100);
    //this.vel.mult((random(-1, 1)));
  }

  run() {
    this.edges();
    this.update();
    this.display();
  }
  edges(){
    if (this.loc.x < 0) {
      this.loc.x = mouseX;
      this.loc.y = mouseY;
      }
    if (this.loc.x > width) {
      this.loc.x = mouseX;
      this.loc.y = mouseY;
      }
    if (this.loc.y < 0) {
      this.loc.x = mouseX;
      this.loc.y = mouseY;
      }
    if (this.loc.y > height) {
      this.loc.x = mouseX;
      this.loc.y = mouseY;
      }
  }
  update() {
    this.spot = createVector(mouseX, mouseY)
   this.force = p5.Vector.sub(this.spot, this.loc);
    this.accel = createVector(random(-2, 2), random(-2, 2));
    this.accel.sub(this.force);
    //this.force = p5.Vector.add(this.loc, this.repel);
    this.vel.add(this.accel);
    this.vel.limit(this.ts);
    this.loc.add(this.vel);
    this.force.mult(0)
  }

  display() {
    noFill();
    strokeWeight(1);
    stroke(this.shade);
    for (let i = 0; i < this.len; i++) {
      circle(this.loc.x, this.loc.y, 5 * i);
    }
  }
}

class Pixel{
  constructor(loc){
    this.hue = random(70);
    this.lum = 50;
    this.loc = loc.copy();
    this.len = random(10, len);
  }
  run(){
    this.update();
    this.display();
  }
  
  update(){
    this.lum -= 0.5;
    this.H1 += 1;
  }
  
  display(){
    rectMode(CENTER);
    //noStroke();
    strokeWeight(sw);
    stroke(random(100), this.lum)
    fill(colA, 100, 100, this.lum)
    //fill(this.hue, random(100), random(100), this.lum);
    square(this.loc.x, this.loc.y, this.len);
  }
  
  ghost(){
    if (this.lifespan < 0.0){
      return true;
    } else {
      return false;
    }
  }
}
