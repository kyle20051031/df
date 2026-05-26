const videoElement = document.getElementById('input_video');
const canvasElement = document.getElementById('output_canvas');
const canvasCtx = canvasElement.getContext('2d');
const startButton = document.getElementById('start_button');
const stopButton = document.getElementById('stop_button');
const expressionLabel = document.getElementById('expression_label');
const voiceFeedbackLabel = document.getElementById('voice_feedback');

let camera = null;
let lastExpression = '';
let lastSpeakTime = 0;

function speak(message) {
  if (!window.speechSynthesis) return;
  const now = Date.now();
  if (now - lastSpeakTime < 2500 && message === voiceFeedbackLabel.textContent) return;
  lastSpeakTime = now;
  voiceFeedbackLabel.textContent = message;
  const utterance = new SpeechSynthesisUtterance(message);
  utterance.lang = 'zh-TW';
  utterance.rate = 1;
  utterance.pitch = 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}

function normalizePoint(point) {
  return { x: point.x * canvasElement.width, y: point.y * canvasElement.height };
}

function computeSmileScore(landmarks) {
  const leftCorner = landmarks[61];
  const rightCorner = landmarks[291];
  const topLip = landmarks[13];
  const bottomLip = landmarks[14];
  const leftEye = landmarks[33];
  const rightEye = landmarks[263];

  const mouthWidth = Math.hypot(leftCorner.x - rightCorner.x, leftCorner.y - rightCorner.y);
  const mouthHeight = Math.hypot(topLip.x - bottomLip.x, topLip.y - bottomLip.y);
  const eyeDistance = Math.hypot(leftEye.x - rightEye.x, leftEye.y - rightEye.y);

  const ratio = mouthWidth / (mouthHeight + 0.0001);
  const openness = mouthHeight / (eyeDistance + 0.0001);

  return { ratio, openness };
}

function getExpression(landmarks) {
  const { ratio, openness } = computeSmileScore(landmarks);
  if (ratio > 2.2 && openness < 0.22) {
    return 'smile';
  }
  if (openness > 0.28) {
    return 'surprise';
  }
  return 'neutral';
}

function getMessage(expression) {
  switch (expression) {
    case 'smile':
      return '你今天看起來心情不錯喔！！';
    case 'surprise':
      return '哇～你看起來好驚訝啊！';
    default:
      return '保持自然表情，我會繼續觀察。';
  }
}

function onResults(results) {
  canvasElement.width = videoElement.videoWidth;
  canvasElement.height = videoElement.videoHeight;
  canvasCtx.save();
  canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
  canvasCtx.drawImage(results.image, 0, 0, canvasElement.width, canvasElement.height);

  if (results.multiFaceLandmarks && results.multiFaceLandmarks.length > 0) {
    for (const landmarks of results.multiFaceLandmarks) {
      drawConnectors(canvasCtx, landmarks, FACEMESH_TESSELATION, { color: '#32e0c4', lineWidth: 1 });
      drawLandmarks(canvasCtx, landmarks, { color: '#ff6b6b', lineWidth: 0.5, radius: 1 });

      const expression = getExpression(landmarks);
      const displayName = expression === 'smile' ? '微笑' : expression === 'surprise' ? '驚訝' : '自然';
      expressionLabel.textContent = displayName;

      if (expression !== lastExpression) {
        const message = getMessage(expression);
        speak(message);
        lastExpression = expression;
      }
    }
  } else {
    expressionLabel.textContent = '未偵測到臉部';
  }

  canvasCtx.restore();
}

const faceMesh = new FaceMesh({ locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`;
}});
faceMesh.setOptions({
  maxNumFaces: 1,
  refineLandmarks: true,
  minDetectionConfidence: 0.6,
  minTrackingConfidence: 0.6,
});
faceMesh.onResults(onResults);

function startCamera() {
  if (camera) return;
  camera = new Camera(videoElement, {
    onFrame: async () => {
      await faceMesh.send({ image: videoElement });
    },
    width: 960,
    height: 720,
  });
  camera.start();
  startButton.disabled = true;
  stopButton.disabled = false;
  voiceFeedbackLabel.textContent = '相機已啟用，開始偵測中...';
}

function stopCamera() {
  if (!camera) return;
  camera.stop();
  camera = null;
  startButton.disabled = false;
  stopButton.disabled = true;
  expressionLabel.textContent = '已停止偵測';
  voiceFeedbackLabel.textContent = '相機已關閉。按「啟用相機」重新開始。';
}

startButton.addEventListener('click', async () => {
  try {
    await startCamera();
  } catch (error) {
    console.error(error);
    voiceFeedbackLabel.textContent = '相機開啟失敗，請允許瀏覽器存取相機。';
  }
});

stopButton.addEventListener('click', stopCamera);
