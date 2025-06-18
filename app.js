const artifactMap = {
  'Cham_01': 'html1.html',
  'Cham_02': 'html2.html',
  'CHAM01': 'html1.html',
  'CHAM02': 'html2.html'
};

// Buttons
document.getElementById('bleButton').addEventListener('click', scanForBeacons);
document.getElementById('qrButton').addEventListener('click', startQrScanner);

// BLE scan
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

// QR scan
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
    { facingMode: "environment" }, // back camera
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

// Translation system
const translations = {
  en: {
    title: "Welcome!",
    desc: "Tap BLE or QR to get exhibit info."
  },
  vi: {
    title: "Chào mừng!",
    desc: "Chạm vào BLE hoặc mã QR để xem thông tin hiện vật."
  },
  ko: {
    title: "환영합니다!",
    desc: "BLE 또는 QR을 탭하여 전시 정보 보기"
  },
  zh: {
    title: "欢迎！",
    desc: "点击 BLE 或二维码以获取展品信息"
  }
};

function updateLanguage(lang) {
  const langData = translations[lang] || translations.en;
  document.getElementById("title").textContent = langData.title;
  document.getElementById("desc").textContent = langData.desc;
}

document.getElementById("language").addEventListener("change", function () {
  updateLanguage(this.value);
});

updateLanguage("en"); // default
