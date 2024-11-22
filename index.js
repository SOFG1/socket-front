const socket = io("https://socket-psli.onrender.com/");
window.socket = socket;

window.settings = {
  speed: "3000",
};

const startBtn = document.querySelector(".start");
const stopBtn = document.querySelector(".stop");

const input = document.querySelector(".number");

startBtn.addEventListener("click", (e) => {
  socket.emit("session", "start");
});

stopBtn.addEventListener("click", (e) => {
  socket.emit("session", "stop");
});

socket.on("session", (arg) => {
  if (arg === "start") {
    startBtn.setAttribute("disabled", true);
    stopBtn?.removeAttribute("disabled");
    window.start();
  }
  if (arg === "stop") {
    document.querySelector(".started")?.remove();
    const el = document.createElement("div");
    el.classList.add("circle");
    el.classList.add("static");
    document.body.appendChild(el);
    startBtn?.removeAttribute("disabled");
    stopBtn?.setAttribute("disabled", true);
  }
});

//Settings

input?.addEventListener("change", (e) => {
  const regex = /^\d+$/;
  const val = e.target.value;
  if (!regex.test(val)) {
    e.target.value = settings.speed;
    return;
  }
  const num = Number(val);
  if (num < 3000 || num > 8000) {
    e.target.value = settings.speed;
    return;
  }
  settings.speed = e.target.value;
  socket.emit("settings", settings);
});

socket.on("settings", (arg) => {
  settings = arg;
  // input.value = settings.speed;
});

window.start = function start() {
  document.querySelector(".circle")?.remove(); //Remove static
  const el = document.createElement("div");
  el.classList.add("circle");
  el.classList.add("started");
  document.body.appendChild(el);
  const duration = window.settings.speed;
  el.style.animationDuration = `${duration}ms`;
  el.classList.add("started");
  setTimeout(playAudio, duration * 0.25);
  setTimeout(playAudio, duration * 0.75);
};

function playAudio() {
  if (!document.querySelector(".started")) return;
  const audio = new Audio("1.wav");
  audio.play();
}
