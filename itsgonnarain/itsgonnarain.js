console.log("It's gonna rain");

let audioContext = new AudioContext();

async function loadAudio(url) {
  const response = await fetch(url);
  const arrayBuffer = await response.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
}

function startAudioLoop(audioBuffer, pan = 0, rate = 1) {
  const sourceNode = audioContext.createBufferSource();

  sourceNode.buffer = audioBuffer;
  sourceNode.loop = true;
  sourceNode.playbackRate.value = rate;

  const pannerNode = audioContext.createStereoPanner();
  pannerNode.pan.value = pan;

  sourceNode.connect(pannerNode);
  pannerNode.connect(audioContext.destination);

  sourceNode.start(0);
}

async function main() {
  const audioBuffer = await loadAudio('gino_soccio_remember_loop.wav');
  console.log('Decoded', audioBuffer);
  startAudioLoop(audioBuffer, -1, 1);
  startAudioLoop(audioBuffer, 1, 1.002);
}

main();
