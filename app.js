const canvas = document.getElementById('celloCanvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let time = 0;

const strings = [];
const particles = [];

class String {
    constructor(x, index) {
        this.x = x;
        this.index = index;
        this.y1 = 0;
        this.y2 = canvas.height;
        this.baseAmplitude = 2;
        this.amplitude = this.baseAmplitude;
        this.frequency = 0.01 + index * 0.002;
        this.phase = index * 0.5;
        this.glowIntensity = 0.3;
    }
    
    update() {
        const distFromMouse = Math.abs(mouseX - this.x);
        const mouseInfluence = Math.max(0, 1 - distFromMouse / 300);
        this.amplitude = this.baseAmplitude + mouseInfluence * 15;
        this.glowIntensity = 0.3 + mouseInfluence * 0.7;
    }
    
    draw() {
        ctx.beginPath();
        ctx.moveTo(this.x, this.y1);
        
        for (let y = 0; y <= canvas.height; y += 2) {
            const wave = Math.sin(y * this.frequency + time + this.phase) * this.amplitude;
            const focalWave = Math.sin(y * 0.005 + time * 0.3) * 3;
            ctx.lineTo(this.x + wave + focalWave, y);
        }
        
        ctx.strokeStyle = `rgba(200, 200, 255, ${this.glowIntensity})`;
        ctx.lineWidth = 1 + this.glowIntensity;
        ctx.shadowBlur = 10 + this.glowIntensity * 20;
        ctx.shadowColor = `rgba(150, 150, 255, ${this.glowIntensity})`;
        ctx.stroke();
        ctx.shadowBlur = 0;
    }
}

class Particle {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.vx = (Math.random() - 0.5) * 2;
        this.vy = (Math.random() - 0.5) * 2;
        this.life = 1.0;
        this.decay = 0.01;
        this.size = Math.random() * 2 + 1;
    }
    
    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.life -= this.decay;
    }
    
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(180, 180, 255, ${this.life * 0.6})`;
        ctx.shadowBlur = 5;
        ctx.shadowColor = `rgba(150, 150, 255, ${this.life})`;
        ctx.fill();
        ctx.shadowBlur = 0;
    }
}

function init() {
    strings.length = 0;
    const stringCount = 6;
    const spacing = canvas.width / (stringCount + 1);
    
    for (let i = 0; i < stringCount; i++) {
        strings.push(new String(spacing * (i + 1), i));
    }
}

function createParticles() {
    if (Math.random() < 0.1) {
        const string = strings[Math.floor(Math.random() * strings.length)];
        const y = Math.random() * canvas.height;
        particles.push(new Particle(string.x, y));
    }
}

function animate() {
    time += 0.05;
    
    ctx.fillStyle = 'rgba(5, 5, 8, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    strings.forEach(s => {
        s.update();
        s.draw();
    });
    
    createParticles();
    
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();
        if (particles[i].life <= 0) {
            particles.splice(i, 1);
        }
    }
    
    // Focal point glow
    const gradient = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 100);
    gradient.addColorStop(0, 'rgba(150, 150, 255, 0.1)');
    gradient.addColorStop(1, 'rgba(150, 150, 255, 0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(mouseX - 100, mouseY - 100, 200, 200);
    
    requestAnimationFrame(animate);
}

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});

init();
animate();
