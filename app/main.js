// DealHound boot: hash routes (#/ and #/deal/<id>), search, filters and
// sorting. All data lives in deals.js; nothing is fetched from the network.
//
//   #/            the deal list, with search and filters
//   #/deal/<id>   one deal, with its verdict and evidence
//
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { deals, CATEGORIES, STORES } from "./deals.js";
import { listView, dealView, missingView, dealCards, discountPercent } from "./views.js";

const app = document.getElementById("app");

const state = {
  query: "",
  category: "All categories",
  store: "All stores",
  minDiscount: 0,
  sort: "best",
  categories: CATEGORIES,
  stores: STORES,
  newLowCount: deals.filter((d) => d.verdict === "NEW LOW").length,
};

const VERDICT_RANK = { "NEW LOW": 0, "STRONG DEAL": 1, "ROUTINE SALE": 2, INFLATED: 3 };

export function applyFilters(all, s) {
  const q = s.query.trim().toLowerCase();
  const kept = all.filter((d) => {
    if (q && !`${d.title} ${d.store} ${d.category} ${d.verdict}`.toLowerCase().includes(q)) return false;
    if (s.category !== "All categories" && d.category !== s.category) return false;
    if (s.store !== "All stores" && d.store !== s.store) return false;
    if (discountPercent(d) < s.minDiscount) return false;
    return true;
  });
  const sorted = [...kept];
  if (s.sort === "discount") sorted.sort((a, b) => discountPercent(b) - discountPercent(a));
  else if (s.sort === "price") sorted.sort((a, b) => a.price - b.price);
  else if (s.sort === "newest") sorted.sort((a, b) => new Date(b.checked) - new Date(a.checked));
  else {
    // Best deals first: verdict rank, then biggest discount, then lowest price.
    sorted.sort(
      (a, b) =>
        VERDICT_RANK[a.verdict] - VERDICT_RANK[b.verdict] ||
        discountPercent(b) - discountPercent(a) ||
        a.price - b.price,
    );
  }
  return sorted;
}

function renderList() {
  document.title = "DealHound — Black Friday Radar";
  app.innerHTML = listView(state, applyFilters(deals, state), deals.length);
  const search = app.querySelector("#search");
  const category = app.querySelector("#category");
  const store = app.querySelector("#store");
  const minDiscount = app.querySelector("#min-discount");
  const sort = app.querySelector("#sort");
  const refresh = () => {
    const shown = applyFilters(deals, state);
    const count = app.querySelector(".count");
    if (count) {
      count.innerHTML = `Showing <strong>${shown.length}</strong> of ${deals.length} deals · ${state.newLowCount} new lows`;
    }
    const cards = app.querySelector(".cards");
    const empty = app.querySelector(".empty");
    if (cards) cards.outerHTML = dealCards(shown);
    else if (empty) empty.outerHTML = dealCards(shown);
  };
  search.addEventListener("input", () => {
    state.query = search.value;
    refresh();
  });
  category.addEventListener("change", () => {
    state.category = category.value;
    refresh();
  });
  store.addEventListener("change", () => {
    state.store = store.value;
    refresh();
  });
  minDiscount.addEventListener("change", () => {
    state.minDiscount = Number(minDiscount.value);
    refresh();
  });
  sort.addEventListener("change", () => {
    state.sort = sort.value;
    refresh();
  });
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) {
    const found = deals.find((d) => d.id === decodeURIComponent(match[1]));
    document.title = `${found ? found.title : "Not found"} | DealHound`;
    app.innerHTML = found ? dealView(found) : missingView();
  } else {
    renderList();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

window.addEventListener("hashchange", render);
render();
