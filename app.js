/**
 * Smart QR - 마우스 인터랙티브 그라데이션 및 메인 로직
 */

let qrCodeStyling = null;
let currentUrl = '';

// 마우스 인터랙티브 상태 (부드러운 보간 추적용)
const mouseState = {
  targetX: window.innerWidth / 2,
  targetY: window.innerHeight / 2,
  currentX: window.innerWidth / 2,
  currentY: window.innerHeight / 2,
  isMoving: false
};

document.addEventListener('DOMContentLoaded', () => {
  initLogoFallback();
  setupEventListeners();
  initInteractiveGradients();
});

/**
 * =========================================================
 * 마우스 위치에 따라 변하는 동적 인터랙티브 그라데이션 엔진
 * =========================================================
 */
function initInteractiveGradients() {
  const root = document.documentElement;
  const spotlight = document.getElementById('mouseSpotlight');
  const blob1 = document.getElementById('glowBlob1');
  const blob2 = document.getElementById('glowBlob2');
  const blob3 = document.getElementById('glowBlob3');

  // 마우스 이동 이벤트 감지 (데스크톱 & 모바일 터치)
  window.addEventListener('mousemove', (e) => {
    mouseState.targetX = e.clientX;
    mouseState.targetY = e.clientY;
    mouseState.isMoving = true;
  });

  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      mouseState.targetX = e.touches[0].clientX;
      mouseState.targetY = e.touches[0].clientY;
      mouseState.isMoving = true;
    }
  }, { passive: true });

  // 60fps 부드러운 LERP(선형 보간) 렌더링 루프
  function renderGradientLoop() {
    // 부드러운 지연 추적 (0.07 계수)
    mouseState.currentX += (mouseState.targetX - mouseState.currentX) * 0.07;
    mouseState.currentY += (mouseState.targetY - mouseState.currentY) * 0.07;

    const w = window.innerWidth || 1920;
    const h = window.innerHeight || 1080;

    const xRatio = Math.max(0, Math.min(1, mouseState.currentX / w));
    const yRatio = Math.max(0, Math.min(1, mouseState.currentY / h));

    // 마우스 좌표에 따른 색조(Hue) 계산 (210° ~ 340° 부드러운 영롱한 스펙트럼)
    // X축: 인디고 -> 바이올렛 -> 핑크
    // Y축: 딥블루 -> 시안 -> 마젠타
    const hue1 = Math.round(220 + xRatio * 60 + yRatio * 20);     // 220 ~ 300 (블루 -> 인디고 -> 퍼플)
    const hue2 = Math.round(270 + yRatio * 55 + xRatio * 25);     // 270 ~ 350 (퍼플 -> 마젠타 -> 로즈)
    const hue3 = Math.round(180 + (xRatio + yRatio) * 45);        // 180 ~ 270 (청록/에메랄드 -> 스카이 -> 바이올렛)

    // CSS 루트 변수에 실시간 반영
    root.style.setProperty('--mouse-x', `${mouseState.currentX}px`);
    root.style.setProperty('--mouse-y', `${mouseState.currentY}px`);
    root.style.setProperty('--hue-1', `${hue1}`);
    root.style.setProperty('--hue-2', `${hue2}`);
    root.style.setProperty('--hue-3', `${hue3}`);

    // 마우스 스포트라이트 위치 업데이트
    if (spotlight) {
      spotlight.style.left = `${mouseState.currentX}px`;
      spotlight.style.top = `${mouseState.currentY}px`;
    }

    // 배경 블러 오브젝트 패럴랙스 미세 이동 (역동적인 깊이감)
    if (blob1) {
      const offsetX1 = (xRatio - 0.5) * 80;
      const offsetY1 = (yRatio - 0.5) * 80;
      blob1.style.transform = `translate(${offsetX1}px, ${offsetY1}px)`;
    }
    if (blob2) {
      const offsetX2 = (0.5 - xRatio) * 90;
      const offsetY2 = (0.5 - yRatio) * 90;
      blob2.style.transform = `translate(${offsetX2}px, ${offsetY2}px)`;
    }
    if (blob3) {
      const offsetX3 = (xRatio - 0.5) * 50;
      const offsetY3 = (0.5 - yRatio) * 60;
      blob3.style.transform = `translate(${offsetX3}px, ${offsetY3}px)`;
    }

    requestAnimationFrame(renderGradientLoop);
  }

  requestAnimationFrame(renderGradientLoop);
}

/**
 * logo.png 파일이 로컬 폴더에 아직 없을 때
 * 깨짐 대신 세련된 벡터 캔버스 로고를 동적으로 생성하여 보여줌
 */
function initLogoFallback() {
  const logoImg = document.getElementById('siteLogo');
  const fallback = document.getElementById('logoFallback');

  logoImg.addEventListener('error', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 100;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');

    const grad = ctx.createLinearGradient(0, 0, 100, 100);
    grad.addColorStop(0, '#6366f1');
    grad.addColorStop(1, '#a855f7');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(0, 0, 100, 100, 24);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    // 마커 1
    ctx.beginPath();
    ctx.roundRect(16, 16, 28, 28, 7);
    ctx.fill();
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.roundRect(22, 22, 16, 16, 4);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(26, 26, 8, 8, 2);
    ctx.fill();

    // 마커 2
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(56, 16, 28, 28, 7);
    ctx.fill();
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.roundRect(62, 22, 16, 16, 4);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(66, 26, 8, 8, 2);
    ctx.fill();

    // 마커 3
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(16, 56, 28, 28, 7);
    ctx.fill();
    ctx.fillStyle = '#6366f1';
    ctx.beginPath();
    ctx.roundRect(22, 62, 16, 16, 4);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(26, 66, 8, 8, 2);
    ctx.fill();

    // 포인트
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.roundRect(56, 56, 12, 12, 3);
    ctx.roundRect(72, 72, 12, 12, 3);
    ctx.fill();

    logoImg.src = canvas.toDataURL('image/png');
    logoImg.classList.remove('hidden');
    fallback.classList.add('hidden');
  });
}

