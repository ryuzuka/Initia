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
