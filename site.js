const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
    ["Oregon","Bledsoe family winery","Bend","550 SW Industrial Way Suite 198","Chocolate Bars",44.05,-121.32,16,49],["Oregon","The Commons Cafe and Taproom","Bend","875 NW Brooks St.","Chocolate Bars",44.06,-121.32,16,49],["Oregon","Fika Sisters Coffeehouse","Sisters","201 E Sun Ranch Dr.","Chocolate Bars",44.29,-121.55,15,47],["Oregon","The Meadow","Portland","805 NW 23rd Ave.; 3731 N Mississippi Ave.","Chocolate Bars - 2 locations",45.52,-122.68,13,41],["Oregon","Newport Avenue Market","Bend","1121 NW Newport Ave.","Chocolate Bars",44.06,-121.33,16,49],["Oregon","Oliver Lemon's","Sisters","160 S. Fir St.","Chocolate Bars",44.29,-121.55,15,47],["Oregon","West Coast Provisions","Bend","2735 NW Crossing Dr.","Chocolate Bars",44.07,-121.36,16,49],["Oregon","The Workhouse","Bend","50 SE Scott St.","Chocolate Bars",44.05,-121.30,16,49],
    ["Wisconsin","1855 Coffeehouse","Mazomanie","1 Broadhead St","Chocolate Bars",43.17,-89.80,66,42],["Wisconsin","Babcock Dairy Store","Madison","1605 Linden Dr.","Chocolate Bars",43.08,-89.42,69,44],["Wisconsin","Bandit Coffee & tacos","Madison","640 W Washington Ave","Chocolate Bars",43.07,-89.39,69,44],["Wisconsin","Cambridge Market Cafe","Cambridge","217 W Main St.","Chocolate Bars",43.00,-89.02,72,46],["Wisconsin","Conscious Carnivore","Madison","3236A University Ave","Chocolate Bars",43.08,-89.44,69,44],["Wisconsin","Dancing Goat Distillery","Cambridge","909 Vineyard Drive","Chocolate Bars",43.01,-89.02,72,46],["Wisconsin","Finca Coffee","Madison","2500 Rimrock Rd.","Chocolate Bars",43.04,-89.38,69,45],["Wisconsin","Glas coffee","Green Bay; Shawano","228 N Adams St - Green Bay; 511 N Main St - Shawano","Chocolate Bars",44.52,-88.02,75,31],["Wisconsin","Green Grocer & Deli","Williams Bay","24 W Geneva St","Chocolate Bars",42.58,-88.54,73,52],["Wisconsin","Kavarna coffeehouse","Green Bay","143 N Broadway","Chocolate Bars",44.52,-88.02,75,31],["Wisconsin","Maker's market square","Mt Horeb","101 S Main St","Chocolate Bars",43.01,-89.74,67,46],["Wisconsin","Mc farland house cafe","McFarland","5923 Exchange St","Chocolate Bars",43.01,-89.29,70,46],["Wisconsin","Red Bank Coffeehouse","Two Rivers","1623 Washington St.","Chocolate Bars",44.15,-87.57,78,36],["Wisconsin","Ruby Coffee roasters","Nelsonville, Stevens Point","9489 1st St - Nelsonville; 1410 3rd St - Stevens Point","Chocolate Bars",44.52,-89.55,68,30],["Wisconsin","Seven Acre Dairy","Belleville","6858 Paoli Rd","Chocolate Bars",42.86,-89.54,68,48],["Wisconsin","superette","Madison","1874 E Washington Ave","Chocolate Bars",43.09,-89.36,69,44],["Wisconsin","Tati Coffee","Fitchburg","4889 Lacy Rd #101","Chocolate Bars",43.00,-89.43,69,46],["Wisconsin","Twisted Grounds","Madison","6067 Gemini Dr.","Chocolate Bars",43.13,-89.29,70,44],["Wisconsin","Vitruvian Farms","McFarland","2727 US Hwy 51","Chocolate Bars",42.98,-89.29,70,46],["Wisconsin","Wine Styles","Sun Prairie","2824 Prairie Lakes Dr #105","Chocolate Bars",43.17,-89.27,70,43],["Wisconsin","Wisco Boxes","Mt Horeb","305 E Main St","Chocolate Bars",43.01,-89.74,67,46]
  ],
  drinks: [
    ["Wisconsin","1855 Coffee house","Mazomaine","1 Broadhead St","Cacao Tea",43.17,-89.80,66,42],["Wisconsin","tati coffee","Fitchburg","4889 Lacy Rd #101","Cacao Tea",43.00,-89.43,69,46],["Wisconsin","Telsaan tea","Mount Horeb","108 E Main St","Cacao Tea",43.01,-89.74,67,46],["Wisconsin","Maker's Market Square","Mt Horeb","101 S. Main St","drinking chocolate",43.01,-89.74,67,46],["Wisconsin","seven acre dairy","Belleville","6858 Paoli Rd","drinking chocolate",42.86,-89.54,68,48]
  ],
  bulk: [
    ["Oregon","Not bread","Bend, Portland","Chocolate Chip Seed loaf","Bulk Chocolate",44.05,-121.32,16,49],["Oregon","Rachel's bakery","Bend","West Coast Babka","Bulk Chocolate",44.05,-121.32,16,49],["Wisconsin","Driftless Chocolates","Mt Horeb","Artisan Dark Truffles","Bulk Chocolate",43.01,-89.74,67,46],["Wisconsin","shift Cyclery","Eau Claire","Mochas and Hot Chocolate","Bulk Drinks",44.81,-91.50,62,32]
  ]
};

