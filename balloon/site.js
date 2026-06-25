const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

initNav();
initGallery();
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
  close.addEventListener("click", () => { lightbox.hidden = true; image.removeAttribute("src"); });
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) close.click();
  });
  window.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !lightbox.hidden) close.click();
  });
}

async function initBalloonScene() {
  const canvas = document.querySelector("#balloon-gl");
  if (!canvas) return;
  try {
    const THREE = await import("https://cdn.jsdelivr.net/npm/three@0.165.0/build/three.module.js");
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, .1, 100);
    const clock = new THREE.Clock();
    const pointer = new THREE.Vector2();
    camera.position.set(0, 0, 10);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    scene.add(new THREE.AmbientLight(0xffffff, 1.8));
    const light = new THREE.DirectionalLight(0xffffff, 2.2);
    light.position.set(3, 4, 6);
    scene.add(light);

    const colors = [0x1596d4, 0xf15a1d, 0xf4b31e, 0x7a4ab0, 0x18a999, 0x58b947, 0xff77ad];
    const group = new THREE.Group();
    scene.add(group);

    for (let i = 0; i < 28; i++) {
      const material = new THREE.MeshPhysicalMaterial({
        color: colors[i % colors.length],
        roughness: .22,
        metalness: 0,
        clearcoat: 1,
        clearcoatRoughness: .08,
        transparent: true,
        opacity: .34
      });
      const mesh = new THREE.Mesh(new THREE.CapsuleGeometry(.16 + (i % 5) * .018, 1.15 + (i % 7) * .12, 6, 18), material);
      mesh.position.set((Math.random() - .5) * 12, (Math.random() - .5) * 7, -Math.random() * 5);
      mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, Math.random() * Math.PI);
      mesh.userData = {
        base: mesh.position.clone(),
        spin: .12 + Math.random() * .28,
        bob: .4 + Math.random() * .9
      };
      group.add(mesh);
    }

    const knots = new THREE.Points(
      new THREE.BufferGeometry(),
      new THREE.PointsMaterial({ color: 0x148f9d, size: .035, transparent: true, opacity: .45 })
    );
    const positions = new Float32Array(220 * 3);
    for (let i = 0; i < 220; i++) {
      positions[i * 3] = (Math.random() - .5) * 14;
      positions[i * 3 + 1] = (Math.random() - .5) * 8;
      positions[i * 3 + 2] = -Math.random() * 8;
    }
    knots.geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    scene.add(knots);

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
        mesh.position.x = mesh.userData.base.x + Math.sin(time * mesh.userData.bob + i) * .2;
        mesh.position.y = mesh.userData.base.y + Math.cos(time * mesh.userData.bob + i * .7) * .28;
        mesh.rotation.x += .002 * mesh.userData.spin;
        mesh.rotation.y += .003 * mesh.userData.spin;
      });
      group.rotation.y += ((pointer.x * .25) - group.rotation.y) * .035;
      group.rotation.x += ((-pointer.y * .16) - group.rotation.x) * .035;
      knots.rotation.y = time * .035;
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    resize();
    render();
  } catch (error) {
    console.warn("Three.js background unavailable.", error);
  }
}
