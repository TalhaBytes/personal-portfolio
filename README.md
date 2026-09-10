# Muhammad Talha Khan | TalhaBytes

Responsive, multi-page personal portfolio using HTML, CSS and vanilla JavaScript. The original navy/indigo/amber design, light/dark themes, animations, search and project filters are retained.

## Included

- Home, experience/projects, skills, education and contact pages.
- DevPulse with its [public source](https://github.com/TalhaBytes/devpulse).
- Stock Price Prediction, Trivia Quiz and Personal Portfolio descriptions; unpublished projects have no repository buttons.
- Email, LinkedIn, GitHub and the updated public resume in `assets/Muhammad-Talha-Khan-Resume.pdf`.
- TB icons, social preview, page-specific metadata, custom 404 and `.nojekyll`.

## Run locally

From this folder run `python -m http.server 8000 --bind 127.0.0.1`, then open http://127.0.0.1:8000/. No build or package installation is needed. Google Fonts and Font Awesome use external CDNs; text falls back to system fonts if unavailable.

## Publish with GitHub Pages

1. Create a public repository named `Personal-Portfolio` under `TalhaBytes`.
2. Extract this ZIP and put its contents at the repository root: `index.html` must sit beside `README.md`, not inside another portfolio folder. Include `.nojekyll` and `.gitignore`.
3. Commit and push the files to `main`.
4. Open Settings > Pages. Select **Deploy from a branch**, **main**, **/(root)** and Save.
5. Wait for the Pages deployment to finish, then use the URL shown in Settings > Pages. The configured URL is `https://talhabytes.github.io/Personal-Portfolio/`.
6. Open each page, download the resume and check an invalid nested URL to verify the 404.

Official guide: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site

### Using a different repository name or a user site

All normal navigation and assets are relative and support project subpaths. Before publishing at another URL, replace `https://talhabytes.github.io/Personal-Portfolio/` in HTML metadata with your actual base URL (keep its trailing slash). In `404.html`, change both `/Personal-Portfolio/` occurrences to the new repository path; for `TalhaBytes.github.io`, use `/`. Absolute metadata is intentional for social crawlers. No custom domain is configured.

## Contact and maintenance

The form opens the visitor's email application with a draft. It does not send mail from a server; the visitor must send the draft. Email, LinkedIn and GitHub are also available directly. The public website and resume omit the phone number. Update the single PDF in `assets/` to refresh every resume link. Resume academic results retain the supplied figures, described as reported project results.
