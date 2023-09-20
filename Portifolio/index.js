const canvas = document.getElementById('canvas1');
const ctx= canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//canva settings
const grd = ctx.createRadialGradient(canvas.width/2, canvas.height/2, canvas.width/5 ,canvas.width/2, canvas.height/2, canvas.width/2);
grd.addColorStop(0, "navy");
grd.addColorStop(1, "aqua");

// Fill with gradient
ctx.strokeStyle = grd;
ctx.lineCap = 'round';
ctx.globalAlpha = 0.3;
ctx.lineWidth= 3;


class Particle {
    constructor(effect){
        this.effect = effect;
        this.x = Math.floor(Math.random() * this.effect.width);
        this.y = Math.floor(Math.random() * this.effect.height);
        this.speedX = 0.01/3;
        this.speedY = 0.01/3;
        this.history =  [{x: this.x, y: this.y}];
        this.maxLength =60;
    }
    draw(context){
        context.beginPath();
        context.moveTo(this.history[0].x, this.history[0].y);
        for (let i = 0; i < this.history.length; i++) {
            context.lineTo(this.history[i].x, this.history[i].y)         
        }
        context.stroke();
    }
    update(){
        let n = this.effect.perlin.get(this.x * this.effect.noiseScale, this.y * this.effect.noiseScale);
        let a = Math.PI * 2 * n;
        this.x += Math.cos(a)+ (this.speedX * this.effect.mouseX);
        this.y += Math.sin(a)+ (this.speedY * this.effect.mouseY);
        this.history.push({x: this.x, y: this.y});
        if(this.history.length >= this.maxLength){
            this.history.shift();
        }
        if(this.x <= 0|| this.x >= this.effect.width || this.y <= 0 || this.y >= this.effect.height){
            this.x = Math.floor(Math.random() * this.effect.width);
            this.y = Math.floor(Math.random() * this.effect.height);
            this.history.length = 0;
            this.history =  [{x: this.x, y: this.y}];
        }
    }

}

class Effect{
    constructor(width, height){
        this.width = width;
        this.height = height;
        this.particles = [];
        this.numParticles = 1000;
        this.init();
        this.mouseX = 1;
        this.mouseY = 1;
        this.perlin = new Perlin();
        this.noiseScale = 0.009;
    }
    init(){
        for (let i = 0; i < this.numParticles; i++) {
           this.particles.push(new Particle(this));
        }  
    }
    render(context){
        this.particles.forEach(particle =>{
            particle.draw(context);
            particle.update();
        })
    }
    resetPerlin(){
        this.perlin = new Perlin();
    }
}

const effect = new Effect(canvas.width, canvas.height);
effect.render(ctx);
console.log(effect);

window.addEventListener("mousemove", (e) =>{
    effect.mouseX = e.clientX-(window.innerWidth/2); 
    effect.mouseY = e.clientY-(window.innerHeight/2);
    //console.log(" perling: ", perlin.get(effect.mouseX, effect.mouseY))
});

document.onclick= function(){
    effect.resetPerlin();
    effect.numParticles+= 100;
};

function animate(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    effect.render(ctx);
    requestAnimationFrame(animate);
}
animate();