// ARCH-COMP Website JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Smooth scrolling for in-page navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
        link.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offsetTop = target.offsetTop - 100; // account for header height
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            }
        });
    });

    // Subtle header background shift once scrolled
    const header = document.querySelector('.header');
    window.addEventListener('scroll', function () {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        if (scrollTop > 100) {
            header.style.background = 'rgba(37, 99, 235, 0.95)';
            header.style.backdropFilter = 'blur(10px)';
        } else {
            header.style.background = 'linear-gradient(135deg, #2563eb 0%, #0d9488 100%)';
            header.style.backdropFilter = 'none';
        }
    });

    // Reveal timeline items and cards on scroll
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const revealObserver = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.timeline-item').forEach(item => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(item);
    });

    document.querySelectorAll('.repo-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s`;
        revealObserver.observe(card);
    });

    // Keyboard shortcuts: h = top, c = categories, r = repositories
    document.addEventListener('keydown', function (e) {
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        const tag = (e.target.tagName || '').toLowerCase();
        if (tag === 'input' || tag === 'textarea') return;
        if (e.key === 'h') window.scrollTo({ top: 0, behavior: 'smooth' });
        if (e.key === 'c') document.querySelector('#categories')?.scrollIntoView({ behavior: 'smooth' });
        if (e.key === 'r') document.querySelector('#repositories')?.scrollIntoView({ behavior: 'smooth' });
    });
});

// Copy the BibTeX block to the clipboard
function copyBibtex() {
    const bibtexContent = document.getElementById('bibtex-content').textContent;
    const done = (btn) => {
        const original = btn.textContent;
        btn.textContent = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = original; btn.classList.remove('copied'); }, 2000);
    };
    const btn = document.querySelector('.copy-bibtex-btn');
    navigator.clipboard.writeText(bibtexContent).then(() => done(btn)).catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = bibtexContent;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        done(btn);
    });
}