/**
 * 폼 전송 및 클릭 이벤트 리스너 설정
 */
function setupEventListeners() {
  const form = document.getElementById('qrForm');
  const urlInput = document.getElementById('urlInput');
  const qrCard = document.getElementById('qrCard');

  // [요구사항 4] URL 입력 후 확인(또는 Enter) 시
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const rawVal = urlInput.value.trim();
    if (!rawVal) return;

    let targetUrl = rawVal;
    if (!/^https?:\/\//i.test(targetUrl)) {
      targetUrl = 'https://' + targetUrl;
    }

    generateAndTransition(targetUrl);
  });

  // [요구사항 5] QR 코드 카드 클릭 시 JPG 파일로 다운로드
  qrCard.addEventListener('click', () => {
    downloadQRAsJpg();
  });
}

/**
 * [요구사항 4] 정중앙에 세련된 QR 코드 생성 및 URL 창 하단 이동 트랜지션
 */
function generateAndTransition(url) {
  currentUrl = url;
  const wrapper = document.getElementById('qrCodeWrapper');
  const qrContainer = document.getElementById('qrContainer');

  wrapper.innerHTML = '';

  // 프리미엄 디자인 옵션을 적용한 QRCodeStyling 인스턴스 생성
  qrCodeStyling = new QRCodeStyling({
    width: 300,
    height: 300,
    type: 'svg',
    data: url,
    dotsOptions: {
      color: '#1e1b4b', // 세련된 딥 네이비
      type: 'rounded'   // 현대적인 라운드 도트
    },
    backgroundOptions: {
      color: '#ffffff'
    },
    cornersSquareOptions: {
      color: '#4338ca', // 인디고 액센트 모서리
      type: 'extra-rounded'
    },
    cornersDotOptions: {
      color: '#4f46e5',
      type: 'dot'
    },
    qrOptions: {
      errorCorrectionLevel: 'Q' // 견고한 오류 정정
    }
  });

  qrCodeStyling.append(wrapper);

  // 컨테이너 표시 및 하단 이동 클래스 추가
  qrContainer.classList.remove('hidden');
  requestAnimationFrame(() => {
    document.body.classList.add('has-qr');
  });

  showToast('스마트 QR이 생성되었습니다! 클릭하여 JPG로 저장하세요.');
}

/**
 * [요구사항 5] QR 코드 클릭 시 순백색 배경의 고화질 .jpg 파일로 다운로드
 */
async function downloadQRAsJpg() {
  if (!qrCodeStyling) {
    showToast('다운로드할 QR 코드가 생성되지 않았습니다.', 'error');
    return;
  }

  try {
    const exportInstance = new QRCodeStyling({
      ...qrCodeStyling._options,
      width: 600,
      height: 600,
      type: 'canvas'
    });

    const rawBlob = await exportInstance.getRawData('png');
    if (!rawBlob) throw new Error('Blob generation failed');

    const img = new Image();
    const blobUrl = URL.createObjectURL(rawBlob);

    img.onload = () => {
      const finalCanvas = document.createElement('canvas');
      const size = 700; // 여백 포함 700x700 고해상도
      const margin = 50;

      finalCanvas.width = size;
      finalCanvas.height = size;
      const ctx = finalCanvas.getContext('2d');

      // 완벽한 화이트 배경 채우기
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      // 중앙에 QR 코드 그리기
      ctx.drawImage(img, margin, margin, size - margin * 2, size - margin * 2);

      // JPEG 포맷 Data URL 추출 (최상급 품질 0.96)
      const jpgUrl = finalCanvas.toDataURL('image/jpeg', 0.96);

      // 다운로드 트리거
      const downloadLink = document.createElement('a');
      downloadLink.href = jpgUrl;
      downloadLink.download = `smart-qr-${Date.now()}.jpg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(blobUrl);
      showToast('고화질 JPG 파일로 다운로드되었습니다!');
    };

    img.src = blobUrl;
  } catch (err) {
    console.error('다운로드 오류:', err);
    showToast('JPG 다운로드 중 문제가 발생했습니다.', 'error');
  }
}

/**
 * 플로팅 토스트 피드백 알림
 */
let toastTimeout;
function showToast(message, type = 'success') {
  clearTimeout(toastTimeout);
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toastMsg');
  const iconWrapper = document.getElementById('toastIconWrapper');
  const iconEl = document.getElementById('toastIcon');

  msgEl.textContent = message;

  if (type === 'error') {
    iconWrapper.className = 'w-7 h-7 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center text-sm border border-rose-500/30';
    iconEl.className = 'fa-solid fa-triangle-exclamation';
  } else {
    iconWrapper.className = 'w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm border border-emerald-500/30';
    iconEl.className = 'fa-solid fa-check';
  }

  toast.classList.remove('opacity-0', 'translate-y-24', 'pointer-events-none');

  toastTimeout = setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-y-24', 'pointer-events-none');
  }, 2600);
}
