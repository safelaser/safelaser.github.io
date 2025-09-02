(function () {
return Array.isArray(arr) && arr.length ? arr[Math.floor(Math.random() * arr.length)] : null;
}


function shuffle(arr) {
for (let i = arr.length - 1; i > 0; i--) {
const j = Math.floor(Math.random() * (i + 1));
[arr[i], arr[j]] = [arr[j], arr[i]];
}
return arr;
}


function escapeHtml(s) {
return s
.replace(/&/g, "&amp;")
.replace(/</g, "&lt;")
.replace(/>/g, "&gt;");
}


function inject() {
const cfg = window.LINK_INJECTOR_CONFIG || {};
const maxLinks = Math.max(0, cfg.maxLinks || 2);
const minLen = Math.max(0, cfg.minParagraphLength || 160);
let targets = Array.isArray(cfg.targets) ? cfg.targets.slice() : [];


if (!maxLinks || !targets.length) return;


// ne ismételjünk domain‑t
targets = uniqueBy(targets, (t) => domainOf(t.href));


const paras = Array.from(document.querySelectorAll('#content p[data-inject]'))
.filter((p) => (p.textContent || '').trim().length >= minLen);


if (!paras.length) return;


shuffle(paras);
shuffle(targets);


let inserted = 0;
for (let i = 0; i < paras.length && inserted < maxLinks; i++) {
const p = paras[i];
const t = targets[inserted % targets.length];
const anchor = pick(t.anchors);
if (!t || !t.href || !anchor) continue;


const text = p.textContent.trim();
const words = text.split(/\s+/);
if (words.length < 8) continue;


// beszúrás a 35–65% közé, hogy természetes legyen
const idx = Math.floor(words.length * (0.35 + Math.random() * 0.30));
const before = words.slice(0, idx).join(' ');
const after = words.slice(idx).join(' ');


const a = document.createElement('a');
a.href = t.href;
a.textContent = anchor;
if (t.targetBlank) {
a.target = '_blank';
a.rel = (t.rel || '').trim();
a.rel = (a.rel ? a.rel + ' ' : '') + 'noopener'; // dofollow marad
}


// felülírjuk a <p> tartalmát (egyszerűségi okokból)
p.innerHTML = escapeHtml(before) + ' ' + a.outerHTML + ' ' + escapeHtml(after);
inserted++;
}
}


if (document.readyState === 'loading') {
document.addEventListener('DOMContentLoaded', inject);
} else {
inject();
}
})();
