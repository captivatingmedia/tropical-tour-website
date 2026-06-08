/* ========================================
   TOUR PAGE - Component Loader & Interactions
   ======================================== */

document.addEventListener('DOMContentLoaded', async () => {

    // ---- LOAD SHARED COMPONENTS ----
    const headerEl = document.getElementById('shared-header');
    const footerEl = document.getElementById('shared-footer');

    if (headerEl) {
        const res = await fetch('../components/header.html');
        headerEl.innerHTML = await res.text();
    }
    if (footerEl) {
        const res = await fetch('../components/footer.html');
        footerEl.innerHTML = await res.text();
    }

    // ---- MOBILE MENU (after header loads) ----
    setTimeout(() => {
        const menuBtn = document.getElementById('navMenuBtn');
        const navLinks = document.getElementById('navLinks');
        if (menuBtn && navLinks) {
            menuBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });
            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => navLinks.classList.remove('active'));
            });
        }
    }, 100);

    // ---- LANGUAGE TOGGLE ----
    let currentLang = 'es';
    setTimeout(() => {
        const langBtn = document.getElementById('langToggle');
        if (langBtn) {
            const langCycle = ['es', 'en', 'pt'];
            const langLabels = {
                es: '<span class="lang-flag">🇺🇸</span> EN',
                en: '<span class="lang-flag">🇧🇷</span> PT',
                pt: '<span class="lang-flag">🇪🇸</span> ES'
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
                    } else {
                        el.textContent = text;
                    }
                });
            });
        }
    }, 100);

    // ---- GALLERY VIDEOS: play on hover ----
    document.querySelectorAll('.gallery-video').forEach(item => {
        const video = item.querySelector('video');
        if (!video) return;
        item.addEventListener('mouseenter', () => {
            video.play().catch(() => {});
            item.classList.add('playing');
        });
        item.addEventListener('mouseleave', () => {
            video.pause();
            item.classList.remove('playing');
        });
    });

    // ---- FADE-IN ANIMATIONS ----
    const fadeEls = document.querySelectorAll('.fade-up');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    fadeEls.forEach(el => observer.observe(el));

    // ---- BOOKING FORM ----
    const form = document.getElementById('tourBookingForm');
    const dateInput = document.getElementById('tourDate');

    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const tourName = form.dataset.tourName || 'Tour';
            const name = document.getElementById('tourName').value;
            const guests = document.getElementById('tourGuests').value;
            const date = document.getElementById('tourDate').value;

            let waMsg;
            if (currentLang === 'en') {
                waMsg = `Hello! I'd like to book:\n\n*Tour:* ${tourName}\n*Name:* ${name}\n*Guests:* ${guests}\n*Date:* ${date}`;
            } else if (currentLang === 'pt') {
                waMsg = `Olá! Gostaria de reservar:\n\n*Passeio:* ${tourName}\n*Nome:* ${name}\n*Hóspedes:* ${guests}\n*Data:* ${date}`;
            } else {
                waMsg = `Hola! Quiero reservar:\n\n*Tour:* ${tourName}\n*Nombre:* ${name}\n*Personas:* ${guests}\n*Fecha:* ${date}`;
            }

            window.open(`https://wa.me/573013493902?text=${encodeURIComponent(waMsg)}`, '_blank');
        });
    }
});
