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

    // Nav dropdowns: click/Enter toggles, Escape or leaving the group closes (hover opens via CSS)
    const groups = document.querySelectorAll('.nav-group');
    const setOpen = (group, open) => {
        group.classList.toggle('open', open);
        group.querySelector('.nav-group-toggle').setAttribute('aria-expanded', String(open));
    };
    groups.forEach(group => {
        const toggle = group.querySelector('.nav-group-toggle');
        toggle.addEventListener('click', () => {
            const open = !group.classList.contains('open');
            groups.forEach(g => setOpen(g, false));
            setOpen(group, open);
        });
        group.addEventListener('focusout', e => { if (!group.contains(e.relatedTarget)) setOpen(group, false); });
        group.addEventListener('keydown', e => {
            if (e.key === 'Escape' && group.classList.contains('open')) { setOpen(group, false); toggle.focus(); }
        });
    });
    document.addEventListener('click', e => {
        groups.forEach(g => { if (!g.contains(e.target)) setOpen(g, false); });
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
