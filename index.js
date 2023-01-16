import Reveal from 'reveal.js/dist/reveal.esm.js';
import Markdown from 'reveal.js/plugin/markdown/markdown.esm.js';
import Highlight from 'reveal.js/plugin/highlight/highlight.esm.js';

import 'reveal.js/dist/reset.css';
import 'reveal.js/dist/reveal.css';
import 'reveal.js/dist/theme/black.css';
import 'reveal.js/plugin/highlight/zenburn.css';

// import all markdown files from ./content and omit one reveal section per file
const markdownFiles = (ctx => {
  return ctx.keys().map(ctx);
})(require.context('./content/', false, /\.md$/));

const revealContainer = document.createElement('div');
revealContainer.classList.add('reveal');
const slidesContainer = document.createElement('div');
slidesContainer.classList.add('slides');

for (const file of markdownFiles) {
  const section = document.createElement('section');

  // use setAttribute, setting `separator-vertical` on `dataset` throws a DOMException
  section.setAttribute('data-markdown', file);
  section.setAttribute('data-separator', '^\r?\n---\r?\n$');
  section.setAttribute('data-separator-vertical', '^\r?\nvvv\r?\n$');
  section.setAttribute('data-separator-notes', 'notes?:');
  section.setAttribute('data-charset', 'utf-8');

  slidesContainer.appendChild(section);
}

revealContainer.appendChild(slidesContainer);
document.body.appendChild(revealContainer);

Reveal.initialize({
  plugins: [Markdown, Highlight],
  hash: true
});
