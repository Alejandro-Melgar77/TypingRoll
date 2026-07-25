import { useEffect, useRef } from 'react';

// Todas las fases comparten 150 BPM y C menor. Cambia la instrumentación, no el pulso,
// para que una fase pueda evolucionar hacia la siguiente sin una transición brusca.
const STEP_SECONDS = 0.2; // corcheas a 150 BPM
const C_MINOR = [261.63, 293.66, 311.13, 349.23, 392, 415.3, 466.16, 523.25];
const PATTERNS = [
  [0, 2, 4, 2, 0, 3, 4, 3], // lo-fi / glockenspiel
  [0, 2, 4, 5, 4, 2, 3, 4], // J-pop ascendente
  [0, 3, 4, 2, 5, 4, 3, 1], // J-rock más tenso
  [0, 4, 3, 5, 2, 4, 1, 3], // hard rock
  [0, 5, 3, 6, 2, 4, 1, 7], // clímax metal, aún musical
];

function makeDriveCurve(amount: number) {
  const samples = 512;
  const curve = new Float32Array(samples);
  for (let index = 0; index < samples; index += 1) {
    const x = (index * 2) / samples - 1;
    curve[index] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

export const useGameBGM = (musicOn: boolean, volume: number, tier: number) => {
  const contextRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nextStepRef = useRef(0);
  const stepIndexRef = useRef(0);
  const tierRef = useRef(tier);

  useEffect(() => {
    tierRef.current = Math.min(5, Math.max(1, tier));
  }, [tier]);

  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const master = context.createGain();
    master.gain.value = 0;
    master.connect(context.destination);
    contextRef.current = context;
    masterRef.current = master;

    return () => {
      if (context.state !== 'closed') context.close();
      contextRef.current = null;
      masterRef.current = null;
    };
  }, []);

  useEffect(() => {
    const context = contextRef.current;
    const master = masterRef.current;
    if (context && master) master.gain.setTargetAtTime(Math.max(0, Math.min(.42, volume * .42)), context.currentTime, .08);
  }, [volume]);

  useEffect(() => {
    const context = contextRef.current;
    const master = masterRef.current;
    if (!context || !master) return;
    let timer: number | null = null;

    const playKick = (time: number, intensity: number) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(118, time);
      oscillator.frequency.exponentialRampToValueAtTime(42, time + .12);
      gain.gain.setValueAtTime(.001, time);
      gain.gain.exponentialRampToValueAtTime(.3 * intensity, time + .008);
      gain.gain.exponentialRampToValueAtTime(.001, time + .16);
      oscillator.connect(gain);
      gain.connect(master);
      oscillator.start(time);
      oscillator.stop(time + .18);
    };

    const playHat = (time: number, intensity: number) => {
      const buffer = context.createBuffer(1, Math.floor(context.sampleRate * .035), context.sampleRate);
      const data = buffer.getChannelData(0);
      for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1;
      const source = context.createBufferSource();
      const filter = context.createBiquadFilter();
      const gain = context.createGain();
      source.buffer = buffer;
      filter.type = 'highpass';
      filter.frequency.value = 6500;
      gain.gain.setValueAtTime(.055 * intensity, time);
      gain.gain.exponentialRampToValueAtTime(.001, time + .04);
      source.connect(filter);
      filter.connect(gain);
      gain.connect(master);
      source.start(time);
    };

    const playStep = (time: number) => {
      const currentTier = tierRef.current;
      const step = stepIndexRef.current;
      const pattern = PATTERNS[currentTier - 1];
      const frequency = C_MINOR[pattern[step % pattern.length]];
      const oscillator = context.createOscillator();
      const harmony = context.createOscillator();
      const gain = context.createGain();
      const tone = context.createBiquadFilter();
      let output: AudioNode = tone;

      oscillator.type = currentTier < 3 ? 'triangle' : 'sawtooth';
      harmony.type = currentTier < 4 ? 'sine' : 'square';
      oscillator.frequency.setValueAtTime(frequency, time);
      harmony.frequency.setValueAtTime(frequency * (currentTier < 3 ? 2 : 1.5), time);
      harmony.detune.value = currentTier * 3;
      tone.type = 'lowpass';
      tone.frequency.value = currentTier < 3 ? 2800 : 1900;
      tone.Q.value = currentTier >= 4 ? 2.4 : .8;

      if (currentTier >= 4) {
        const drive = context.createWaveShaper();
        drive.curve = makeDriveCurve(currentTier === 5 ? 18 : 9);
        drive.oversample = '2x';
        tone.connect(drive);
        output = drive;
      }
      output.connect(master);
      oscillator.connect(gain);
      harmony.connect(gain);
      gain.connect(tone);

      const level = currentTier === 1 ? .13 : currentTier === 2 ? .15 : .12;
      gain.gain.setValueAtTime(.001, time);
      gain.gain.linearRampToValueAtTime(level, time + .015);
      gain.gain.exponentialRampToValueAtTime(.001, time + .19);
      oscillator.start(time);
      harmony.start(time);
      oscillator.stop(time + .2);
      harmony.stop(time + .2);

      if (currentTier >= 2 && step % 2 === 0) playKick(time, currentTier / 5);
      if (currentTier >= 3) playHat(time, (currentTier - 1) / 4);
      stepIndexRef.current += 1;
    };

    const schedule = () => {
      while (nextStepRef.current < context.currentTime + .12) {
        playStep(nextStepRef.current);
        nextStepRef.current += STEP_SECONDS;
      }
    };

    if (musicOn) {
      if (context.state === 'suspended') void context.resume();
      if (nextStepRef.current < context.currentTime) nextStepRef.current = context.currentTime + .04;
      timer = window.setInterval(schedule, 25);
    } else if (context.state === 'running') {
      void context.suspend();
    }

    return () => { if (timer !== null) window.clearInterval(timer); };
  }, [musicOn]);
};
