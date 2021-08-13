const canvas= document.getElementById('canvas1');
const ctx=canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height= window.innerHeight/2;
let particleArray = [];
let adjustX = 60;
let adjustY = 10;
let active = false;

// handle mouse
const mouse = {
    x: null,
    y: null,
    radius: 100
}


window.addEventListener('mousemove', (event)=>{
    mouse.x = event.x;
    mouse.y = event.y;
})
canvas.addEventListener('mouseenter', ()=>{
    active = true;

})
canvas.addEventListener('mouseleave', ()=>{
    active = false;
})


ctx.fillStyle= 'rgb(255, 165, 0)';
ctx.font= '20px Verdana';
ctx.fillText('Cultures Fermented', 00, 40);


function randomDirection(max){
    let positiveCheck = Math.random();
    if (positiveCheck > 0.5){
        return (Math.random()*max)
    } else return -(Math.random()*max)

}

const textCoordinates = ctx.getImageData(0,0,200,100);

class Particle {
    constructor(x,y){
        this.x = Math.random()*canvas.width;
        this.y = Math.random()*canvas.height;
        this.size = 3;
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
            this.x += this.randomDirectionX/1000 
            this.y += this.randomDirectionY/1000 
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
    particleArray = [];
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

init();


function animate(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i ++){
        particleArray[i].draw();
        particleArray[i].update();
    }
    requestAnimationFrame(animate);
}

animate();