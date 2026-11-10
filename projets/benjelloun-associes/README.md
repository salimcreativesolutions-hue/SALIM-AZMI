# Benjelloun & Associés — case study

Drop this whole `benjelloun-associes` folder into the root of your website project in Visual Studio Code.

```
your-site/
├── index.html            ← your homepage
├── projets.html
├── contact.html
└── benjelloun-associes/  ← this folder
    ├── index.html        ← the case study page
    ├── style.css
    ├── script.js
    ├── project-card.html ← card to paste into your homepage grid
    └── assets/
        ├── fonts/        ← TT Firs Neue and TT Hoves Pro (trial)
        ├── img/          ← WebP images (2880px + 1440px) and video posters
        └── video/        ← MP4 videos (2880px + 1440px) and the pencil card video
```

## Steps
1. Copy the folder into your site root.
2. Open `benjelloun-associes/project-card.html`, copy the card and paste it into the project grid on your homepage and on your Projets page.
3. Check the links in the header of `index.html` (`../index.html`, `../projets.html`, `../contact.html`) and rename them if your pages have other names.
4. Preview with the **Live Server** extension in VS Code (right-click `index.html` → Open with Live Server).

## Notes
- Images and videos load lazily. Phones get the 1440px versions automatically.
- Videos are muted, loop, and only play while visible on screen.
- The page uses the TT Firs Neue (titles) and TT Hoves Pro (text) trial fonts, included in `assets/fonts/`. Trial licence: fine for local use; buy the licences before putting the site online.
