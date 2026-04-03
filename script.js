// ==================== Theme Toggle ====================
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;

// Load saved theme or default to dark
const savedTheme = localStorage.getItem('theme') || 'dark';
html.setAttribute('data-theme', savedTheme);

themeToggle.addEventListener('click', () => {
    const current = html.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
});

// ==================== Navbar ====================
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
});

// Close mobile nav on link click
navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('open');
    });
});

// ==================== Active Nav on Scroll ====================
const sections = document.querySelectorAll('section[id]');
function updateActiveNav() {
    const scrollY = window.scrollY + 100;
    sections.forEach(section => {
        const top = section.offsetTop;
        const height = section.offsetHeight;
        const id = section.getAttribute('id');
        const link = document.querySelector(`.nav-links a[href="#${id}"]`);
        if (link) {
            link.classList.toggle('active', scrollY >= top && scrollY < top + height);
        }
    });
}
window.addEventListener('scroll', updateActiveNav);

// ==================== Scroll Animations ====================
const animatedElements = document.querySelectorAll(
    '.highlight-card, .timeline-item, .project-card, .skill-category, .edu-card, .cert-list, .contact-card, .contact-form, .blog-card, .about-text, .about-highlights'
);

animatedElements.forEach((el, i) => {
    el.classList.add('fade-in');
    el.style.transitionDelay = `${(i % 4) * 0.1}s`;
});

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

animatedElements.forEach(el => observer.observe(el));

// Section titles
document.querySelectorAll('.section-title').forEach(title => {
    title.classList.add('fade-in');
    observer.observe(title);
});

// ==================== Skill Bar Animation ====================
const skillBars = document.querySelectorAll('.skill-fill');
const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const bar = entry.target;
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
            skillObserver.unobserve(bar);
        }
    });
}, { threshold: 0.3 });

skillBars.forEach(bar => skillObserver.observe(bar));

// ==================== Counter Animation ====================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-count'));
        const duration = 1500;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(target * eased);

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                counter.textContent = target;
            }
        }

        requestAnimationFrame(update);
    });
}

// Trigger counter animation when hero is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) heroObserver.observe(heroStats);

// ==================== Contact Form ====================
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('.btn-submit');
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>Sending...</span>';
        btn.disabled = true;

        try {
            const formData = new FormData(contactForm);
            const response = await fetch('/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams(formData).toString(),
            });

            if (response.ok) {
                btn.innerHTML = '<span>Message Sent!</span> &#10003;';
                btn.style.background = '#10b981';
                contactForm.reset();
                setTimeout(() => {
                    btn.innerHTML = originalHTML;
                    btn.style.background = '';
                    btn.disabled = false;
                }, 3000);
            } else {
                throw new Error('Failed');
            }
        } catch {
            btn.innerHTML = '<span>Failed — try email</span>';
            btn.style.background = '#ef4444';
            setTimeout(() => {
                btn.innerHTML = originalHTML;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    });
}
