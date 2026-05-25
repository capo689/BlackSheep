const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let threeModulePromise;

const tastingNotes = [
  { country: "Colombia", flag: "🇨🇴", notes: ["almond butter", "nutmeg"], accent: "#c98b44", photo: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1200&q=80", ingredients: ["almond", "nutmeg", "cacao"] },
  { country: "Ecuador", flag: "🇪🇨", notes: ["toasted almond", "malt"], accent: "#b5813a", photo: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?auto=format&fit=crop&w=1200&q=80", ingredients: ["almond", "malt", "cacao"] },
  { country: "Dominican Republic", flag: "🇩🇴", notes: ["cherry", "strawberry", "honey"], accent: "#b6384d", photo: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80", ingredients: ["cherry", "berry", "honey"] },
  { country: "Guatemala", flag: "🇬🇹", notes: ["citrus", "orange peel"], accent: "#d9822b", photo: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80", ingredients: ["citrus", "peel", "cacao"] },
  { country: "Belize", flag: "🇧🇿", notes: ["pineapple", "honey", "raisin"], accent: "#d0a122", photo: "https://images.unsplash.com/photo-1546500840-ae38253aba9b?auto=format&fit=crop&w=1200&q=80", ingredients: ["pineapple", "honey", "raisin"] }
];

const locations = {
  bars: [
    ["Idaho","Hell's Canyon Winery","Caldwell","18835 Symms Rd.","Chocolate Bars",43.66,-116.69,23,35],["Idaho","Kerry Hill Winery","Wilder","17264 Kerry Hill Ln.","Chocolate Bars",43.68,-116.91,22,36],["Idaho","North fork coffee roasters","McCall","204 Lenora St. Suite 100","Chocolate Bars",44.91,-116.10,24,30],["Idaho","Parma Ridge Winery","Parma","24509 Rudd Rd.","Chocolate Bars",43.78,-116.94,21,34],
    ["Oregon","Bledsoe family winery","Bend","550 SW Industrial Way Suite 198","Chocolate Bars",44.05,-121.32,16,49],["Oregon","The Commons Cafe and Taproom","Bend","875 NW Brooks St.","Chocolate Bars",44.06,-121.32,16,49],["Oregon","Fika Sisters Coffeehouse","Sisters","201 E Sun Ranch Dr.","Chocolate Bars",44.29,-121.55,15,47],["Oregon","The Meadow - NW 23rd","Portland","805 NW 23rd Ave.","Chocolate Bars",45.528,-122.699,13,41],["Oregon","The Meadow - Mississippi","Portland","3731 N Mississippi Ave.","Chocolate Bars",45.55,-122.675,13,41],["Oregon","Newport Avenue Market","Bend","1121 NW Newport Ave.","Chocolate Bars",44.06,-121.33,16,49],["Oregon","Oliver Lemon's","Sisters","160 S. Fir St.","Chocolate Bars",44.29,-121.55,15,47],["Oregon","West Coast Provisions","Bend","2735 NW Crossing Dr.","Chocolate Bars",44.07,-121.36,16,49],["Oregon","The Workhouse","Bend","50 SE Scott St.","Chocolate Bars",44.05,-121.30,16,49],
    ["Wisconsin","1855 Coffeehouse","Mazomanie","1 Broadhead St","Chocolate Bars",43.17,-89.80,66,42],["Wisconsin","Babcock Dairy Store","Madison","1605 Linden Dr.","Chocolate Bars",43.08,-89.42,69,44],["Wisconsin","Bandit Coffee & tacos","Madison","640 W Washington Ave","Chocolate Bars",43.07,-89.39,69,44],["Wisconsin","Cambridge Market Cafe","Cambridge","217 W Main St.","Chocolate Bars",43.00,-89.02,72,46],["Wisconsin","Conscious Carnivore","Madison","3236A University Ave","Chocolate Bars",43.08,-89.44,69,44],["Wisconsin","Dancing Goat Distillery","Cambridge","909 Vineyard Drive","Chocolate Bars",43.01,-89.02,72,46],["Wisconsin","Finca Coffee","Madison","2500 Rimrock Rd.","Chocolate Bars",43.04,-89.38,69,45],["Wisconsin","Glas Coffee - Green Bay","Green Bay","228 N Adams St","Chocolate Bars",44.515,-88.016,75,31],["Wisconsin","Glas Coffee - Shawano","Shawano","511 N Main St","Chocolate Bars",44.782,-88.609,73,29],["Wisconsin","Green Grocer & Deli","Williams Bay","24 W Geneva St","Chocolate Bars",42.58,-88.54,73,52],["Wisconsin","Kavarna coffeehouse","Green Bay","143 N Broadway","Chocolate Bars",44.52,-88.02,75,31],["Wisconsin","Maker's market square","Mt Horeb","101 S Main St","Chocolate Bars",43.01,-89.74,67,46],["Wisconsin","Mc farland house cafe","McFarland","5923 Exchange St","Chocolate Bars",43.01,-89.29,70,46],["Wisconsin","Red Bank Coffeehouse","Two Rivers","1623 Washington St.","Chocolate Bars",44.15,-87.57,78,36],["Wisconsin","Ruby Coffee Roasters - Nelsonville","Nelsonville","9489 1st St","Chocolate Bars",44.495,-89.309,68,30],["Wisconsin","Ruby Coffee Roasters - Stevens Point","Stevens Point","1410 3rd St","Chocolate Bars",44.523,-89.575,68,30],["Wisconsin","Seven Acre Dairy","Belleville","6858 Paoli Rd","Chocolate Bars",42.86,-89.54,68,48],["Wisconsin","superette","Madison","1874 E Washington Ave","Chocolate Bars",43.09,-89.36,69,44],["Wisconsin","Tati Coffee","Fitchburg","4889 Lacy Rd #101","Chocolate Bars",43.00,-89.43,69,46],["Wisconsin","Twisted Grounds","Madison","6067 Gemini Dr.","Chocolate Bars",43.13,-89.29,70,44],["Wisconsin","Vitruvian Farms","McFarland","2727 US Hwy 51","Chocolate Bars",42.98,-89.29,70,46],["Wisconsin","Wine Styles","Sun Prairie","2824 Prairie Lakes Dr #105","Chocolate Bars",43.17,-89.27,70,43],["Wisconsin","Wisco Boxes","Mt Horeb","305 E Main St","Chocolate Bars",43.01,-89.74,67,46]
  ],
  drinks: [
    ["Wisconsin","1855 Coffee house","Mazomaine","1 Broadhead St","Cacao Tea",43.17,-89.80,66,42],["Wisconsin","tati coffee","Fitchburg","4889 Lacy Rd #101","Cacao Tea",43.00,-89.43,69,46],["Wisconsin","Telsaan tea","Mount Horeb","108 E Main St","Cacao Tea",43.01,-89.74,67,46],["Wisconsin","Maker's Market Square","Mt Horeb","101 S. Main St","drinking chocolate",43.01,-89.74,67,46],["Wisconsin","seven acre dairy","Belleville","6858 Paoli Rd","drinking chocolate",42.86,-89.54,68,48]
  ],
  bulk: [
    ["Oregon","Not bread - Bend","Bend","Chocolate Chip Seed loaf","Bulk Chocolate",44.05,-121.32,16,49],["Oregon","Not bread - Portland","Portland","Chocolate Chip Seed loaf","Bulk Chocolate",45.52,-122.67,13,41],["Oregon","Rachel's bakery","Bend","West Coast Babka","Bulk Chocolate",44.05,-121.32,16,49],["Wisconsin","Driftless Chocolates","Mt Horeb","Artisan Dark Truffles","Bulk Chocolate",43.01,-89.74,67,46],["Wisconsin","shift Cyclery","Eau Claire","Mochas and Hot Chocolate","Bulk Drinks",44.81,-91.50,62,32]
  ]
};

initNav();
initTransitions();
initReveals();
initMascotEyes();
renderTasting();
renderLocator();
if (!reduceMotion && document.body.classList.contains("home-page")) initThreeHero();

function initNav() {
  const button = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!button || !nav) return;
  button.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    button.setAttribute("aria-expanded", String(open));
  });
}

function initTransitions() {
  const wipe = document.querySelector(".chocolate-wipe");
  if (!wipe || reduceMotion) return;
  const transitionPromise = createChocolatePour(wipe).catch((error) => {
    console.warn("Three.js chocolate transition unavailable; using static fallback.", error);
    return null;
  });
  let changingPage = false;
  document.querySelectorAll("a[href^='/']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      const currentPath = window.location.pathname.replace(/\/$/, "");
      const nextPath = new URL(href, window.location.origin).pathname.replace(/\/$/, "");
      if (!href || nextPath === currentPath || changingPage) return;
      event.preventDefault();
      changingPage = true;
      transitionPromise
        .then((transition) => transition ? transition.play() : fallbackPour(wipe))
        .catch(() => fallbackPour(wipe))
        .finally(() => { window.location.href = href; });
    });
  });
}