initNav();
initTransitions();
initReveals();
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
  if (!wipe || !window.gsap || reduceMotion) return;
  document.querySelectorAll("a[href^='/']").forEach((link) => {
    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href");
      if (!href || href === window.location.pathname) return;
      event.preventDefault();
      window.gsap.timeline({ onComplete: () => { window.location.href = href; } })
        .to(wipe, { height: "140vh", duration: .46, ease: "power2.inOut" });
    });
  });
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
  const type = document.body.dataset.locator;
  if (!app || !locations[type]) return;
  const data = locations[type].map(([state, name, city, address, category, lat, lng, x, y], id) => ({ id, state, name, city, address, category, lat, lng, x, y }));
  const states = ["All states", ...new Set(data.map((item) => item.state))];
  app.innerHTML = `
    <div class="locator-tools">
      <input id="locator-search" placeholder="Search by store, city, product, or address" aria-label="Search locations">
      <select id="state-filter" aria-label="Filter by state">${states.map((state) => `<option value="${state}">${state}</option>`).join("")}</select>
      <button class="button button-light" id="near-me" type="button">Store near me</button>
    </div>
    <p class="nearest-status" id="nearest-status">${data.length} locations loaded.</p>
    <div class="locator-layout">
      <div class="map-panel"><div class="map-canvas" id="map-canvas"><div class="map-info" id="map-info"><strong>Choose a sheep pin.</strong><p>Each pin opens a local store card with product details.</p></div></div></div>
      <div class="store-list" id="store-list" aria-live="polite"></div>
    </div>`;

  const search = app.querySelector("#locator-search");
  const stateFilter = app.querySelector("#state-filter");
  const list = app.querySelector("#store-list");
  const map = app.querySelector("#map-canvas");
  const info = app.querySelector("#map-info");
  const status = app.querySelector("#nearest-status");
  let activeId = data[0]?.id;
  let current = [...data];

  function draw() {
    const term = search.value.trim().toLowerCase();
    const state = stateFilter.value;
    current = data.filter((item) => (state === "All states" || item.state === state) && [item.name, item.city, item.address, item.category, item.state].join(" ").toLowerCase().includes(term));
    status.textContent = `${current.length} ${current.length === 1 ? "location" : "locations"} shown.`;
    list.innerHTML = current.map(cardMarkup).join("");
    map.querySelectorAll(".map-pin").forEach((pin) => pin.remove());
    current.forEach((item) => {
      const pin = document.createElement("button");
      pin.className = `map-pin${item.id === activeId ? " active" : ""}`;
      pin.style.left = `${item.x}%`;
      pin.style.top = `${item.y}%`;
      pin.type = "button";
      pin.setAttribute("aria-label", item.name);
      pin.addEventListener("click", () => setActive(item.id));
      map.append(pin);
    });
    if (!current.some((item) => item.id === activeId) && current[0]) activeId = current[0].id;
    updateInfo();
  }
  function cardMarkup(item) {
    return `<article class="store-card${item.id === activeId ? " active" : ""}" data-id="${item.id}" tabindex="0"><span class="store-icon"><span class="sheep-mark" aria-hidden="true"></span></span><div><h3>${item.name}</h3><p>${item.city}, ${item.state}</p><p>${item.address}</p><span class="tag">${item.category}</span></div></article>`;
  }
  function setActive(id) {
    activeId = id;
    draw();
    const card = list.querySelector(`[data-id="${id}"]`);
    if (card) card.scrollIntoView({ block: "nearest", behavior: reduceMotion ? "auto" : "smooth" });
  }
  function updateInfo() {
    const item = data.find((entry) => entry.id === activeId) || current[0];
    if (!item) return;
    info.innerHTML = `<strong>${item.name}</strong><p>${item.city}, ${item.state}<br>${item.address}</p><p>${item.category}</p>`;
    list.querySelectorAll(".store-card").forEach((card) => {
      card.addEventListener("click", () => setActive(Number(card.dataset.id)));
      card.addEventListener("keydown", (event) => { if (event.key === "Enter") setActive(Number(card.dataset.id)); });
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
      activeId = nearest.id;
      status.textContent = `Nearest result: ${nearest.name}, about ${Math.round(distance(here, nearest))} miles away.`;
      draw();
    }, () => { status.textContent = "Location permission was not granted. Search by city or state instead."; });
  });
  search.addEventListener("input", draw);
  stateFilter.addEventListener("change", draw);
  draw();
}

