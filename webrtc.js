socket.on("device", (d) => {
  if (d === "mobile") {
    startCall();
  }
});

let localConnection;
let remoteConnection;
let sendChannel;
let receiveChannel;

socket.on("offer", handleOffer);
socket.on("answer", handleAnswer);
socket.on("ice-candidate", handleIceCandidate);

function startCall() {
  localConnection = new RTCPeerConnection();
  sendChannel = localConnection.createDataChannel("sendChannel");

  sendChannel.onopen = () => console.log("Data channel opened");
  sendChannel.onclose = () => console.log("Data channel closed");

  localConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", event.candidate);
    }
  };

  // Create an offer
  localConnection
    .createOffer()
    .then((offer) => {
      localConnection.setLocalDescription(offer);
      socket.emit("offer", offer);
    })
    .catch((error) => console.error("Error creating offer: ", error));
}

function handleOffer(offer) {
  remoteConnection = new RTCPeerConnection();
  remoteConnection.onicecandidate = (event) => {
    if (event.candidate) {
      socket.emit("ice-candidate", event.candidate);
    }
  };

  remoteConnection
    .setRemoteDescription(new RTCSessionDescription(offer))
    .then(() => {
      return remoteConnection.createAnswer();
    })
    .then((answer) => {
      remoteConnection.setLocalDescription(answer);
      socket.emit("answer", answer);
    })
    .catch((error) => console.error("Error handling offer: ", error));

  remoteConnection.ondatachannel = (event) => {
    receiveChannel = event.channel;
    receiveChannel.onmessage = (event) => {
      const message = event.data;
      const newMessage = document.createElement("div");
      newMessage.textContent = `Received: ${message}`;
      messagesDiv.appendChild(newMessage);
    };
  };
}

function handleAnswer(answer) {
  localConnection
    .setRemoteDescription(new RTCSessionDescription(answer))
    .catch((error) => console.error("Error handling answer: ", error));
}

function handleIceCandidate(candidate) {
  const iceCandidate = new RTCIceCandidate(candidate);
  if (localConnection) {
    localConnection
      .addIceCandidate(iceCandidate)
      .catch((error) => console.error("Error adding ICE candidate: ", error));
  } else {
    remoteConnection
      .addIceCandidate(iceCandidate)
      .catch((error) => console.error("Error adding ICE candidate: ", error));
  }
}

function sendMessage() {
  if (sendChannel?.readyState === "open") {
    sendChannel.send("t");
  }
}

window.sendMessage = sendMessage;