function loadThree() {
  if (!threeModulePromise) {
    threeModulePromise = import("https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js");
  }
  return threeModulePromise;
}

async function createChocolatePour(container) {
  const THREE = await loadThree();
  container.textContent = "";
  const canvas = document.createElement("canvas");
  container.append(canvas);

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: "high-performance" });
  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const uniforms = {
    uTime: { value: 0 },
    uProgress: { value: 0 },
    uResolution: { value: new THREE.Vector2(1, 1) }
  };
  const material = new THREE.ShaderMaterial({
    transparent: true,
    depthTest: false,
    depthWrite: false,
    uniforms,
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position.xy, 0.0, 1.0);
      }
    `,
    fragmentShader: `
      precision highp float;
      uniform float uTime;
      uniform float uProgress;
      uniform vec2 uResolution;
      varying vec2 vUv;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 45.32);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
      }

      float fbm(vec2 p) {
        float v = 0.0;
        float a = 0.5;
        mat2 rot = mat2(0.80, -0.60, 0.60, 0.80);
        for (int i = 0; i < 5; i++) {
          v += a * noise(p);
          p = rot * p * 2.05 + 11.7;
          a *= 0.52;
        }
        return v;
      }

      float drip(vec2 uv, float x, float width, float reach, float wobble) {
        float stream = exp(-pow((uv.x - x - sin(uTime * 1.25 + x * 9.0) * wobble) / width, 2.0));
        float taper = smoothstep(0.06, 0.84, uProgress) * reach;
        return stream * taper;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / uResolution.xy;
        float aspect = uResolution.x / max(uResolution.y, 1.0);
        vec2 flowUv = vec2(uv.x * aspect, uv.y);

        float slowTime = uTime * 0.34;
        float wideNoise = fbm(vec2(uv.x * 2.7, uv.y * 1.2 - slowTime));
        float fineNoise = fbm(vec2(uv.x * 10.0 + slowTime, uv.y * 5.0 + uTime * 0.18));
        float pourEase = smoothstep(0.0, 1.0, uProgress);
        float front = 1.16 - pourEase * 1.38;
        front += sin(uv.x * 7.5 + uTime * 0.72) * 0.024;
        front += sin(uv.x * 17.0 - uTime * 0.46) * 0.012;
        front += (wideNoise - 0.5) * 0.105;
        front -= drip(uv, 0.18, 0.040, 0.23, 0.012);
        front -= drip(uv, 0.47, 0.055, 0.34, 0.016);
        front -= drip(uv, 0.72, 0.038, 0.22, 0.010);
        front -= drip(uv, 0.88, 0.030, 0.17, 0.014);

        float liquid = smoothstep(front - 0.035, front + 0.025, uv.y);
        float edge = exp(-abs(uv.y - front) * 42.0) * liquid;

        float body = fbm(flowUv * vec2(2.0, 6.4) + vec2(0.0, slowTime * 1.3));
        float ribbons = sin((uv.x + body * 0.08) * 23.0 + uTime * 0.65) * 0.5 + 0.5;
        float satin = pow(ribbons, 10.0) * 0.32;
        float verticalSheen = pow(max(0.0, sin((uv.x * 4.2 + body * 0.52 - uTime * 0.16) * 3.14159)), 18.0) * 0.38;
        float rimSheen = edge * (0.35 + fineNoise * 0.45);

        vec3 bitter = vec3(0.065, 0.020, 0.010);
        vec3 warm = vec3(0.300, 0.100, 0.038);
        vec3 milk = vec3(0.560, 0.245, 0.105);
        vec3 gloss = vec3(1.000, 0.715, 0.420);
        vec3 color = mix(bitter, warm, 0.52 + body * 0.45);
        color = mix(color, milk, fineNoise * 0.18);
        color += gloss * (satin + verticalSheen + rimSheen) * 0.52;
        color *= 0.92 + smoothstep(0.0, 1.0, uv.y) * 0.14;

        float alpha = liquid * smoothstep(0.0, 0.08, pourEase);
        gl_FragColor = vec4(color, alpha);
      }
    `
  });
  scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

  function resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.setSize(width, height, false);
    uniforms.uResolution.value.set(width, height);
  }
  resize();
  window.addEventListener("resize", resize, { passive: true });

  return {
    play() {
      resize();
      container.classList.remove("fallback-pour");
      container.style.opacity = "1";
      const duration = 1650;
      const start = performance.now();
      return new Promise((resolve) => {
        function render(now) {
          const raw = Math.min(1, (now - start) / duration);
          const eased = raw < .5 ? 2.0 * raw * raw : 1.0 - Math.pow(-2.0 * raw + 2.0, 2.0) / 2.0;
          uniforms.uTime.value = now * 0.001;
          uniforms.uProgress.value = eased;
          renderer.render(scene, camera);
          if (raw < 1) requestAnimationFrame(render);
          else resolve();
        }
        requestAnimationFrame(render);
      });
    }
  };
}

function fallbackPour(container) {
  container.classList.add("fallback-pour");
  return new Promise((resolve) => setTimeout(resolve, 900));
}

function initMascotEyes() {
  const mascot = document.querySelector("[data-mascot]");
  if (!mascot || reduceMotion) return;
  const move = (event) => {
    const rect = mascot.getBoundingClientRect();
    const centerX = rect.left + rect.width * .58;
    const centerY = rect.top + rect.height * .44;
    const x = Math.max(-1, Math.min(1, (event.clientX - centerX) / (rect.width * .42)));
    const y = Math.max(-1, Math.min(1, (event.clientY - centerY) / (rect.height * .42)));
    mascot.style.setProperty("--eye-x", `${x * 5}px`);
    mascot.style.setProperty("--eye-y", `${y * 4}px`);
    mascot.style.setProperty("--mascot-tilt", `${x * 2.2}deg`);
  };
  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("pointerleave", () => {
    mascot.style.setProperty("--eye-x", "0px");
    mascot.style.setProperty("--eye-y", "0px");
    mascot.style.setProperty("--mascot-tilt", "0deg");
  }, { passive: true });
}

function initReveals() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;
  if (window.gsap && window.ScrollTrigger && !reduceMotion) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    items.forEach((item) => window.gsap.to(item, { autoAlpha: 1, y: 0, duration: .8, ease: "power3.out", scrollTrigger: { trigger: item, start: "top 84%" } }));
    return;
  }
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.style.opacity = "1";
    entry.target.style.transform = "none";
    observer.unobserve(entry.target);
  }), { threshold: .16 });
  items.forEach((item) => observer.observe(item));
}

function renderTasting() {
  const grid = document.querySelector("#tasting-grid");
  if (!grid) return;
  grid.innerHTML = tastingNotes.map((origin) => `
    <article class="origin-card reveal" style="--accent:${origin.accent}">
      <div class="origin-photo" style="background-image:url('${origin.photo}')"><span class="flag">${origin.flag}</span></div>
      <div class="origin-body">
        <h2>${origin.country}</h2>
        <ul class="note-list">${origin.notes.map((note) => `<li>${note}</li>`).join("")}</ul>
        <div class="ingredient-art">${origin.ingredients.map((item) => `<span>${item}</span>`).join("")}</div>
      </div>
    </article>`).join("");
  initReveals();
}

function renderLocator() {
  const app = document.querySelector("#locator-app");
  const type = document.body.dataset.locator || "all";
  if (!app) return;
  const types = type === "all" || !locations[type] ? ["bars", "drinks", "bulk"] : [type];
  const data = types.flatMap((kind) => locations[kind].map(([state, name, city, address, category, lat, lng, x, y], id) => ({
    id: `${kind}-${id}`,
    kind,
    state,
    name,
    city,
    address,
    category,
    lat,
    lng,
    x,
    y
  }))).sort((a, b) => a.state.localeCompare(b.state) || a.city.localeCompare(b.city) || a.name.localeCompare(b.name));
  if (!data.length) return;
  const productOptions = [
    ["all", "All products"],
    ["bars", "Chocolate bars"],
    ["drinks", "Cacao tea + drinking chocolate"],
    ["bulk", "Bulk chocolate + drinks"]
  ].filter(([value]) => value === "all" || types.includes(value));
  const states = ["All states", ...new Set(data.map((item) => item.state))];
  app.innerHTML = `
    <div class="locator-tools">
      <input id="locator-search" placeholder="Search by store, city, product, or address" aria-label="Search locations">
      <select id="product-filter" aria-label="Filter by product">${productOptions.map(([value, label]) => `<option value="${value}">${label}</option>`).join("")}</select>
      <select id="state-filter" aria-label="Filter by state">${states.map((state) => `<option value="${state}">${state}</option>`).join("")}</select>
      <button class="button button-light" id="near-me" type="button">Store near me</button>
    </div>
    <div class="filter-rail product-rail" id="product-rail">${productOptions.map(([value, label]) => `<button class="state-pill product-pill" type="button" data-product="${value}">${label}</button>`).join("")}</div>
    <div class="filter-rail state-rail" id="state-rail">${states.map((state) => `<button class="state-pill" type="button" data-state="${state}">${state}</button>`).join("")}</div>
    <p class="nearest-status" id="nearest-status">${data.length} locations loaded.</p>
    <div class="locator-layout">
      <div class="store-list" id="store-list" aria-live="polite"></div>
      <div class="map-panel"><div class="leaflet-map" id="locator-map" aria-label="Store locator map"></div><div class="map-info" id="map-info"><strong>Choose a store.</strong><p>Store details will appear here.</p></div></div>
    </div>`;

  const search = app.querySelector("#locator-search");
  const productFilter = app.querySelector("#product-filter");
  const stateFilter = app.querySelector("#state-filter");
  const list = app.querySelector("#store-list");
  const mapEl = app.querySelector("#locator-map");
  const info = app.querySelector("#map-info");
  const status = app.querySelector("#nearest-status");
  const rail = app.querySelector("#state-rail");
  const productRail = app.querySelector("#product-rail");
  let activeId = data[0]?.id;
  let current = [...data];
  let userLocation = null;
  let leaflet = null;

  function draw() {
    const term = search.value.trim().toLowerCase();
    const state = stateFilter.value;
    const product = productFilter.value;
    current = data.filter((item) => {
      const searchable = [item.name, item.city, item.address, item.category, item.state, kindLabel(item.kind)].join(" ").toLowerCase();
      return (product === "all" || item.kind === product) &&
        (state === "All states" || item.state === state) &&
        searchable.includes(term);
    });
    if (userLocation) current.sort((a, b) => distance(userLocation, a) - distance(userLocation, b));
    status.textContent = `${current.length} ${current.length === 1 ? "location" : "locations"} shown${userLocation ? " sorted by distance from you" : ""}.`;
    rail.querySelectorAll(".state-pill").forEach((button) => button.classList.toggle("active", button.dataset.state === state));
    productRail.querySelectorAll(".product-pill").forEach((button) => button.classList.toggle("active", button.dataset.product === product));
    if (!current.length) activeId = null;
    else if (!current.some((item) => item.id === activeId)) activeId = current[0].id;
    list.innerHTML = listMarkup(current);
    updateInfo();
    drawMap();
  }
  function listMarkup(items) {
    if (!items.length) {
      return '<div class="empty-results"><h2>No retailers found.</h2><p>Try a broader product, state, or city search.</p></div>';
    }
    if (userLocation) {
      return `<section class="store-group"><h2>Closest matches</h2>${items.map(cardMarkup).join("")}</section>`;
    }
    const grouped = items.reduce((groups, item) => {
      if (!groups.has(item.state)) groups.set(item.state, []);
      groups.get(item.state).push(item);
      return groups;
    }, new Map());
    return [...grouped.entries()].map(([state, group]) => `
      <section class="store-group">
        <h2>${state}<span>${group.length} ${group.length === 1 ? "location" : "locations"}</span></h2>
        ${group.map(cardMarkup).join("")}
      </section>
    `).join("");
  }
  function cardMarkup(item) {
    const miles = userLocation ? `<span class="distance">${Math.round(distance(userLocation, item))} mi away</span>` : "";
    return `<article class="store-card${item.id === activeId ? " active" : ""}" data-id="${item.id}" tabindex="0"><span class="store-icon ${item.kind}" aria-hidden="true"></span><div><h3>${item.name}</h3><p>${item.city}, ${item.state}</p><p>${item.address}</p><span class="product-kind">${kindLabel(item.kind)}</span><span class="tag">${item.category}</span>${miles}<br><a href="${mapsUrl(item)}" target="_blank" rel="noreferrer">Open in Google Maps</a></div></article>`;
  }
  function setActive(id) {
    activeId = id;
    draw();
    const card = list.querySelector(`[data-id="${id}"]`);
    if (card) card.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
    focusMarker();
  }
  function updateInfo() {
    const item = data.find((entry) => entry.id === activeId) || current[0];
    if (!item) {
      info.innerHTML = "<strong>No retailer selected.</strong><p>Adjust the filters to show more locations.</p>";
      return;
    }
    const miles = userLocation ? `<p>${Math.round(distance(userLocation, item))} miles from your location.</p>` : "";
    info.innerHTML = `<strong>${item.name}</strong><p>${item.city}, ${item.state}<br>${item.address}</p><p><span class="product-kind">${kindLabel(item.kind)}</span>${item.category}</p>${miles}<a class="button button-light" href="${mapsUrl(item)}" target="_blank" rel="noreferrer">Open in Google Maps</a>`;
    bindCards();
  }
  function mapsUrl(item) {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${item.name} ${item.address} ${item.city} ${item.state}`)}`;
  }
  function popupMarkup(item) {
    return `<strong>${item.name}</strong><br>${item.city}, ${item.state}<br>${item.address}<br><a href="${mapsUrl(item)}" target="_blank" rel="noreferrer">Open in Google Maps</a>`;
  }
  async function initMap() {
    if (leaflet) return leaflet;
    status.textContent = "Loading interactive map...";
    const L = await loadLeaflet();
    const map = L.map(mapEl, { scrollWheelZoom: false, preferCanvas: true });
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19
    }).addTo(map);
    const markerLayer = window.L.markerClusterGroup ? window.L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 42
    }) : L.layerGroup();
    markerLayer.addTo(map);
    leaflet = { L, map, markerLayer, markers: new Map(), userMarker: null };
    return leaflet;
  }
  function drawMap() {
    if (!leaflet) return;
    const { L, map, markerLayer, markers } = leaflet;
    markers.clear();
    markerLayer.clearLayers();
    current.forEach((item) => {
      const marker = L.marker([item.lat, item.lng], { icon: sheepIcon(item.id === activeId), title: item.name });
      marker.bindPopup(popupMarkup(item));
      marker.on("click", () => {
        activeId = item.id;
        updateInfo();
        list.innerHTML = listMarkup(current);
        bindCards();
      });
      markers.set(item.id, marker);
      markerLayer.addLayer(marker);
    });
    if (userLocation) drawUserMarker();
    if (current.length) {
      const bounds = L.latLngBounds(current.map((item) => [item.lat, item.lng]));
      if (userLocation) bounds.extend([userLocation.lat, userLocation.lng]);
      map.fitBounds(bounds, { padding: [32, 32], maxZoom: current.length === 1 ? 13 : 8 });
    }
    focusMarker(false);
  }
  function focusMarker(openPopup = true) {
    if (!leaflet) return;
    const marker = leaflet.markers.get(activeId);
    const item = data.find((entry) => entry.id === activeId);
    if (!marker || !item) return;
    marker.setIcon(sheepIcon(true));
    leaflet.map.setView([item.lat, item.lng], Math.max(leaflet.map.getZoom(), 11), { animate: !reduceMotion });
    if (openPopup) marker.openPopup();
  }
  function sheepIcon(active = false) {
    return window.L.divIcon({
      className: `sheep-map-marker${active ? " active" : ""}`,
      html: '<span></span>',
      iconSize: active ? [48, 48] : [38, 38],
      iconAnchor: active ? [24, 24] : [19, 19],
      popupAnchor: [0, -22]
    });
  }
  function drawUserMarker() {
    if (!leaflet || !userLocation) return;
    const { L, map } = leaflet;
    if (leaflet.userMarker) leaflet.userMarker.remove();
    leaflet.userMarker = L.circleMarker([userLocation.lat, userLocation.lng], {
      radius: 9,
      color: "#111",
      fillColor: "#c2a080",
      fillOpacity: .9,
      weight: 3
    }).addTo(map).bindPopup("Your location");
  }
  function bindCards() {
    list.querySelectorAll(".store-card").forEach((card) => {
      card.addEventListener("click", () => setActive(card.dataset.id));
      card.addEventListener("keydown", (event) => { if (event.key === "Enter") setActive(card.dataset.id); });
    });
  }
  function kindLabel(kind) {
    return { bars: "Chocolate bars", drinks: "Cacao drinks", bulk: "Bulk partners" }[kind] || "Retailer";
  }
  function loadLeaflet() {
    if (window.L && window.L.map) return Promise.resolve(window.L);
    appendStylesheet("https://unpkg.com/leaflet@1.9.4/dist/leaflet.css");
    appendStylesheet("https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.css");
    appendStylesheet("https://unpkg.com/leaflet.markercluster@1.5.3/dist/MarkerCluster.Default.css");
    return loadScript("https://unpkg.com/leaflet@1.9.4/dist/leaflet.js")
      .then(() => loadScript("https://unpkg.com/leaflet.markercluster@1.5.3/dist/leaflet.markercluster.js").catch(() => window.L))
      .then(() => window.L);
  }
  function appendStylesheet(href) {
    if (document.querySelector(`link[href="${href}"]`)) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = href;
    document.head.append(link);
  }
  function loadScript(src) {
    if (document.querySelector(`script[src="${src}"]`)) return Promise.resolve();
    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = src;
      script.async = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.append(script);
    });
  }
  function distance(a, b) {
    const r = 3958.8, dLat = (b.lat - a.lat) * Math.PI / 180, dLng = (b.lng - a.lng) * Math.PI / 180;
    const lat1 = a.lat * Math.PI / 180, lat2 = b.lat * Math.PI / 180;
    const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
    return 2 * r * Math.asin(Math.sqrt(h));
  }
  app.querySelector("#near-me").addEventListener("click", () => {
    if (!navigator.geolocation) { status.textContent = "Geolocation is not available in this browser."; return; }
    status.textContent = "Asking your browser for location permission...";
    navigator.geolocation.getCurrentPosition((position) => {
      const here = { lat: position.coords.latitude, lng: position.coords.longitude };
      const nearest = [...data].sort((a, b) => distance(here, a) - distance(here, b))[0];
      userLocation = here;
      activeId = nearest.id;
      status.textContent = `Nearest result: ${nearest.name}, about ${Math.round(distance(here, nearest))} miles away.`;
      draw();
    }, () => { status.textContent = "Location permission was not granted. Search by city or state instead."; });
  });
  search.addEventListener("input", draw);
  productFilter.addEventListener("change", draw);
  stateFilter.addEventListener("change", draw);
  productRail.querySelectorAll(".product-pill").forEach((button) => {
    button.addEventListener("click", () => {
      productFilter.value = button.dataset.product;
      draw();
    });
  });
  rail.querySelectorAll(".state-pill").forEach((button) => {
    button.addEventListener("click", () => {
      stateFilter.value = button.dataset.state;
      draw();
    });
  });
  draw();
  initMap().then(() => draw()).catch(() => {
    status.textContent = "Interactive map could not load. Store cards and Google Maps links are still available.";
    mapEl.innerHTML = '<div class="map-fallback">Map could not load. Use the store cards and Google Maps links.</div>';
  });
}

async function initThreeHero() {
  const canvas = document.querySelector("#hero-webgl");
  if (!canvas) return;
  try {
    const THREE = await loadThree();
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, .1, 100);
    const clock = new THREE.Clock();
    const pointer = new THREE.Vector2();
    camera.position.set(0, 1.2, 8);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene.add(new THREE.AmbientLight(0xffffff, 1.05));
    const light = new THREE.PointLight(0xc2a080, 42, 24);
    light.position.set(-3, 4, 5);
    scene.add(light);

    const river = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 12, 96, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        uniforms: { uTime: { value: 0 }, uMouse: { value: pointer } },
        vertexShader: `uniform float uTime; uniform vec2 uMouse; varying vec2 vUv; void main(){ vUv=uv; vec3 p=position; p.z += sin(p.x*1.2+uTime)*.22 + sin(p.y*2.4+uTime*1.4)*.16; p.x += sin(p.y*1.8+uTime)*.12; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0); }`,
        fragmentShader: `uniform float uTime; varying vec2 vUv; void main(){ float ribbon=sin((vUv.x+vUv.y*.35)*18.0+uTime*1.8)*.5+.5; vec3 ink=vec3(.06,.055,.05); vec3 tan=vec3(.76,.62,.49); vec3 cream=vec3(1.,.96,.86); vec3 color=mix(tan,ink,smoothstep(.35,1.,ribbon)); color=mix(color,cream,pow(1.-ribbon,8.)*.24); float alpha=.42*smoothstep(0.,.18,vUv.y)*(1.-smoothstep(.92,1.,vUv.y)); gl_FragColor=vec4(color,alpha); }`
      })
    );
    river.rotation.x = -1.16;
    river.position.set(1.5, -2.3, -2);
    scene.add(river);

    const loader = new THREE.TextureLoader();
    const group = new THREE.Group();
    scene.add(group);
    ["/assets/live/logo-mascot.png", "/package.jpg", "/assets/live/bars-hand.jpg"].forEach((src, i) => {
      const tex = loader.load(src);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(i === 0 ? 1.35 : 1.6, i === 0 ? 1.35 : 1.08, .08), new THREE.MeshStandardMaterial({ map: tex, roughness: .56, metalness: .02 }));
      mesh.position.set(-2.8 + i * 2.65, .85 - i * .24, -1.4 - i * .55);
      mesh.rotation.set(.08, -.22 + i * .18, -.12 + i * .08);
      mesh.userData.baseY = mesh.position.y;
      group.add(mesh);
    });
    const sheep = new THREE.Group();
    const wool = new THREE.MeshStandardMaterial({ color: 0xfff6df, roughness: .9 });
    const black = new THREE.MeshStandardMaterial({ color: 0x090504, roughness: .7 });
    for (let i = 0; i < 9; i++) {
      const puff = new THREE.Mesh(new THREE.SphereGeometry(.22 + Math.random() * .08, 18, 18), wool);
      puff.position.set((Math.random() - .5) * 1.1, (Math.random() - .5) * .48, (Math.random() - .5) * .42);
      sheep.add(puff);
    }
    const head = new THREE.Mesh(new THREE.SphereGeometry(.22, 18, 18), black);
    head.position.set(.72, -.02, .03);
    sheep.add(head);
    sheep.scale.setScalar(1.15);
    sheep.position.set(2.8, 1.8, -1.2);
    scene.add(sheep);

    const nibs = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0x171513, size: .03, transparent: true, opacity: .42 }));
    const count = 520, pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) { pos[i*3] = (Math.random()-.5)*12; pos[i*3+1] = (Math.random()-.5)*7; pos[i*3+2] = -2-Math.random()*7; }
    nibs.geometry.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    scene.add(nibs);

    function resize() {
      renderer.setSize(innerWidth, innerHeight, false);
      camera.aspect = innerWidth / innerHeight;
      camera.fov = innerWidth < 760 ? 58 : 45;
      camera.updateProjectionMatrix();
    }
    addEventListener("pointermove", (event) => {
      pointer.x = (event.clientX / innerWidth - .5) * 2;
      pointer.y = (event.clientY / innerHeight - .5) * 2;
    }, { passive: true });
    function render() {
      const t = clock.getElapsedTime();
      river.material.uniforms.uTime.value = t;
      group.rotation.y = pointer.x * .12 + scrollY * .00025;
      group.children.forEach((mesh, i) => { mesh.position.y = mesh.userData.baseY + Math.sin(t * .7 + i) * .14; mesh.rotation.z += Math.sin(t + i) * .0008; });
      sheep.position.y = 1.8 + Math.sin(t * 1.2) * .12;
      sheep.rotation.y = Math.sin(t * .8) * .2 + pointer.x * .25;
      nibs.rotation.y = t * .035;
      camera.position.x += (pointer.x * .38 - camera.position.x) * .05;
      camera.position.y += (1.2 - pointer.y * .25 - camera.position.y) * .05;
      camera.lookAt(0, 0, -1.5);
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    resize();
    addEventListener("resize", resize);
    render();
  } catch (error) {
    console.warn("Three.js hero unavailable; static page remains usable.", error);
  }
}
