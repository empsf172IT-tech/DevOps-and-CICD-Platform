document.addEventListener('DOMContentLoaded', () => {
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('nav-scrolled');
            navbar.classList.remove('py-6');
            navbar.classList.add('py-4');
        } else {
            navbar.classList.remove('nav-scrolled');
            navbar.classList.add('py-6');
            navbar.classList.remove('py-4');
        }
    });

    // Theme Toggle
    const themeToggle = document.getElementById('themeToggle');
    const themeToggleMobile = document.getElementById('themeToggleMobile');
    const html = document.documentElement;
    const darkIcons = document.querySelectorAll('.dark-icon');
    const lightIcons = document.querySelectorAll('.light-icon');

    // Check saved theme
    if (localStorage.getItem('theme') === 'light') {
        html.classList.add('light');
        updateIcons(false);
    } else {
        html.classList.remove('light');
        updateIcons(true);
    }

    function updateIcons(isDark) {
        if (isDark) {
            darkIcons.forEach(icon => icon.classList.add('hidden'));
            lightIcons.forEach(icon => icon.classList.remove('hidden'));
        } else {
            darkIcons.forEach(icon => icon.classList.remove('hidden'));
            lightIcons.forEach(icon => icon.classList.add('hidden'));
        }
    }

    function toggleTheme() {
        if (html.classList.contains('light')) {
            html.classList.remove('light');
            localStorage.setItem('theme', 'dark');
            updateIcons(true);
        } else {
            html.classList.add('light');
            localStorage.setItem('theme', 'light');
            updateIcons(false);
        }
    }

    themeToggle.addEventListener('click', toggleTheme);
    if(themeToggleMobile) {
        themeToggleMobile.addEventListener('click', toggleTheme);
    }

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
        mobileMenu.classList.toggle('flex');
    });

    // Number Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // lower is faster

    const startCounters = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const updateCount = () => {
                    const target = +counter.getAttribute('data-target');
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        // Allow floats for things like 99.99
                        if(target % 1 !== 0) {
                            counter.innerText = (count + inc).toFixed(2);
                        } else {
                            counter.innerText = Math.ceil(count + inc);
                        }
                        setTimeout(updateCount, 10);
                    } else {
                        counter.innerText = target;
                    }
                };
                updateCount();
                observer.unobserve(counter);
            }
        });
    };

    const observer = new IntersectionObserver(startCounters, {
        threshold: 0.5
    });

    counters.forEach(counter => {
        observer.observe(counter);
    });

    // Network Canvas Background (Hero)
    const canvas = document.createElement('canvas');
    canvas.className = 'absolute inset-0 w-full h-full';
    document.getElementById('networkCanvas').appendChild(canvas);
    const ctx = canvas.getContext('2d');
    
    let width, height;
    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    const particles = [];
    for(let i = 0; i < 50; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5
        });
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        ctx.fillStyle = html.classList.contains('light') ? '#000' : '#D9DEE7';
        ctx.strokeStyle = html.classList.contains('light') ? 'rgba(0,0,0,0.05)' : 'rgba(217, 222, 231, 0.05)';
        
        particles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            if(p.x < 0 || p.x > width) p.vx *= -1;
            if(p.y < 0 || p.y > height) p.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(p.x, p.y, 1.5, 0, Math.PI * 2);
            ctx.fill();

            particles.forEach(p2 => {
                const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
                if(dist < 150) {
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            });
        });
        requestAnimationFrame(draw);
    }
    draw();

    // Back to Top Button
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('opacity-0', 'translate-y-10', 'pointer-events-none');
                backToTopBtn.classList.add('opacity-100', 'translate-y-0');
            } else {
                backToTopBtn.classList.add('opacity-0', 'translate-y-10', 'pointer-events-none');
                backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // Active Navigation Highlighter (Scroll Spy)
    const sections = document.querySelectorAll('section[id]');
    
    function highlightNav() {
        let scrollY = window.scrollY;
        
        sections.forEach(current => {
            const sectionHeight = current.offsetHeight;
            // Add a little offset so it highlights slightly before it reaches the exact top
            const sectionTop = current.offsetTop - 200; 
            const sectionId = current.getAttribute('id');
            
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                document.querySelectorAll('.nav-item[href*=' + sectionId + ']').forEach(link => {
                    link.classList.add('active-link');
                });
            } else {
                document.querySelectorAll('.nav-item[href*=' + sectionId + ']').forEach(link => {
                    link.classList.remove('active-link');
                });
            }
        });
    }

    window.addEventListener('scroll', highlightNav);
    highlightNav(); // Call once on load
});
