
let fps = 0;
let startTime = Date.now();
let frame = 0;

function tick() {
  let time = Date.now();
  frame++;
  if (time - startTime > 1000) {
      fps = (frame / ((time - startTime) / 1000)).toFixed(1);
      startTime = time;
      frame = 0;
	}
  window.requestAnimationFrame(tick);
}
tick();
