# 𝒑𝒓𝒆𝒘𝒕𝒚 𝒕𝒙𝒕

> turn your boring text into something that actually looks cool

  [prewtytext.netlify.app](https://prettytextgen.netlify.app/)

<!-- ![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)
![No Dependencies](https://img.shields.io/badge/dependencies-none-brightgreen.svg)
![Vanilla JS](https://img.shields.io/badge/built%20with-vanilla%20js-f7df1e.svg)

**[→ try it live](https://prewtytext.netlify.app)** -->

---

## what it does

type something → instantly get it in 12 different unicode styles → copy & paste anywhere

perfect for:
- social media bios & captions
- discord / telegram / slack messages
- making your texts look way more aesthetic
- standing out in comment sections

---

## styles

| style | example |
|---|---|
| Bold | 𝐡𝐞𝐥𝐥𝐨 |
| Italic | 𝘩𝘦𝘭𝘭𝘰 |
| Bold Italic | 𝒉𝒆𝒍𝒍𝒐 |
| Script | 𝒽𝑒𝓁𝓁𝑜 |
| Bold Script | 𝓱𝓮𝓵𝓵𝓸 |
| Fraktur | 𝔥𝔢𝔩𝔩𝔬 |
| Bold Fraktur | 𝖍𝖊𝖑𝖑𝖔 |
| Double-Struck | 𝕙𝕖𝕝𝕝𝕠 |
| Sans-Serif | 𝗁𝖾𝗅𝗅𝗈 |
| Sans-Serif Bold | 𝗵𝗲𝗹𝗹𝗼 |
| Sans-Serif Italic | 𝘩𝘦𝘭𝘭𝘰 |
| Monospace | 𝚑𝚎𝚕𝚕𝚘 |

---

## how to use

**online:** just go to [prewtytext.netlify.app](https://prettytextgen.netlify.app/)

**locally:**
1. clone the repo
2. open `index.html` in your browser
3. type → copy → paste → done

no installs. no build step. no node_modules eating your storage.

---

## tech

- **vanilla js** — no frameworks, no bundlers, just vibes
- **proper unicode handling** via `Array.from()` so surrogate pairs don't explode
- **clipboard API** with fallback for older browsers
- **responsive** — works on mobile too

---

## license

MIT - see [LICENSE.md](LICENSE.md)
