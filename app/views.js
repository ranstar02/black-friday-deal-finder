// DealHound views: HTML for the deal list and for one deal's detail page.
// Every value from the data is escaped before it reaches the page.

export const escapeHtml = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export const formatPrice = (n) =>
  `$${Number(n).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

export const discountPercent = (d) => Math.round((1 - d.price / d.was) * 100);

export const formatChecked = (iso) =>
  new Date(iso).toLocaleString("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }) + " UTC";

const VERDICT_CLASS = {
  "NEW LOW": "verdict-new-low",
  "STRONG DEAL": "verdict-strong",
  "ROUTINE SALE": "verdict-routine",
  INFLATED: "verdict-inflated",
};

export function verdictBadge(d) {
  return `<span class="verdict ${VERDICT_CLASS[d.verdict] || ""}">${escapeHtml(d.verdict)}</span>`;
}

export function dealCard(d) {
  const pct = discountPercent(d);
  return `<article class="card">
  <div class="card-top">
    <span class="store-chip">${escapeHtml(d.store)}</span>
    ${verdictBadge(d)}
  </div>
  <h3 class="card-title"><a href="#/deal/${encodeURIComponent(d.id)}">${escapeHtml(d.title)}</a></h3>
  <p class="card-category">${escapeHtml(d.category)}</p>
  <p class="card-prices"><span class="price">${formatPrice(d.price)}</span> <s class="was">${formatPrice(d.was)}</s> <span class="off">−${pct}%</span></p>
  <p class="card-save">You save ${formatPrice(d.was - d.price)}</p>
  <p class="card-checked">Checked ${formatChecked(d.checked)}</p>
  <p class="card-actions"><a class="btn" href="#/deal/${encodeURIComponent(d.id)}">Why this verdict?</a> <a class="btn btn-store" href="${escapeHtml(d.url)}" target="_blank" rel="noopener">Shop at ${escapeHtml(d.store)} ↗</a></p>
</article>`;
}

export function dealCards(shown) {
  if (shown.length === 0) {
    return `<p class="empty">No deal matches those filters. Try clearing the search or lowering the minimum discount.</p>`;
  }
  return `<div class="cards">${shown.map(dealCard).join("")}</div>`;
}

export function filterBar(state, categories, stores) {
  const categoryOptions = ["All categories", ...categories]
    .map((c) => `<option value="${escapeHtml(c)}"${state.category === c ? " selected" : ""}>${escapeHtml(c)}</option>`)
    .join("");
  const storeOptions = ["All stores", ...stores]
    .map((s) => `<option value="${escapeHtml(s)}"${state.store === s ? " selected" : ""}>${escapeHtml(s)}</option>`)
    .join("");
  const discountOptions = [0, 20, 30, 40, 50]
    .map((n) => `<option value="${n}"${state.minDiscount === n ? " selected" : ""}>${n === 0 ? "Any discount" : `${n}% off or more`}</option>`)
    .join("");
  const sortOptions = [
    ["best", "Best deals first"],
    ["discount", "Biggest discount"],
    ["price", "Lowest price"],
    ["newest", "Newest check"],
  ]
    .map(([v, label]) => `<option value="${v}"${state.sort === v ? " selected" : ""}>${label}</option>`)
    .join("");
  return `<section class="filters" aria-label="Search and filters">
  <label class="filter-search">Search <input id="search" type="search" placeholder="Try “AirPods”, “TV”, “Dyson”…" value="${escapeHtml(state.query)}"></label>
  <label>Category <select id="category">${categoryOptions}</select></label>
  <label>Store <select id="store">${storeOptions}</select></label>
  <label>Discount <select id="min-discount">${discountOptions}</select></label>
  <label>Sort <select id="sort">${sortOptions}</select></label>
</section>`;
}

export function listView(state, shown, total) {
  return `<h1>Black Friday deals, checked today</h1>
<p class="lede">Every price below was read at the store — or in a deals source that names the store — on 27 Nov 2026. The badge on each card says honestly whether it is really a deal.</p>
${filterBar(state, state.categories, state.stores)}
<p class="count" role="status">Showing <strong>${shown.length}</strong> of ${total} deals · ${state.newLowCount} new lows</p>
${dealCards(shown)}`;
}

export function dealView(d) {
  const pct = discountPercent(d);
  return `<p class="back"><a href="#/">&larr; All deals</a></p>
<article class="detail">
  <div class="card-top">
    <span class="store-chip">${escapeHtml(d.store)}</span>
    ${verdictBadge(d)}
  </div>
  <h1>${escapeHtml(d.title)}</h1>
  <p class="card-category">${escapeHtml(d.category)} · ${escapeHtml(d.store)}</p>
  <p class="detail-prices"><span class="price big">${formatPrice(d.price)}</span> <s class="was">${formatPrice(d.was)}</s> <span class="off big">−${pct}%</span></p>
  <p class="card-save">You save ${formatPrice(d.was - d.price)} off the usual ${formatPrice(d.was)}.</p>
  <h2>Is it really a deal?</h2>
  <p class="evidence">${escapeHtml(d.evidence)}</p>
  <dl class="facts">
    <dt>Store</dt><dd>${escapeHtml(d.store)}</dd>
    <dt>Category</dt><dd>${escapeHtml(d.category)}</dd>
    <dt>Sale price</dt><dd>${formatPrice(d.price)}</dd>
    <dt>Usual price</dt><dd>${formatPrice(d.was)}</dd>
    <dt>Discount</dt><dd>${pct}% off</dd>
    <dt>Price checked</dt><dd>${formatChecked(d.checked)}</dd>
    <dt>Price read in</dt><dd>${escapeHtml(d.source)}</dd>
    <dt>Condition / code</dt><dd>${escapeHtml(d.note || "No code needed.")}</dd>
  </dl>
  <p class="card-actions"><a class="btn btn-store" href="${escapeHtml(d.url)}" target="_blank" rel="noopener">Shop this deal at ${escapeHtml(d.store)} ↗</a></p>
  <p class="fineprint">Prices move fast on Black Friday — the store page is the final word. This page never changes the price; it only reports what was read and when.</p>
</article>`;
}

export function missingView() {
  return `<h1>Deal not found</h1>
<p>There is no deal at this address. <a href="#/">See all ${"deals"}</a>.</p>`;
}
