const textLines = document.querySelectorAll(".animate");

const animateText = (textLine) => {
  const characters = textLine.textContent.split("");
  textLine.textContent = "";

  characters.forEach((char, i) => {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.animationDelay = `${i * 50}ms`;
    textLine.append(span);
  });
};

textLines.forEach((textLine) => {
  const textLineSpans = textLine.querySelectorAll("span");
  textLineSpans.forEach((span) => {
    span.classList.add("animate--active");
  });
  animateText(textLine);
});

(function () {
  let scrollY = 0;
  let textTop = [];
  let visualText = Array.from(document.getElementsByClassName("animate")).map(
    (el, index) => {
      let textEl = el.parentElement;
      textTop[index] = textEl.offsetTop;
      Object.assign(textEl.style, {
        transition: ".5s ease-out 0s",
        transform: "translate3d(0px, 0px, 0px)",
      });
      return textEl;
    }
  );

  window.addEventListener("resize", (e) => {
    scrollY = e.currentTarget.scrollY;
    textTop = visualText.map((el) => el.offsetTop);
    transform();
  });

  window.addEventListener("scroll", (e) => {
    scrollY = e.currentTarget.scrollY;
    transform();
  });

  function transform() {
    visualText.forEach((el, index) => {
      let min = Math.round(-3.5 * visualText[index].clientWidth);
      let max = Math.round(window.innerWidth);

      let outX = index % 2 ? min : max;
      let translateX = Math.ceil(
        (outX / textTop[textTop.length - 1]) * scrollY
      );
      if (translateX < min) {
        translateX = min;
      } else if (translateX > max) {
        translateX = max;
      }
      el.style.transform = `translate3d(${translateX}px, 0px, 0px)`;

      // let opacity = Math.ceil(-100 / (textTop[textTop.length - 1]) * scrollY + 100)
      // if (opacity < 0) {
      //   opacity = 0
      // } else if (opacity > 100) {
      //   opacity = 100
      // }
      // el.style.opacity = opacity * 0.01
    });
  }
})();

// Set up the scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0x000000, 1);
document.getElementById("canvas_wrap").appendChild(renderer.domElement);

// Create the cube geometry and material
const geometry = new THREE.BoxGeometry(3, 3, 3);
const material = new THREE.LineBasicMaterial({ color: 0xffffff });

// Create the cube wireframe edges and add them to the scene
const edges = new THREE.EdgesGeometry(geometry);
const wireframe = new THREE.LineSegments(edges, material);
scene.add(wireframe);

// Animate the wireframe cube
function animate() {
  requestAnimationFrame(animate);
  wireframe.rotation.x += 0.01;
  wireframe.rotation.y += 0.01;
  renderer.render(scene, camera);
}
animate();
