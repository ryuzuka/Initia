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
  let scrollY = 0
  let textTop = []
  let visualText = Array.from(document.getElementsByClassName('animate')).map((el, index) => {
    let textEl = el.parentElement
    textTop[index] = textEl.offsetTop
    Object.assign(textEl.style, {
      transition: '.5s ease-out 0s',
      transform: 'translate3d(0px, 0px, 0px)'
    })
    return textEl
  })

  window.addEventListener('resize', e => {
    scrollY = e.currentTarget.scrollY
    textTop = visualText.map(el => el.offsetTop)
  })

  window.addEventListener('scroll', e => {
    scrollY = e.currentTarget.scrollY
    transform()
  })

  function transform () {
    visualText.forEach((el, index) => {
      let min = Math.round(-1.2 * visualText[index].clientWidth)
      let max = Math.round(window.innerWidth)

      let outX = (index % 2) ? min : max
      let translateX = Math.ceil(outX / textTop[index] * scrollY)
      if (translateX < min) {
        translateX = min
      } else if (translateX > max) {
        translateX = max
      }

      let opacity = Math.ceil(-100 / (textTop[index] / 2) * scrollY + 100)
      if (opacity < 0) {
        opacity = 0
      } else if (opacity > 100) {
        opacity = 100
      }

      el.style.transform = `translate3d(${translateX}px, 0px, 0px)`
      el.style.opacity = opacity * 0.01
    })
  }
})()
