# ARCH website

Source for <https://arch-comp.github.io/>: the ARCH workshop (Applied Verification for Continuous and Hybrid
Systems, since 2014) and its friendly competition ARCH-COMP (since 2017). Plain HTML/CSS/JS, no build step;
preview by opening `index.html` or running `python -m http.server`.

## Layout
- `index.html` — home; all other pages are in `pages/`
- `js/edition.js` — facts of the upcoming edition (the only place they are written)
- `js/layout.js` — header menu and footer of every page; `js/script.js` — interactions; `css/styles.css`
- `files/` — papers, models, attachments (Git LFS; link them as
  `https://media.githubusercontent.com/media/ARCH-COMP/arch-comp.github.io/main/files/...`,
  since GitHub Pages serves only the LFS pointer)
- `pages/news.html` — old news, kept for the record but not linked

## Starting a new edition
1. Archive the finished edition:
   - move its program section from `pages/program.html` to the top of `pages/archive.html`,
     replacing the `data-ed` placeholders in its heading with plain text
   - add its proceedings and repeatability links as a row in `pages/proceedings.html`
   - put its files in `files/<year>/` and list them in `pages/files.html`
     (and in Benchmarks / Tool Presentations / Experience Reports where they belong)
2. Set up the new one:
   - update `js/edition.js` (year, edition numbers, date, deadlines, links); home, calls, program, and menu follow
   - reset `pages/program.html` to the "will be announced" line
   - update organizers and program committee in `pages/call-for-submissions.html` and category leads in
     `index.html`, if they changed
