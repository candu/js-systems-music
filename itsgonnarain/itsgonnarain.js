console.log("It's gonna rain");

let audioContext = new AudioContext();

async function loadAudio(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
}

function setStereoPan(pannerNode, pan) {
  var xDeg = pan * 45;
  var zDeg = xDeg + 90;
  if (zDeg > 90) {
    zDeg = 180 - zDeg;
  }
  var x = Math.sin(xDeg * (Math.PI / 180));
  var z = Math.sin(zDeg * (Math.PI / 180));
  pannerNode.setPosition(x, 0, z);
}

function startAudioLoop(audioBuffer, pan = 0, rate = 1) {
  const sourceNode = audioContext.createBufferSource();

  sourceNode.buffer = audioBuffer;
  sourceNode.loop = true;
  sourceNode.playbackRate.value = rate;

  const pannerNode = audioContext.createPanner();
  setStereoPan(pannerNode, pan);

  sourceNode.connect(pannerNode);
  pannerNode.connect(audioContext.destination);

  sourceNode.start(0);
}

async function main() {
  const audioBuffer = await loadAudio('gino_soccio_remember_loop.mp3');
  console.log('Decoded', audioBuffer);
  startAudioLoop(audioBuffer, -1, 1);
  startAudioLoop(audioBuffer, 1, 1.002);
}

main();
