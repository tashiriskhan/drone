// Initialize error monitoring
import './monitoring.js';

const navbar = document.getElementById('navbar');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const mobileMenu = document.getElementById('mobileMenu');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('nav-scrolled');
        navbar.classList.remove('py-6');
        navbar.classList.add('py-4');
    } else {
        navbar.classList.remove('nav-scrolled');
        navbar.classList.remove('py-4');
        navbar.classList.add('py-6');
    }
});

const slider = document.getElementById('productSlider');
const scrollLeftBtn = document.getElementById('scrollLeft');
const scrollRightBtn = document.getElementById('scrollRight');

if (slider && scrollLeftBtn && scrollRightBtn) {
    scrollLeftBtn.addEventListener('click', () => {
        slider.scrollBy({ left: -320, behavior: 'smooth' });
    });

    scrollRightBtn.addEventListener('click', () => {
        slider.scrollBy({ left: 320, behavior: 'smooth' });
    });
}

if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
    });
}
