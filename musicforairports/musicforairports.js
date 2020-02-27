const SAMPLE_LIBRARY = {
  'Vibraphone': [
    { note: 'A', octave: 3, file: 'samples/Vibraphone.sustain.ff.A3.wav' },
    { note: 'A', octave: 4, file: 'samples/Vibraphone.sustain.ff.A4.wav' },
    { note: 'A', octave: 5, file: 'samples/Vibraphone.sustain.ff.A5.wav' },
    { note: 'B', octave: 3, file: 'samples/Vibraphone.sustain.ff.B3.wav' },
    { note: 'B', octave: 4, file: 'samples/Vibraphone.sustain.ff.B4.wav' },
    { note: 'B', octave: 5, file: 'samples/Vibraphone.sustain.ff.B5.wav' },
    { note: 'C', octave: 3, file: 'samples/Vibraphone.sustain.ff.C3.wav' },
    { note: 'C', octave: 4, file: 'samples/Vibraphone.sustain.ff.C4.wav' },
    { note: 'C', octave: 5, file: 'samples/Vibraphone.sustain.ff.C5.wav' },
    { note: 'D', octave: 3, file: 'samples/Vibraphone.sustain.ff.D3.wav' },
    { note: 'D', octave: 4, file: 'samples/Vibraphone.sustain.ff.D4.wav' },
    { note: 'D', octave: 5, file: 'samples/Vibraphone.sustain.ff.D5.wav' },
    { note: 'E', octave: 3, file: 'samples/Vibraphone.sustain.ff.E3.wav' },
    { note: 'E', octave: 4, file: 'samples/Vibraphone.sustain.ff.E4.wav' },
    { note: 'E', octave: 5, file: 'samples/Vibraphone.sustain.ff.E5.wav' },
    { note: 'F', octave: 3, file: 'samples/Vibraphone.sustain.ff.F3.wav' },
    { note: 'F', octave: 4, file: 'samples/Vibraphone.sustain.ff.F4.wav' },
    { note: 'F', octave: 5, file: 'samples/Vibraphone.sustain.ff.F5.wav' },
    { note: 'G', octave: 3, file: 'samples/Vibraphone.sustain.ff.G3.wav' },
    { note: 'G', octave: 4, file: 'samples/Vibraphone.sustain.ff.G4.wav' },
    { note: 'G', octave: 5, file: 'samples/Vibraphone.sustain.ff.G5.wav' },
  ],
};

const OCTAVE = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

let audioContext = new AudioContext();

function noteValue(note, octave) {
  return octave * 12 + OCTAVE.indexOf(note);
}

function getNoteDistance(note1, octave1, note2, octave2) {
  const value1 = noteValue(note1, octave1);
  const value2 = noteValue(note2, octave2);
  return value1 - value2;
}

function flatToSharp(note) {
  switch (note) {
    case 'Bb': return 'A#';
    case 'Db': return 'C#';
    case 'Eb': return 'D#';
    case 'Gb': return 'F#';
    case 'Ab': return 'G#';
    default:   return note;
  }
}

function getNearestSample(sampleBank, note, octave) {
  let min = null;
  let minDist = Infinity;
  sampleBank.forEach((sample) => {
    const dist = Math.abs(getNoteDistance(note, octave, sample.note, sample.octave));
    if (dist < minDist) {
      min = sample;
      minDist = dist;
    }
  });
  return min;
}

async function fetchSample(path) {
  const response = await fetch(encodeURIComponent(path));
  const arrayBuffer = await response.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
}

async function getSample(instrument, noteAndOctave) {
  let [, note, octave] = /^(\w[b#]?)(\d)$/.exec(noteAndOctave);
  octave = parseInt(octave, 10);
  note = flatToSharp(note);

  const sampleBank = SAMPLE_LIBRARY[instrument];
  let sample = getNearestSample(sampleBank, note, octave);
  let distance = getNoteDistance(note, octave, sample.note, sample.octave);
  const audioBuffer = await fetchSample(sample.file);
  return { audioBuffer, distance };
}

async function playSample(instrument, note) {
  const { audioBuffer, distance } = await getSample(instrument, note);
  let playbackRate = Math.pow(2, distance / 12);
  let bufferSource = audioContext.createBufferSource();
  bufferSource.buffer = audioBuffer;
  bufferSource.playbackRate.value = playbackRate;
  bufferSource.connect(audioContext.destination);
  bufferSource.start();
}

setTimeout(() => playSample('Vibraphone', 'F4'),  1000);
setTimeout(() => playSample('Vibraphone', 'Ab4'), 2000);
setTimeout(() => playSample('Vibraphone', 'C5'),  3000);
setTimeout(() => playSample('Vibraphone', 'Db5'), 4000);
setTimeout(() => playSample('Vibraphone', 'Eb5'), 5000);
setTimeout(() => playSample('Vibraphone', 'F5'),  6000);
setTimeout(() => playSample('Vibraphone', 'Ab5'), 7000);
