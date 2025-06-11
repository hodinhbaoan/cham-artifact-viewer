const artifactMap = {
  'Cham_01': 'html1.html',
  'Cham_02': 'html2.html',
  'CHAM01': 'html1.html',
  'CHAM02': 'html2.html'
};

document.getElementById('bleButton').addEventListener('click', scanForBeacons);
document.getElementById('qrButton').addEventListener('click', startQrScanner);

async function scanForBeacons() {
  try {
    const device = await navigator.bluetooth.requestDevice({
      filters: [{ namePrefix: 'Cham_' }]
    });
    if (artifactMap[device.name]) {
      window.location.href = artifactMap[device.name];
    } else {
      alert('No content for beacon: ' + device.name);
    }
  } catch {
    alert('BLE scan cancelled or not supported.');
  }
}

let html5QrcodeScanner;

function startQrScanner() {
  const reader = document.getElementById('reader');
  const resultBox = document.getElementById('qr-result');
  reader.style.display = 'block';
  resultBox.textContent = '📷 Point camera to QR code';

  if (html5QrcodeScanner) {
    html5QrcodeScanner.clear();
  }

  html5QrcodeScanner = new Html5Qrcode("reader");

  html5QrcodeScanner.start(
    { facingMode: "environment" },
    { fps: 10, qrbox: 250 },
    qrCodeMessage => {
      if (artifactMap[qrCodeMessage]) {
        html5QrcodeScanner.stop();
        window.location.href = artifactMap[qrCodeMessage];
      } else {
        resultBox.textContent = 'Unknown QR code: ' + qrCodeMessage;
      }
    },
    errorMessage => {
      // ignore scan errors
    }
  ).catch(err => alert('QR scanner error: ' + err));
}
