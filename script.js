/* --- Core JavaScript for Maheswaran Interactivity --- */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Navigation (No Scroll Effect as per request)
    const navbar = document.getElementById('navbar');
    // Header stays at the top (absolute) and does not follow.

    // 2. Global Event Interceptor (Fixed Redirects & Hydration Issues)
    const formUrl = "https://www.yashtex.com";
    
    document.addEventListener('click', function (e) {
        const btn = e.target.closest('button');
        const link = e.target.closest('a');

        if (btn) {
            const btnText = btn.textContent.replace(/\s+/g, ' ').trim();
            const btnLabel = btn.getAttribute('aria-label');
            
            if (btnLabel === 'Share on instagram') {
                window.open('https://www.instagram.com/maheswaran', '_blank');
            } else if (btnLabel === 'Share on linkedin') {
                window.open('https://www.linkedin.com/in/maheswaran/', '_blank');
            } else if (btnLabel === 'Share on twitter') {
                window.open('https://x.com/maheswaran', '_blank');
            } else if (btnText.includes('Request Quote') || btnText.includes('Book a Call')) {
                e.preventDefault();
                window.open(formUrl, '_blank');
            }
        }

        if (link) {
            const articleText = link.closest('article') ? link.closest('article').textContent.replace(/\s+/g, ' ').trim() : '';
            const linkText = link.textContent.replace(/\s+/g, ' ').trim().toLowerCase();
            const href = link.getAttribute('href');

            // Intercept specific portfolio clicks
            if (articleText.includes('Law Firm Website')) {
                e.preventDefault();
                window.open('https://anujranjanwebsite.vercel.app/', '_blank');
                return;
            }
            if (articleText.includes('SV Construction')) {
                e.preventDefault();
                window.open('https://svconstruction.co.in/', '_blank');
                return;
            }

            // Redirect #contact and standard calls to action
            if (href === '#contact' || href === formUrl || linkText === 'contact' || 
                linkText.includes('request quote') || linkText.includes('book a call')) {
                e.preventDefault();
                window.open(formUrl, '_blank');
            }
        }
    });

    // 3. Ensuring links are updated periodically (Next.js Hydration fix)
    const fixLinks = () => {
        document.querySelectorAll('a[href="' + formUrl + '"]').forEach(a => {
            a.setAttribute('target', '_blank');
        });
    };
    fixLinks();
    setTimeout(fixLinks, 1000);

    // 4. Smooth Reveal on Scroll
    const revealElements = document.querySelectorAll('.reveal-element');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

    revealElements.forEach(el => observer.observe(el));

    // 5. 3D Card Tilt Effect
    const tiltCards = document.querySelectorAll('.tilt-card');
    const maxTilt = 8;

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left; 
            const y = e.clientY - rect.top; 
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const tiltX = -((y - centerY) / centerY) * maxTilt;
            const tiltY = ((x - centerX) / centerX) * maxTilt;
            
            card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02) translateZ(10px)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1) translateZ(0px)`;
            card.style.transition = 'transform 0.5s ease-out';
        });

        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease-out';
        });
    });

    // 6. Hero Canvas Particle Animation
    const canvas = document.getElementById('hero-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        const particleCount = 40;

        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = 1200;
        };

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.reset();
            }

            reset() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 2 + 1;
                this.speedX = (Math.random() - 0.5) * 0.5;
                this.speedY = (Math.random() - 0.5) * 0.5;
                this.opacity = Math.random() * 0.5 + 0.1;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                    this.reset();
                }
            }

            draw() {
                ctx.fillStyle = `rgba(16, 185, 129, ${this.opacity})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        const init = () => {
            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        };

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => {
                p.update();
                p.draw();
            });
            requestAnimationFrame(animate);
        };

        init();
        animate();
    }

    // 7. Back to Top Button
    const backToTop = document.createElement('button');
    backToTop.id = 'back-to-top';
    backToTop.innerHTML = '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m18 15-6-6-6 6"/></svg>';
    document.body.appendChild(backToTop);

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});