async function initThreeHero() {
  const canvas = document.querySelector("#hero-webgl");
  if (!canvas) return;
  try {
    const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js");
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, .1, 100);
    const clock = new THREE.Clock();
    const pointer = new THREE.Vector2();
    camera.position.set(0, 1.2, 8);
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    scene.add(new THREE.AmbientLight(0xfff0c6, .85));
    const light = new THREE.PointLight(0xffbf63, 55, 24);
    light.position.set(-3, 4, 5);
    scene.add(light);

    const river = new THREE.Mesh(
      new THREE.PlaneGeometry(18, 12, 96, 64),
      new THREE.ShaderMaterial({
        transparent: true,
        uniforms: { uTime: { value: 0 }, uMouse: { value: pointer } },
        vertexShader: `uniform float uTime; uniform vec2 uMouse; varying vec2 vUv; void main(){ vUv=uv; vec3 p=position; p.z += sin(p.x*1.2+uTime)*.22 + sin(p.y*2.4+uTime*1.4)*.16; p.x += sin(p.y*1.8+uTime)*.12; gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.0); }`,
        fragmentShader: `uniform float uTime; varying vec2 vUv; void main(){ float ribbon=sin((vUv.x+vUv.y*.35)*18.0+uTime*1.8)*.5+.5; vec3 dark=vec3(.08,.025,.012); vec3 warm=vec3(.36,.14,.055); vec3 shine=vec3(.9,.58,.26); vec3 color=mix(dark,warm,smoothstep(.2,1.,ribbon)); color=mix(color,shine,pow(ribbon,8.)*.32); float alpha=.72*smoothstep(0.,.18,vUv.y)*(1.-smoothstep(.92,1.,vUv.y)); gl_FragColor=vec4(color,alpha); }`
      })
    );
    river.rotation.x = -1.16;
    river.position.set(1.5, -2.3, -2);
    scene.add(river);

    const loader = new THREE.TextureLoader();
    const group = new THREE.Group();
    scene.add(group);
    ["/package.jpg", "/beans.jpg", "/bars.jpg"].forEach((src, i) => {
      const tex = loader.load(src);
      tex.colorSpace = THREE.SRGBColorSpace;
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(1.6, 1.08, .08), new THREE.MeshStandardMaterial({ map: tex, roughness: .5, metalness: .04 }));
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

    const nibs = new THREE.Points(new THREE.BufferGeometry(), new THREE.PointsMaterial({ color: 0xd59b3d, size: .035, transparent: true, opacity: .9 }));
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
