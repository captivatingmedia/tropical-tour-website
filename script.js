/* ========================================
   TROPICAL TOUR - Main Script
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {

    // ---- HERO VIDEO: AUTOPLAY THEN AUTO-SCROLL ----
    const heroVideo = document.getElementById('heroVideo');
    const heroContent = document.getElementById('heroContent');
    const heroOverlay = document.getElementById('heroOverlay');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const sectionBgs = document.querySelectorAll('.section-header-bg');

    if (heroVideo) {
        let hasAutoScrolled = false;
        let userHasScrolled = false;

        // If user scrolls manually, skip the auto-scroll
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                userHasScrolled = true;
            }
        }, { passive: true });

        // Auto-scroll 1 second before the first play ends (only if user hasn't scrolled)
        heroVideo.addEventListener('timeupdate', () => {
            if (!hasAutoScrolled && !userHasScrolled && heroVideo.duration && heroVideo.currentTime >= heroVideo.duration - 1) {
                hasAutoScrolled = true;
                const target = document.getElementById('tours');
                if (target) {
                    const y = target.getBoundingClientRect().top + window.pageYOffset - 80;
                    window.scrollTo({ top: y, behavior: 'smooth' });
                }
            }
        });

        // Show hero text immediately + trigger fade-up animations
        heroContent.querySelectorAll('.fade-up').forEach(el => el.classList.add('visible'));

        // Attempt autoplay (fallback for mobile)
        heroVideo.play().catch(() => {});
    }

    // ---- PARALLAX for section headers ----
    function handleParallax() {
        sectionBgs.forEach(bg => {
            const speed = parseFloat(bg.dataset.speed) || 0.3;
            const rect = bg.parentElement.getBoundingClientRect();
            const offset = rect.top * speed;
            bg.style.transform = `translate3d(0, ${offset}px, 0)`;
        });
    }

    // ---- NAVBAR SCROLL ----
    const navbar = document.getElementById('navbar');

    function handleNavScroll() {
        navbar.classList.toggle('scrolled', window.pageYOffset > 80);
    }

    // ---- SCROLL LISTENER (throttled) ----
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleParallax();
                handleNavScroll();
                handleFadeIn();
                handleCounters();
                ticking = false;
            });
            ticking = true;
        }
    });

    // ---- FADE-IN ON SCROLL ----
    const fadeEls = document.querySelectorAll('.fade-up');

    function handleFadeIn() {
        fadeEls.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.88) {
                el.classList.add('visible');
            }
        });
    }

    handleFadeIn();

    // ---- NUMBER COUNTERS ----
    const counters = document.querySelectorAll('.stat-number');
    let countersDone = false;

    function handleCounters() {
        if (countersDone) return;
        const section = document.querySelector('.about-strip');
        if (!section) return;
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            countersDone = true;
            counters.forEach(counter => {
                const target = parseInt(counter.dataset.count);
                const duration = 2000;
                const start = performance.now();
                function tick(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    const eased = 1 - Math.pow(1 - progress, 3);
                    counter.textContent = Math.floor(target * eased).toLocaleString();
                    if (progress < 1) requestAnimationFrame(tick);
                }
                requestAnimationFrame(tick);
            });
        }
    }

    // ---- MOBILE MENU ----
    const menuBtn = document.getElementById('navMenuBtn');
    const navLinks = document.getElementById('navLinks');

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuBtn.classList.toggle('active');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            menuBtn.classList.remove('active');
        });
    });

    // ---- CLICKABLE TOUR CARDS ----
    document.querySelectorAll('[data-href]').forEach(card => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', (e) => {
            // Don't navigate if clicking the Reservar button
            const btn = e.target.closest('.btn, .btn-sm');
            if (btn) return;
            e.preventDefault();
            e.stopPropagation();
            window.location.href = card.getAttribute('data-href');
        });
    });

    // ---- SMOOTH SCROLL for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const offset = 80;
                const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top: y, behavior: 'smooth' });
            }
        });
    });

    // ---- LANGUAGE TOGGLE ----
    const langBtn = document.getElementById('langToggle');
    let currentLang = 'es';

    const langCycle = ['es', 'en', 'pt'];
    const langLabels = {
        es: '<span class="lang-flag">🇺🇸</span> EN',
        en: '<span class="lang-flag">🇧🇷</span> PT',
        pt: '<span class="lang-flag">🇪🇸</span> ES'
    };
    const langTitles = {
        es: 'Tour Tropical - Agencia de Viajes | Santa Marta',
        en: 'Tour Tropical - Travel Agency | Santa Marta',
        pt: 'Tour Tropical - Agência de Viagens | Santa Marta'
    };

    langBtn.addEventListener('click', () => {
        const idx = langCycle.indexOf(currentLang);
        currentLang = langCycle[(idx + 1) % langCycle.length];
        document.documentElement.setAttribute('data-lang', currentLang);

        langBtn.innerHTML = langLabels[currentLang];

        document.querySelectorAll('[data-es][data-en]').forEach(el => {
            const text = el.getAttribute(`data-${currentLang}`) || el.getAttribute('data-en');
            if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                el.placeholder = text;
            } else if (el.tagName === 'OPTION') {
                el.textContent = text;
            } else {
                el.textContent = text;
            }
        });

        // Update page title
        document.title = langTitles[currentLang];
    });

    // ---- BOOKING FORM ----
    const form = document.getElementById('bookingForm');
    const dateInput = document.getElementById('date');

    // Set min date to today
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        const guests = document.getElementById('guests').value;
        const tour = document.getElementById('tour');
        const tourName = tour.options[tour.selectedIndex].text;
        const date = document.getElementById('date').value;
        const message = document.getElementById('message').value;

        // Build WhatsApp message
        let waMsg;
        if (currentLang === 'en') {
            waMsg = `Hello! I'd like to book:\n\n*Tour:* ${tourName}\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Guests:* ${guests}\n*Date:* ${date}${message ? '\n*Message:* ' + message : ''}`;
        } else if (currentLang === 'pt') {
            waMsg = `Olá! Gostaria de reservar:\n\n*Passeio:* ${tourName}\n*Nome:* ${name}\n*E-mail:* ${email}\n*Telefone:* ${phone}\n*Hóspedes:* ${guests}\n*Data:* ${date}${message ? '\n*Mensagem:* ' + message : ''}`;
        } else {
            waMsg = `¡Hola! Quiero reservar:\n\n*Tour:* ${tourName}\n*Nombre:* ${name}\n*Email:* ${email}\n*Teléfono:* ${phone}\n*Personas:* ${guests}\n*Fecha:* ${date}${message ? '\n*Mensaje:* ' + message : ''}`;
        }

        const waUrl = `https://wa.me/573013493902?text=${encodeURIComponent(waMsg)}`;

        // Show success state
        const successTitle = { es: '¡Solicitud Enviada!', en: 'Booking Request Sent!', pt: 'Solicitação Enviada!' };
        const successMsg = { es: 'Serás redirigido a WhatsApp para confirmar tu reserva.', en: 'You will be redirected to WhatsApp to confirm your booking.', pt: 'Você será redirecionado ao WhatsApp para confirmar sua reserva.' };
        form.innerHTML = `
            <div class="form-success">
                <div class="checkmark">✓</div>
                <h3>${successTitle[currentLang]}</h3>
                <p>${successMsg[currentLang]}</p>
            </div>
        `;

        setTimeout(() => {
            window.open(waUrl, '_blank');
        }, 1500);
    });

    // ---- INITIAL CALLS ----
    handleNavScroll();
    handleParallax();
});
