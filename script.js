const canvas= document.getElementById('canvas1');
const ctx=canvas.getContext('2d');
let canvasContainer = document.getElementById("canvasContainer");
canvas.width = canvasContainer.offsetWidth;
canvas.height= canvasContainer.offsetHeight;

let canvasStyle = canvasContainer.currentStyle || window.getComputedStyle(canvasContainer);
let canvasMarginLeft= canvasStyle.marginLeft;



let particleArray = [];
let adjustX = 0;
let adjustY = 0;
let active = false;

// handle mouse
const mouse = {
    x: null,
    y: null,
    radius: 75
}


function generateParticles(){
    for (let y = 0, y2= textCoordinates.height; y < y2; y++){
        for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
            if (textCoordinates.data[(y*4*textCoordinates.width) + (x*4) +3]>128){
                let positionX = x + adjustX;
                let positionY = y + adjustY;
                particleArray.push(new Particle(positionX*5, positionY*5));
            }
        }
    }
}


function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i ++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate);
}

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    let words = text.split(' ');
    let line = '';

    for(let n = 0; n < words.length; n++) {
        let testLine = line + words[n] + ' ';
        let metrics = context.measureText(testLine);
        let testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
        }
        else {
            line = testLine;
        }
    }
    context.fillText(line, x, y);
  }
  
  let lineHeight = 20;
  let maxWidth= 95;
  let wrapX = 0;
  let wrapY = 20
  let text = 'Form Follows Function';
  


  

ctx.fillStyle= 'rgb(255, 165, 0)';
ctx.font= '20px Verdana';
wrapText(ctx, text, wrapX, wrapY, maxWidth, lineHeight);
let textCoordinates = ctx.getImageData(0,0,200,100);
// ctx.fillText('Form', 00, 40);
// ctx.fillText('Follows', 00, 60);
// ctx.fillText('Function', 00, 80);





function getMousePos(canvas, e) {
    var rect = canvas.getBoundingClientRect();
    mouse.x= e.clientX - rect.left
    mouse.y= e.clientY - rect.top

}

function addEventListeners(){
    canvas.addEventListener('mousemove', (event)=>{
        getMousePos(canvas, event);
     })
     
     canvas.addEventListener('mouseenter', ()=>{
         active = true;
     })

     canvas.addEventListener('touchstart', ()=>{
        active = true;
    })



     canvas.addEventListener('mouseleave', ()=>{
         active = false;
     })
     canvas.addEventListener('touchend', ()=>{
        active = false;
    })

     input = document.getElementById("formFollowsInput");

     input.addEventListener('input',()=>{
         const positionArray = [];
         let counter = 0;
         ctx.clearRect(0, 0, 200, 100)
         wrapText(ctx, input.value, wrapX, wrapY, maxWidth, lineHeight);
         textCoordinates = ctx.getImageData(0,0,200,100);

         for (let y = 0, y2= textCoordinates.height; y < y2; y++){
            for (let x = 0, x2 = textCoordinates.width; x < x2; x++){
                if (textCoordinates.data[(y*4*textCoordinates.width) + (x*4) +3]>128){
                    let positionX = x + adjustX;
                    let positionY = y + adjustY;
                    positionArray.push([positionX*5, positionY*5]);
                }
            }
        }

         for (let z = 0; z < particleArray.length; z++){
             particleArray[z].baseX = positionArray[counter][0];
             particleArray[z].baseY = positionArray[counter][1];
             counter +=1
             if (counter>=positionArray.length){
                 counter=0;
             }
         }
     })
     
}





function randomDirection(max){
    let positiveCheck = Math.random();
    if (positiveCheck > 0.5){
        return (Math.random()*max)
    } else return -(Math.random()*max)

}



class Particle {
    constructor(x,y){
        this.x = Math.random()*canvas.width;
        this.y = Math.random()*canvas.height;
        this.size = Math.random()*3;
        this.baseX = x;
        this.baseY = y;
        this.density = (Math.random()* 30) + 1;
        this.randomDirectionX = randomDirection(canvas.width)
        this.randomDirectionY = randomDirection(canvas.height)
        this.r = (Math.random()*255).toString();
        this.b = (Math.random()*255).toString();
        this.g = (Math.random()*255).toString();
        
    }
    draw(){

        ctx.fillStyle = `rgb(${this.r}, ${this.g}, ${this.b})`;
        ctx.beginPath();
        ctx.arc(this.x,this.y,this.size,0,Math.PI*2);
        ctx.closePath();
        ctx.fill();
    }
    update(){
        if (active === true){
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx*dx + dy*dy);
            let forceDirectionX = dx/distance;
            let forceDirectionY = dy/distance;
            let maxDistance = mouse.radius;
            let force = (maxDistance - distance) / maxDistance;
            let directionX = forceDirectionX * force * this.density;
            let directionY = forceDirectionY * force * this.density;


            if (distance < mouse.radius){
                this.x -= directionX ;
                this.y -= directionY ;
            } else{
                if (this.x !== this.baseX){
                    let dx = this.x - this.baseX;
                    this.x -= dx/10;
                }
                if (this.y !== this.baseY){
                    let dy = this.y - this.baseY;
                    this.y -= dy/10;
                }
            }
        } else{
            this.x += this.randomDirectionX/600 
            this.y += this.randomDirectionY/600 
            if (this.x >= canvas.width || this.x <= 0 ){
                this.randomDirectionX=randomDirection(canvas.width)
            }
            if (this.y >= canvas.height || this.y <= 0 ){
                this.randomDirectionY=randomDirection(canvas.height)
            }
        }


    }

}





function init(){
    addEventListeners();
    particleArray = [];    
    generateParticles();
    generateParticles();
    generateParticles();
    animate();
    
}

init();



