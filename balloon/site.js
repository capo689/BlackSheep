const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

initNav();
initGallery();
initReveals();
if (!reduceMotion) initBalloonScene();

function initNav() {
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".site-nav");
  if (!toggle || !nav) return;

  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open));
  });

  nav.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle.setAttribute("aria-expanded", "false");
  }));
}

function initGallery() {
  const lightbox = document.querySelector("#lightbox");
  if (!lightbox) return;

  const image = lightbox.querySelector("img");
  const close = lightbox.querySelector("button");

  document.querySelectorAll(".gallery-grid button").forEach((button) => {
    button.addEventListener("click", () => {
      image.src = button.dataset.full;
      image.alt = button.querySelector("img").alt;
      lightbox.hidden = false;
      close.focus();
    });
  });

  close.addEventListener("click", () => {
    lightbox.hidden = true;
    image.removeAttribute("src");
  });

  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close.click();
  });

  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) close.click();
  });
}

function initReveals() {
  const targets = document.querySelectorAll(".why-grid article, .service-cards article, .gallery-grid button, .booking-form, .review-card, .faq details");
  if (!targets.length) return;

  targets.forEach((target) => target.classList.add("reveal"));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: .12 });

  targets.forEach((target) => observer.observe(target));
}

async function initBalloonScene() {
  const canvas = document.querySelector("#balloon-gl");
  if (!canvas) return;

  try {
    const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js");
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1, .1, 100);
    const clock = new THREE.Clock();
    const pointer = new THREE.Vector2();
    camera.position.set(0, 0, 10);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const group = new THREE.Group();
    scene.add(group);
    scene.add(new THREE.AmbientLight(0xffffff, 2));

    const colors = [0x1297a6, 0xf05a17, 0x081f57, 0x6f3aa2];
    for (let i = 0; i < 18; i++) {
      const curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-.8, 0, 0),
        new THREE.Vector3(-.25, .22 + Math.random() * .22, 0),
        new THREE.Vector3(.28, -.2 - Math.random() * .16, 0),
        new THREE.Vector3(.8, .04, 0)
      ]);
      const geometry = new THREE.TubeGeometry(curve, 28, .018 + Math.random() * .01, 8, false);
      const material = new THREE.MeshBasicMaterial({
        color: colors[i % colors.length],
        transparent: true,
        opacity: .18
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set((Math.random() - .5) * 12, (Math.random() - .5) * 7, -2 - Math.random() * 5);
      mesh.rotation.z = Math.random() * Math.PI;
      mesh.scale.setScalar(.8 + Math.random() * 1.8);
      mesh.userData = {
        base: mesh.position.clone(),
        drift: .15 + Math.random() * .25,
        spin: (Math.random() - .5) * .002
      };
      group.add(mesh);
    }

    function resize() {
      const width = window.innerWidth;
      const height = window.innerHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    window.addEventListener("pointermove", (event) => {
      pointer.x = event.clientX / window.innerWidth - .5;
      pointer.y = event.clientY / window.innerHeight - .5;
    }, { passive: true });

    window.addEventListener("resize", resize, { passive: true });

    function render() {
      const time = clock.getElapsedTime();
      group.children.forEach((mesh, i) => {
        mesh.position.x = mesh.userData.base.x + Math.sin(time * mesh.userData.drift + i) * .12;
        mesh.position.y = mesh.userData.base.y + Math.cos(time * mesh.userData.drift + i * .8) * .1;
        mesh.rotation.z += mesh.userData.spin;
      });
      group.rotation.y += (pointer.x * .08 - group.rotation.y) * .035;
      group.rotation.x += (-pointer.y * .05 - group.rotation.x) * .035;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }

    resize();
    render();
  } catch (error) {
    console.warn("Three.js accent layer unavailable.", error);
  }
}
