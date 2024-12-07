let peers = {} //use these if host device

window.receiveMessage = function(data) {
  const decoder = new TextDecoder();
  const string = decoder.decode(data);
  const obj = JSON.parse(string)
  if(obj.action === "start") start()
  if(obj.action === "stop") stop()
  if(obj.action === "settings") setSettings(obj.data)
}

window.sendMessage =  function(data) {
  const list = Object.values(peers)
  list.forEach(p => p.send(data))
}

document.querySelector(".peer").addEventListener("click", () => sendMessage("data"))


socket.on("connection-started", (d) => {
  const isHost = d.indexOf(socket.id) === 0
  window.isHost = isHost
  if(isHost) {
    createInitiatorPeers(d.slice(1))
  }
  if(!isHost) {
    createSinglePeer(socket.id)
  }
})

function createSinglePeer(socketId) {
  const p = new SimplePeer({ initiator: false, trickle: false })
  peers = {
    [socketId]: p
  }
  p.on("signal", (data) => {
    socket.emit("signal", {id: socketId, data})
  })
  p.on("data", receiveMessage)
  p.on('connect', () => {
    console.log('Single Peer connected!');
  });
}

function createInitiatorPeers(ids) {
  const list = {}
  ids.forEach(id => {
    const p = new SimplePeer({ initiator: true, trickle: false });
    list[id] = p
    p.on("signal", (data) => {
      socket.emit("signal", {id, data})
    })
    p.on("data", receiveMessage)
    p.on('connect', () => {
      console.log('Peer connected!');
    });
  })
  peers = list
}

socket.on("signal", ({id, data}) => {
  peers[id]?.signal(data)
})