const btn = document.querySelector(".bluetooth");

btn.addEventListener("click", connectToBluetoothDevice);

if (!navigator.bluetooth) {
  btn.remove();
}

async function connectToBluetoothDevice() {
  try {
    // Request a Bluetooth device
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
    });
  } catch (e) {
    console.log(e);
  }
}
