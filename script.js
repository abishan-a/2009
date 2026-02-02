/* Nowrin Labs Script */

document.addEventListener('DOMContentLoaded', () => {

    // --- Lenis Smooth Scroll (Enhanced) ---
    const lenis = new Lenis({
        duration: 1.8, // Slower, heavier feel
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: 0.8, // Less sensitive for weight
        smoothTouch: false,
        touchMultiplier: 2,
    });

    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);


    // --- Typewriter Effect ---
    const typeWriterElement = document.getElementById('typewriter-text');
    const textToType = "Digital Reality.";
    const typingSpeed = 100; // ms per char
    const startDelay = 500; // ms before start

    if (typeWriterElement) {
        let charIndex = 0;
        setTimeout(() => {
            const typeInterval = setInterval(() => {
                if (charIndex < textToType.length) {
                    typeWriterElement.textContent += textToType.charAt(charIndex);
                    charIndex++;
                } else {
                    clearInterval(typeInterval);
                    // Remove cursor after typing
                    const cursor = document.querySelector('.cursor-blink');
                    if (cursor) cursor.style.display = 'none';
                }
            }, typingSpeed);
        }, startDelay);
    }


    // --- Staggered Scroll Observer ---
    const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                // Add visible class
                target.classList.add('visible');
                staggerObserver.unobserve(target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' // Trigger slightly before bottom
    });

    document.querySelectorAll('.stagger-item').forEach((item, index) => {
        staggerObserver.observe(item);
    });

    // Keep existing fade-in for non-stagger items
    const simpleObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                simpleObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => simpleObserver.observe(el));


    // --- Stats Counter ---
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counters = entry.target.querySelectorAll('.counter');
                counters.forEach(counter => {
                    const target = +counter.getAttribute('data-target');
                    const duration = 2500; // Slower for premium feel
                    const frameDuration = 1000 / 60;
                    const totalFrames = Math.round(duration / frameDuration);
                    const increment = target / totalFrames;

                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            counter.innerText = Math.ceil(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            counter.innerText = target;
                        }
                    };
                    updateCounter();
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const statsSection = document.querySelector('.stats');
    if (statsSection) statsObserver.observe(statsSection);


    // --- FAQ Accordion ---
    const accordions = document.querySelectorAll('.accordion-header');
    accordions.forEach(acc => {
        acc.addEventListener('click', () => {
            const item = acc.parentElement;
            const content = acc.nextElementSibling;

            // Close others
            document.querySelectorAll('.accordion-item').forEach(other => {
                if (other !== item && other.classList.contains('active')) {
                    other.classList.remove('active');
                    other.querySelector('.accordion-content').style.maxHeight = null;
                }
            });

            item.classList.toggle('active');
            if (item.classList.contains('active')) {
                content.style.maxHeight = content.scrollHeight + "px";
            } else {
                content.style.maxHeight = null;
            }
        });
    });

    // --- Mobile Menu ---
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            const isActive = navLinks.classList.toggle('active');
            const lines = mobileBtn.querySelectorAll('.line');
            if (isActive) {
                lines[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                lines[1].style.transform = 'rotate(-45deg) translate(5px, -5px)';
            } else {
                lines[0].style.transform = 'none';
                lines[1].style.transform = 'none';
            }
        });
    }

    // --- Smooth Anchor Scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                // Close mobile menu if open
                if (navLinks.classList.contains('active')) mobileBtn.click();

                lenis.scrollTo(target); // Use Lenis for anchor scroll!
            }
        });
    });


    // --- Custom Cursor ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline && window.matchMedia("(min-width: 1025px)").matches) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            cursorDot.style.left = `${posX}px`;
            cursorDot.style.top = `${posY}px`;

            // Make outlines "drag" behind more enhancing fluid feel
            cursorOutline.animate({
                left: `${posX}px`,
                top: `${posY}px`
            }, { duration: 800, fill: "forwards" }); // Increased duration
        });

        // Interactive States
        document.querySelectorAll('a, button, input, .bento-card').forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
        });
    }

    // Theme Toggle Logic...
    const themeToggle = document.querySelector('.theme-toggle');
    const iconSun = document.querySelector('.icon-sun');
    const iconMoon = document.querySelector('.icon-moon');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'light') {
        document.body.classList.add('light-mode');
        if (iconSun) iconSun.style.display = 'none';
        if (iconMoon) iconMoon.style.display = 'block';
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isLight = document.body.classList.toggle('light-mode');
            if (isLight) {
                if (iconSun) iconSun.style.display = 'none';
                if (iconMoon) iconMoon.style.display = 'block';
                localStorage.setItem('theme', 'light');
            } else {
                if (iconSun) iconSun.style.display = 'block';
                if (iconMoon) iconMoon.style.display = 'none';
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // --- Testimonial Carousel ---
    const slides = document.querySelectorAll('.testimonial-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    let currentSlide = 0;

    function showSlide(index) {
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));

        currentSlide = index;
        if (currentSlide >= slides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = slides.length - 1;

        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    if (slides.length > 0) {
        if (nextBtn) nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
        if (prevBtn) prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));

        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => showSlide(index));
        });

        // Auto play (optional)
        setInterval(() => {
            showSlide(currentSlide + 1);
        }, 5000);
    }

});
