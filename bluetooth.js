const btn = document.querySelector(".bluetooth");

btn.addEventListener("click", connectToBluetoothDevice);

if (!navigator.bluetooth) {
  btn.remove();
}

async function connectToBluetoothDevice() {
  try {
    // Request a Bluetooth device
    const device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: false, // Set to true if you want to list all devices
      filters: [{ name: "YourDeviceName" }], // Replace with the target device name
      optionalServices: ["battery_service"], // Replace with your required service UUID
    });

    console.log("Device selected:", device.name);

    // Connect to the GATT server
    const server = await device.gatt.connect();
    console.log("Connected to GATT server");

    // Get a specific service
    const service = await server.getPrimaryService("battery_service"); // Replace with your service UUID

    // Get a characteristic from the service
    const characteristic = await service.getCharacteristic("battery_level"); // Replace with your characteristic UUID

    // Read value from the characteristic
    const value = await characteristic.readValue();
    const batteryLevel = value.getUint8(0); // Assuming the value is a single byte
    console.log("Battery level:", batteryLevel + "%");
  } catch (error) {
    console.error("Error connecting to Bluetooth device:", error);
  }
}
