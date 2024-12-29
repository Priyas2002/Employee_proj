class Particle {
    constructor(x, y, type = 'mouse') {
        this.x = x;
        this.y = y;
        this.type = type;
        // More varied sizes based on type
        this.baseSize = type === 'mouse' 
            ? Math.random() * 2 + 1
            : Math.random() * 4 + 2;
        this.size = this.baseSize;
        
        // More dynamic initial velocities
        const angle = Math.random() * Math.PI * 2;
        const speed = type === 'mouse' 
            ? Math.random() * 2 + 1
            : Math.random() * 4 + 2;
        this.speedX = Math.cos(angle) * speed;
        this.speedY = type === 'mouse'
            ? Math.sin(angle) * speed
            : -Math.random() * 4 - 2; // Upward bias for typing particles
        
        // Enhanced color system
        const hueRange = type === 'mouse' ? [180, 240] : [260, 320];
        const hue = Math.random() * (hueRange[1] - hueRange[0]) + hueRange[0];
        const saturation = 90 + Math.random() * 10;
        const lightness = 60 + Math.random() * 20;
        this.color = this.hslToRgb(hue, saturation, lightness);
        
        // Enhanced particle physics properties
        this.life = 150;
        this.originalLife = 150;
        this.decay = type === 'mouse' ? 0.5 : 1.0;
        this.gravity = type === 'typing' ? 0.08 : 0.02;
        this.friction = 0.98;
        this.wobble = Math.random() * Math.PI * 2;
        this.wobbleSpeed = type === 'typing' ? 0.15 : 0.05;
        this.wobbleRange = type === 'typing' ? 2 : 0.5;
        
        // New properties for enhanced effects
        this.spin = Math.random() * Math.PI * 2;
        this.spinSpeed = (Math.random() - 0.5) * 0.2;
        this.opacity = 1;
        this.fadeOutStart = 0.3; // Start fading when life is at 30%
    }

    hslToRgb(h, s, l) {
        h /= 360;
        s /= 100;
        l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };

            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }

        return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)})`;
    }

    update() {
        // Update physics
        this.speedY += this.gravity;
        this.speedX *= this.friction;
        this.speedY *= this.friction;
        
        // Update position with wobble effect
        this.wobble += this.wobbleSpeed;
        const wobbleOffset = Math.sin(this.wobble) * this.wobbleRange;
        this.x += this.speedX + wobbleOffset;
        this.y += this.speedY;
        
        // Update spin
        this.spin += this.spinSpeed;
        
        // Update life and size with smooth transitions
        this.life -= this.decay;
        const lifeRatio = this.life / this.originalLife;
        
        // Enhanced size animation
        if (lifeRatio > 0.8) {
            // Initial pop effect
            this.size = this.baseSize * (1 + Math.sin((1 - lifeRatio) * Math.PI) * 0.5);
        } else {
            // Gradual shrink
            this.size = this.baseSize * lifeRatio;
        }
        
        // Update opacity with smooth fade out
        if (lifeRatio < this.fadeOutStart) {
            this.opacity = lifeRatio / this.fadeOutStart;
        }
        
        // Bounce off edges with energy loss
        const margin = this.size;
        if (this.x < margin || this.x > window.innerWidth - margin) {
            this.speedX *= -0.6;
            this.x = this.x < margin ? margin : window.innerWidth - margin;
        }
        if (this.y < margin || this.y > window.innerHeight - margin) {
            this.speedY *= -0.6;
            this.y = this.y < margin ? margin : window.innerHeight - margin;
        }
    }

    draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = this.color;
        ctx.strokeStyle = this.color;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.spin);
        
        if (this.type === 'typing') {
            // Enhanced star shape for typing particles
            const spikes = 4;
            const outerRadius = this.size;
            const innerRadius = this.size * 0.4;
            
            ctx.beginPath();
            for (let i = 0; i < spikes * 2; i++) {
                const radius = i % 2 === 0 ? outerRadius : innerRadius;
                const angle = (i * Math.PI) / spikes;
                const x = Math.cos(angle) * radius;
                const y = Math.sin(angle) * radius;
                
                if (i === 0) ctx.moveTo(x, y);
                else ctx.lineTo(x, y);
            }
            ctx.closePath();
            ctx.fill();
        } else {
            // Enhanced square for mouse particles
            const halfSize = this.size / 2;
            ctx.beginPath();
            ctx.moveTo(-halfSize, -halfSize);
            ctx.lineTo(halfSize, -halfSize);
            ctx.lineTo(halfSize, halfSize);
            ctx.lineTo(-halfSize, halfSize);
            ctx.closePath();
            ctx.fill();
        }
        
        ctx.restore();
    }

    isDead() {
        return this.life <= 0 || this.size <= 0;
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d', { alpha: true });
        this.particles = [];
        this.maxParticles = 200;
        this.lastTime = 0;
        this.init();
    }

    init() {
        document.body.appendChild(this.canvas);
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '9999';
        
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        this.resizeCanvas();
        this.animate();
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }
    getCursorPosition(element) {
        if (!element) return null;
        
        if (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement) {
            const rect = element.getBoundingClientRect();
            return {
                x: rect.left + Math.min(element.selectionStart, element.value.length) * 8,
                y: rect.top + rect.height / 2
            };
        }
        
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
            const range = selection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            return {
                x: rect.left,
                y: rect.top + rect.height / 2
            };
        }
        
        return null;
    }

    handleKeydown(e) {
        if (e.key.length > 1 && !['Enter', 'Space', 'Backspace'].includes(e.code)) return;

        const pos = this.getCursorPosition(document.activeElement);
        if (!pos) return;

        // Create particle burst
        const burstCount = Math.min(10, this.maxParticles - this.particles.length);
        for (let i = 0; i < burstCount; i++) {
            this.particles.push(new Particle(
                pos.x + (Math.random() - 0.5) * 10,
                pos.y + (Math.random() - 0.5) * 10,
                'typing'
            ));
        }
    }

    animate(timestamp) {
        const deltaTime = timestamp - this.lastTime;
        this.lastTime = timestamp;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles = this.particles.filter(particle => {
            particle.update(deltaTime);
            particle.draw(this.ctx);
            return !particle.isDead();
        });

        requestAnimationFrame((t) => this.animate(t));
    }
}

// Initialize the particle system
const particleSystem = new ParticleSystem();