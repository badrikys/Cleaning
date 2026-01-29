/**
 * Aura Cleaning - Main JavaScript
 * Handles UI interactions: header, accordion, modal, animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize all modules
    Header.init();
    Accordion.init();
    Modal.init();
    SmoothScroll.init();
    Animations.init();
    MobileMenu.init();
});

/**
 * Header Module
 * Handles sticky header with blur effect on scroll
 */
const Header = {
    header: null,
    scrollThreshold: 50,

    init() {
        this.header = document.querySelector('.header');
        if (!this.header) return;

        window.addEventListener('scroll', () => this.onScroll());
        this.onScroll(); // Check initial state
    },

    onScroll() {
        if (window.scrollY > this.scrollThreshold) {
            this.header.classList.add('header--scrolled');
        } else {
            this.header.classList.remove('header--scrolled');
        }
    }
};

/**
 * Accordion Module
 * Handles expandable sections (FAQ, Checklist)
 */
const Accordion = {
    init() {
        const accordionItems = document.querySelectorAll('.accordion__item');

        accordionItems.forEach(item => {
            const header = item.querySelector('.accordion__header');
            const content = item.querySelector('.accordion__content');

            if (!header || !content) return;

            header.addEventListener('click', () => {
                const isActive = item.classList.contains('active');

                // Close all items in the same accordion
                const parent = item.closest('.accordion');
                if (parent) {
                    parent.querySelectorAll('.accordion__item').forEach(i => {
                        i.classList.remove('active');
                        const c = i.querySelector('.accordion__content');
                        if (c) c.style.maxHeight = null;
                    });
                }

                // Toggle current item
                if (!isActive) {
                    item.classList.add('active');
                    content.style.maxHeight = content.scrollHeight + 'px';
                }
            });
        });

        // Open first item by default if exists
        const firstItem = document.querySelector('.accordion__item');
        if (firstItem) {
            firstItem.classList.add('active');
            const content = firstItem.querySelector('.accordion__content');
            if (content) {
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        }
    }
};

/**
 * Modal Module
 * Handles modal window for lead form
 */
const Modal = {
    modal: null,
    form: null,

    init() {
        this.modal = document.getElementById('modal');
        this.form = document.getElementById('lead-form');

        if (!this.modal) return;

        // Open modal triggers
        document.querySelectorAll('[data-modal-open]').forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.open();
            });
        });

        // Close modal triggers
        document.querySelectorAll('[data-modal-close]').forEach(trigger => {
            trigger.addEventListener('click', () => this.close());
        });

        // Close on backdrop click
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.close();
            }
        });

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                this.close();
            }
        });

        // Form submission
        if (this.form) {
            this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        }
    },

    open() {
        if (!this.modal) return;
        this.modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },

    close() {
        if (!this.modal) return;
        this.modal.classList.remove('active');
        document.body.style.overflow = '';
    },

    handleSubmit(e) {
        e.preventDefault();

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        // Validate
        if (!data.name || !data.phone) {
            alert('Пожалуйста, заполните все поля');
            return;
        }

        // Show success state
        this.showSuccess();

        // In production, send to backend/webhook here
        console.log('Form submitted:', data);
    },

    showSuccess() {
        const formContent = this.form.parentElement;
        formContent.innerHTML = `
      <div class="form__success">
        <div class="form__success-icon">✓</div>
        <h3 class="form__success-title">Заявка отправлена!</h3>
        <p class="form__success-text">Мы свяжемся с вами в течение 30 минут</p>
      </div>
    `;

        // Close modal after delay
        setTimeout(() => {
            this.close();
            // Reset form after closing
            setTimeout(() => {
                location.reload();
            }, 300);
        }, 2500);
    }
};

/**
 * Smooth Scroll Module
 * Handles smooth scrolling for anchor links
 */
const SmoothScroll = {
    init() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const href = anchor.getAttribute('href');
                if (href === '#') return;

                const target = document.querySelector(href);
                if (!target) return;

                e.preventDefault();

                const headerHeight = document.querySelector('.header')?.offsetHeight || 0;
                const targetPosition = target.getBoundingClientRect().top + window.scrollY - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            });
        });
    }
};

/**
 * Animations Module
 * Handles fade-in animations on scroll using Intersection Observer
 */
const Animations = {
    init() {
        const elements = document.querySelectorAll('.fade-in');

        if (!elements.length) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        elements.forEach(el => observer.observe(el));
    }
};

/**
 * Mobile Menu Module (optional enhancement)
 */
const MobileMenu = {
    init() {
        const menuBtn = document.querySelector('.header__menu-btn');
        const nav = document.querySelector('.header__nav');
        const links = nav.querySelectorAll('.header__nav-link');

        if (!menuBtn || !nav) return;

        menuBtn.addEventListener('click', () => {
            nav.classList.toggle('active');
            menuBtn.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu when a link is clicked
        links.forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                menuBtn.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
};
