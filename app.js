// DOMContentLoaded ensures the HTML is loaded before script runs
window.addEventListener('DOMContentLoaded', () => {

  // Artifact mapping (BLE only)
  const artifactMap = {
    'Cham_01': 'html1.html',
    'Cham_02': 'html2.html',
    'CHAM01': 'html1.html',
    'CHAM02': 'html2.html'
  };

  // BLE SCAN
  document.getElementById('bleButton').addEventListener('click', async () => {
    try {
      const device = await navigator.bluetooth.requestDevice({
        filters: [{ namePrefix: 'Cham_' }]
      });

      if (artifactMap[device.name]) {
        window.location.href = artifactMap[device.name];
      } else {
        alert('No content found for: ' + device.name);
      }
    } catch {
      alert('BLE scan cancelled or failed.');
    }
  });

  // QR SCAN
  let html5QrcodeScanner;

  document.getElementById('qrButton').addEventListener('click', () => {
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
      msg => {
        html5QrcodeScanner.stop().then(() => {
          reader.style.display = 'none';
          resultBox.textContent = '✅ QR recognized, opening...';
          window.location.href = msg; // Auto jump to scanned link
        });
      },
      err => {
        // You can add console.log(err) if needed
      }
    ).catch(e => alert('QR scanner error: ' + e));
  });

  // LANGUAGE SYSTEM
  const translations = {
    en: {
      header: "Cham Museum",
      langLabel: "🌐 Choose Language:",
      title: "Welcome!",
      desc: "Tap BLE or QR to get exhibit info.",
      bleButton: "📶 Scan BLE",
      qrButton: "📷 Scan QR"
    },
    vi: {
      header: "Bảo tàng Chăm",
      langLabel: "🌐 Chọn ngôn ngữ:",
      title: "Chào mừng!",
      desc: "Chạm vào BLE hoặc mã QR để xem thông tin hiện vật.",
      bleButton: "📶 Quét BLE",
      qrButton: "📷 Quét mã QR"
    },
    ko: {
      header: "참 박물관",
      langLabel: "🌐 언어 선택:",
      title: "환영합니다!",
      desc: "BLE 또는 QR을 탭하여 전시 정보 보기",
      bleButton: "📶 BLE 스캔",
      qrButton: "📷 QR 스캔"
    },
    zh: {
      header: "占族博物馆",
      langLabel: "🌐 选择语言:",
      title: "欢迎！",
      desc: "点击 BLE 或二维码以获取展品信息",
      bleButton: "📶 扫描 BLE",
      qrButton: "📷 扫描二维码"
    }
  };

  function updateLanguage(lang) {
    const t = translations[lang] || translations.en;
    document.getElementById("header").textContent = t.header;
    document.getElementById("lang-label").textContent = t.langLabel;
    document.getElementById("title").textContent = t.title;
    document.getElementById("desc").textContent = t.desc;
    document.getElementById("bleButton").textContent = t.bleButton;
    document.getElementById("qrButton").textContent = t.qrButton;
  }

  document.getElementById("language").addEventListener("change", function () {
    updateLanguage(this.value);
  });

  updateLanguage("en"); // Default on load

});
