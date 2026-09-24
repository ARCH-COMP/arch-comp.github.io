// Shared page chrome and edition data binding. Loaded in <head> after edition.js, so each page can draw its
// header and footer synchronously (ARCH.header() / ARCH.footer()) where they belong, without a flash.
(function () {
    const E = window.ARCH_EDITION;
    // Links are written relative to the site root (this script lives in <root>/js/), so they work from index.html
    // and from pages/, on any host or path.
    const ROOT = new URL('..', document.currentScript.src).href;
    const url = path => new URL(path, ROOT).href;
    const current = location.href.split(/[?#]/)[0].replace(/[/]$/, '/index.html');

    // ---- edition values -------------------------------------------------------------------------------

    const ordinal = n => n + ({ 1: 'st', 2: 'nd', 3: 'rd' }[(n % 100 >= 11 && n % 100 <= 13) ? 0 : n % 10] || 'th');
    const FORMATS = {
        long: { month: 'long', day: 'numeric', year: 'numeric' },
        md: { month: 'long', day: 'numeric' },
        weekday: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' },
    };
    // Noon UTC keeps the calendar day stable in every visitor's time zone.
    const formatDate = (iso, fmt) =>
        new Date(iso + 'T12:00:00Z').toLocaleDateString('en-US', { ...FORMATS[fmt || 'long'], timeZone: 'UTC' });

    const computed = {
        label: 'ARCH ' + E.year,
        workshopOrdinal: ordinal(E.workshopNo),
        competitionOrdinal: ordinal(E.competitionNo),
        pastWorkshops: E.workshopNo - 1,
        pastCompetitions: E.competitionNo - 1,
        lastYear: E.year - 1,
        meetingUrlText: E.meetingUrl.replace(/^https?:\/\//, ''),
    };
    const HREFS = {
        easychair: 'https://easychair.org/conferences/?conf=' + E.easychair,
        competitionEmail: 'mailto:' + E.competitionEmail,
        meetingUrl: E.meetingUrl,
    };

    function value(path, fmt) {
        const v = path in computed ? computed[path] : path.split('.').reduce((o, k) => (o == null ? o : o[k]), E);
        if (v == null) throw new Error('edition.js has no value for "' + path + '"');
        return /^\d{4}-\d{2}-\d{2}$/.test(v) ? formatDate(v, fmt) : String(v);
    }

    function bind(root) {
        root.querySelectorAll('[data-ed]').forEach(el => { el.textContent = value(el.dataset.ed, el.dataset.fmt); });
        root.querySelectorAll('[data-ed-href]').forEach(el => { el.href = HREFS[el.dataset.edHref]; });
    }

    // ---- header and footer ----------------------------------------------------------------------------

    const NAV = [
        ['index.html', 'Home'],
        [computed.label, [
            ['pages/call-for-submissions.html', 'Call for Submissions'],
            ['pages/participate.html', 'Call for Participation'],
            ['pages/program.html', 'Program'],
        ], ['pages/submission-instructions.html']],
        ['Past Editions', [
            ['pages/benchmarks.html', 'Benchmarks'],
            ['pages/tool-presentations.html', 'Tool Presentations'],
            ['pages/experience-reports.html', 'Experience Reports'],
            ['pages/proceedings.html', 'Proceedings'],
            ['pages/archive.html', 'Archive'],
        ]],
    ];
    const FOOTER = [
        ['index.html#about', 'About'], ['index.html#categories', 'Categories'], ['index.html#organizers', 'Organizers'],
        ['pages/submission-instructions.html', 'Submission Instructions'], ['pages/files.html', 'Files'],
    ];

    // Inserts markup right where the calling <script> sits, while the page is still being parsed.
    const here = html => document.currentScript.insertAdjacentHTML('beforebegin', html);

    const isCurrent = path => url(path) === current;
    const link = (path, text) => `<li><a href="${url(path)}"${isCurrent(path) ? ' aria-current="page"' : ''}>${text}</a></li>`;

    function nav() {
        return NAV.map(([key, items, alsoCurrent], i) => {
            if (!Array.isArray(items)) return link(key, items);
            const active = items.map(([f]) => f).concat(alsoCurrent || []).some(isCurrent);
            const id = 'nav-group-' + i;
            return `<li class="nav-group">
                <button type="button" class="nav-group-toggle${active ? ' is-current' : ''}" aria-expanded="false" aria-controls="${id}">${key}</button>
                <ul class="nav-sub" id="${id}">${items.map(([f, t]) => link(f, t)).join('')}</ul>
            </li>`;
        }).join('');
    }

    function header() {
        here(`<header class="header">
        <div class="container">
            <div class="header-content">
                <a href="${url('index.html')}" class="logo" aria-label="ARCH home">
                    <img src="${url('images/logo-white.svg')}" alt="ARCH" class="logo-img" width="300" height="100">
                    <span class="logo-word">ARCH-COMP</span>
                </a>
                <p class="tagline">Applied Verification of Continuous and Hybrid Systems</p>
            </div>
            <nav class="nav" aria-label="Primary"><ul class="nav-list">${nav()}</ul></nav>
        </div>
    </header>`);
    }

    function footer() {
        here(`<footer class="footer">
        <div class="container">
            <div class="footer-content">
                <div class="footer-info">
                    <h3>ARCH-COMP</h3>
                    <p>Applied Verification of Continuous and Hybrid Systems</p>
                </div>
                <nav class="footer-links" aria-label="Footer">
                    ${FOOTER.map(([f, t]) => `<a href="${url(f)}">${t}</a>`).join('\n')}
                    <a href="https://github.com/ARCH-COMP" target="_blank" rel="noopener">GitHub</a>
                </nav>
            </div>
            <div class="footer-bottom">
                <p>&copy; ${new Date().getFullYear()} ARCH-COMP. Content licensed under the MIT License.</p>
            </div>
        </div>
    </footer>`);
        // The footer comes last, so every data-ed element of the page exists by now.
        bind(document);
    }

    // Structured data for search engines, describing the upcoming workshop and its competition.
    function eventJsonLd() {
        const s = document.createElement('script');
        s.type = 'application/ld+json';
        s.textContent = JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Event',
            name: `ARCH ${E.year} - ${ordinal(E.workshopNo)} International Workshop on Applied Verification for Continuous and Hybrid Systems`,
            startDate: E.date,
            eventAttendanceMode: 'https://schema.org/OnlineEventAttendanceMode',
            eventStatus: 'https://schema.org/EventScheduled',
            url: 'https://arch-comp.github.io/pages/call-for-submissions.html',
            location: { '@type': 'VirtualLocation', url: E.meetingUrl },
            organizer: { '@id': 'https://arch-comp.github.io/#organization' },
            subEvent: {
                '@type': 'Event',
                name: `ARCH-COMP ${E.year} - ${ordinal(E.competitionNo)} International Competition on Verifying Continuous and Hybrid Systems`,
                startDate: E.date,
                url: 'https://arch-comp.github.io/pages/participate.html',
            },
        });
        document.head.appendChild(s);
    }

    window.ARCH = { header, footer, eventJsonLd };
})();
