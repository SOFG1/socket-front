const HOST =
  location.hostname !== "sofg1.github.io"
    ? "192.168.100.101:3000"
    : "https://socket-psli.onrender.com";

const socket = io(HOST);
window.socket = socket;

const delayWithMobile = 150;
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

let soundInterval;

window.settings = {
  speed: "3000",
};

const startBtn = document.querySelector(".start");
const stopBtn = document.querySelector(".stop");
const input = document.querySelector(".number");
let circleElement = document.querySelector(".circle");

startBtn.addEventListener("click", (e) => {
  socket.emit("start", "start");
});

stopBtn.addEventListener("click", (e) => {
  socket.emit("stop", "stop");
});

socket.on("start", () => {
  if(window.isHost) {
    const d = JSON.stringify({
      action: "start",
    })
    sendMessage(d)
  }
  start()
});

socket.on("stop", () => {
  if(window.isHost) {
    const d = JSON.stringify({
      action: "stop",
    })
    sendMessage(d)
  }
  stop()
});

socket.on("settings", (arg) => {
  if(window.isHost) {
    const d = JSON.stringify({
      action: "settings",
      data: arg
    })
    sendMessage(d)
  }
  setSettings(arg)
});


async function start() {
  startBtn.setAttribute("disabled", true);
  stopBtn?.removeAttribute("disabled");
  restartAnimation();
  const duration = window.settings.speed;
  circleElement.style.animationDuration = `${duration}ms`;
  clearInterval(soundInterval);
  soundInterval = setInterval(playAudio, duration / 2);
}

function stop() {
  startBtn?.removeAttribute("disabled");
  stopBtn?.setAttribute("disabled", true);
  circleElement.classList.remove("started");
  clearInterval(soundInterval);
}

function playAudio() {
  if (!circleElement.classList.contains("started")) return;
  const audio = new Audio("1.wav");
  audio.play();
}

function restartAnimation() {
  circleElement.remove();
  circleElement = document.createElement("div");
  document.body.append(circleElement);
  circleElement.classList.add("circle");
  circleElement.classList.add("started");
}

window.setSettings = function(arg) {
  window.settings = arg;
  start();
  input.value = arg.speed;
}

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