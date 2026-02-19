
<template>
  <canvas 
    ref="canvasRef" 
    class="fixed top-0 left-0 w-full h-full pointer-events-none z-[50]"
  ></canvas>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  colors: {
    type: Array,
    default: () => ['#C8AAFF', '#ffffff', '#7093FF', '#FFF2A6'] 
  },
  duration: {
    type: Number,
    default: 5000
  },
  particleCount: {
    type: Number,
    default: 250
  },
  minSize: {
    type: Number,
    default: 4
  },
  maxSize: {
    type: Number,
    default: 30
  },
  minForce: {
    type: Number,
    default: 2
  },
  maxForce: {
    type: Number,
    default: 8
  }
});

const canvasRef = ref(null);
let ctx = null;
let animationFrameId = null;
let particles = [];
let startTime = 0;

// Random helper
const random = (min, max) => Math.random() * (max - min) + min;

class Particle {
  constructor(x, y, colors, minSize, maxSize, minForce, maxForce) {
    this.x = x;
    this.y = y;
    // Explode from center with random angle and speed
    const angle = random(0, Math.PI * 2);
    const velocity = random(minForce, maxForce); // Explosion speed
    this.vx = Math.cos(angle) * velocity;
    this.vy = Math.sin(angle) * velocity;
    
    this.color = colors[Math.floor(Math.random() * colors.length)];
    // Random size between min and max
    this.originalSize = random(minSize, maxSize);
    this.size = this.originalSize;
    
    this.life = 1.0;
    this.decay = random(0.005, 0.015); // How fast it fades
    
    // Shapes: 0=circle, 1=star, 2=cross, 3=square
    this.shape = Math.floor(random(0, 4));
    this.rotation = random(0, Math.PI * 2);
    this.rotationSpeed = random(-0.1, 0.1);
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Friction
    this.vx *= 0.96;
    this.vy *= 0.96;
    
    // Gravity (slight)
    this.vy += 0.05;
    
    this.life -= this.decay;
    
    // Shrink effect: animate size from original to 0 based on life
    // Using a power curve for smoother shrinking (optional, but linear is fine too)
    // this.size = this.originalSize * Math.pow(this.life, 0.5); 
    this.size = this.originalSize * Math.max(0, this.life);

    this.rotation += this.rotationSpeed;
  }

  draw(ctx) {
    if (this.life <= 0 || this.size <= 0) return;
    
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    ctx.globalAlpha = this.life;
    ctx.fillStyle = this.color;
    
    // Add glow
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;

    const currentSize = this.size; // Use the updated shrunk size

    switch(this.shape) {
      case 0: // Circle
        ctx.beginPath();
        ctx.arc(0, 0, currentSize / 2, 0, Math.PI * 2);
        ctx.fill();
        break;
        
      case 1: // Star (4 points)
        this.drawStar(ctx, 4, currentSize / 2, currentSize / 6);
        break;
        
      case 2: // Cross / Plus
        ctx.fillRect(-currentSize/2, -currentSize/8, currentSize, currentSize/4);
        ctx.fillRect(-currentSize/8, -currentSize/2, currentSize/4, currentSize);
        break;
        
      case 3: // Square / Diamond
        ctx.fillRect(-currentSize/2, -currentSize/2, currentSize, currentSize);
        break;
    }
    
    ctx.restore();
  }
  
  drawStar(ctx, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = 0;
    let y = 0;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(0, 0 - outerRadius);
    for (let i = 0; i < spikes; i++) {
        x = Math.cos(rot) * outerRadius;
        y = Math.sin(rot) * outerRadius;
        ctx.lineTo(x, y);
        rot += step;

        x = Math.cos(rot) * innerRadius;
        y = Math.sin(rot) * innerRadius;
        ctx.lineTo(x, y);
        rot += step;
    }
    ctx.lineTo(0, 0 - outerRadius);
    ctx.closePath();
    ctx.fill();
  }
}

const resizeCanvas = () => {
  if (canvasRef.value) {
    canvasRef.value.width = window.innerWidth;
    canvasRef.value.height = window.innerHeight;
  }
};

const animate = (timestamp) => {
  if (!startTime) startTime = timestamp;
  const elapsed = timestamp - startTime;
  
  if (elapsed > props.duration) {
    // End animation
    return;
  }
  
  if (!ctx || !canvasRef.value) return;
  
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height);
  
  // Use 'lighter' for glowing effect
  ctx.globalCompositeOperation = 'lighter';
  
  particles.forEach(p => {
    p.update();
    p.draw(ctx);
  });
  
  // Cleanup dead particles
  // Note: For performance, we might want to just stop drawing them or use a fixed pool, 
  // but filtering is fine for < 500 particles.
  particles = particles.filter(p => p.life > 0);
  
  if (particles.length > 0) {
    animationFrameId = requestAnimationFrame(animate);
  }
};

onMounted(() => {
  if (canvasRef.value) {
    ctx = canvasRef.value.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Spawn particles
    const centerX = window.innerWidth / 2;
    const centerY = window.innerHeight * 0.3; // Upper part
    
    for (let i = 0; i < props.particleCount; i++) {
      particles.push(new Particle(centerX, centerY, props.colors, props.minSize, props.maxSize, props.minForce, props.maxForce));
    }
    
    animationFrameId = requestAnimationFrame(animate);
  }
});

onUnmounted(() => {
  cancelAnimationFrame(animationFrameId);
  window.removeEventListener('resize', resizeCanvas);
});
</script>
