const app = document.querySelector("#app");
const books = window.BOOKS || [];

function esc(value="") {
  return String(value).replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#039;"}[ch]));
}

function route() {
  const hash = location.hash.slice(1);
  const [type, bookId, chapterId] = hash.split("/");
  if (type === "book") return renderBook(bookId);
  if (type === "chapter") return renderChapter(bookId, chapterId);
  renderLibrary();
  window.scrollTo(0, 0);
}

function header(backHref) {
  return `<header class="topbar">
    ${backHref ? `<a class="icon-btn" href="${backHref}" aria-label="Назад">←</a>` : `<div class="brand-mark">B</div>`}
    <div class="brand">BookNotes</div>
    <div class="top-decoration" aria-hidden="true">⌁</div>
  </header>`;
}

function renderLibrary() {
  app.innerHTML = `
    <div class="shell">
      ${header()}
      <section class="hero">
        <p class="eyebrow">ЛИЧНАЯ БИБЛИОТЕКА</p>
        <h1>Книги, которые<br><em>остаются с тобой.</em></h1>
        <p class="lead">Короткие конспекты, важные идеи и мысли из каждой прочитанной главы.</p>
        <div class="book-line" aria-hidden="true"><span></span><i></i><span></span></div>
      </section>
      <section class="section">
        <div class="section-head">
          <h2>Мои книги</h2>
          <span class="count">${books.length}</span>
        </div>
        <div class="books-grid">
          ${books.map(bookCard).join("")}
        </div>
      </section>
      <footer>BookNotes <span>•</span> моя библиотека знаний</footer>
    </div>`;
}

function bookCard(book) {
  const total = book.chapters?.length || 0;
  return `<a class="book-card" href="#book/${book.id}">
    <div class="cover" style="--accent:${book.accent || "#ded6ca"}">
      <div class="cover-rule"></div>
      <div class="cover-symbol">${esc(book.symbol || "B")}</div>
      <div class="cover-lines"><span></span><span></span><span></span></div>
    </div>
    <div class="book-meta">
      <p>${esc(book.category || "Книга")}</p>
      <h3>${esc(book.title)}</h3>
      <span>${esc(book.author)}</span>
      <div class="chapters-count">${total} ${chapterWord(total)}</div>
    </div>
  </a>`;
}

function chapterWord(n) {
  const m10=n%10,m100=n%100;
  if(m10===1 && m100!==11) return "глава";
  if([2,3,4].includes(m10) && ![12,13,14].includes(m100)) return "главы";
  return "глав";
}

function renderBook(id) {
  const book = books.find(b => b.id === id);
  if (!book) return renderLibrary();
  app.innerHTML = `<div class="shell">
    ${header("#")}
    <section class="book-hero">
      <div class="mini-cover" style="--accent:${book.accent || "#ded6ca"}"><span>${esc(book.symbol || "B")}</span></div>
      <div>
        <p class="eyebrow">${esc(book.category || "КНИГА")}</p>
        <h1>${esc(book.title)}</h1>
        <p class="author">${esc(book.author)}</p>
      </div>
    </section>
    <section class="section chapters-section">
      <div class="section-head"><h2>Главы</h2><span class="count">${book.chapters.length}</span></div>
      <div class="chapter-list">
        ${book.chapters.map(ch => `<a class="chapter-row" href="#chapter/${book.id}/${ch.id}">
          <span class="chapter-number">${String(ch.number).padStart(2,"0")}</span>
          <div><h3>${esc(ch.title)}</h3><p>${esc(ch.summary)}</p></div>
          <span class="arrow">→</span>
        </a>`).join("")}
      </div>
    </section>
  </div>`;
  window.scrollTo(0,0);
}

function renderChapter(bookId, chapterId) {
  const book = books.find(b => b.id === bookId);
  const ch = book?.chapters.find(c => c.id === chapterId);
  if (!book || !ch) return renderLibrary();
  app.innerHTML = `<div class="shell reading-shell">
    ${header("#book/"+book.id)}
    <article class="note">
      <div class="note-head">
        <p class="eyebrow">${esc(book.title)} · ГЛАВА ${ch.number}</p>
        <h1>${esc(ch.title)}</h1>
        <p class="read-time">☕ ${esc(ch.readTime || "несколько минут")}</p>
      </div>
      <section class="note-block intro"><span class="ornament">✦</span><p>${esc(ch.summary)}</p></section>
      <section class="note-block">
        <p class="block-label">ГЛАВНЫЕ ИДЕИ</p>
        <div class="ideas">${ch.ideas.map((idea,i)=>`<div class="idea"><b>${String(i+1).padStart(2,"0")}</b><p>${esc(idea)}</p></div>`).join("")}</div>
      </section>
      <section class="quote-card"><span>ЗАПОМНИТЬ</span><p>${esc(ch.takeaway)}</p></section>
      <section class="apply-card"><div class="apply-icon">↗</div><div><span>ПРИМЕНИТЬ</span><p>${esc(ch.apply)}</p></div></section>
    </article>
  </div>`;
  window.scrollTo(0,0);
}

window.addEventListener("hashchange", route);
if ("serviceWorker" in navigator) navigator.serviceWorker.register("./sw.js").catch(()=>{});
route();