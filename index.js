import Reveal from 'reveal.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';

import 'reveal.js/dist/reset.css';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import 'reveal.js/plugin/highlight/monokai.css';

import content from './content/test.md';

const revealContainer = document.createElement('div');
revealContainer.classList.add('reveal');
const slidesContainer = document.createElement('div');
slidesContainer.classList.add('slides');

const section = document.createElement('section');
// use setAttribute, setting `separator-vertical` on `dataset` throws a DOMException
section.setAttribute('data-markdown', content);
section.setAttribute('data-separator', '^\r?\n---\r?\n$');
section.setAttribute('data-separator-vertical', '^\r?\nvvv\r?\n$');
section.setAttribute('data-separator-notes', 'notes?:');
section.setAttribute('data-charset', 'utf-8');

slidesContainer.appendChild(section);
revealContainer.appendChild(slidesContainer);
document.body.appendChild(revealContainer);

let deck = new Reveal({
  plugins: [Markdown],
  hash: true
});
deck.initialize();
