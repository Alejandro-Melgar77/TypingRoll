import { useEffect, useRef } from 'react';

// Escala estilo dream-pop / anime romance (Db Major 7 / Bb minor 7)
const scale = [
  277.18, // Db4
  349.23, // F4
  415.30, // Ab4
  523.25, // C5
  554.37, // Db5
  698.46, // F5
  830.61, // Ab5
];

export const useMenuBGM = (musicOn: boolean, volume: number) => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const noteIndexRef = useRef<number>(0);

  // Inicialización y limpieza del AudioContext
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    
    const ctx = new AudioContextClass();
    audioCtxRef.current = ctx;
    
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0; // Inicializar en 0, el efecto de volumen lo ajustará
    masterGain.connect(ctx.destination);
    masterGainRef.current = masterGain;

    return () => {
      if (ctx.state !== 'closed') {
        ctx.close();
      }
      audioCtxRef.current = null;
      masterGainRef.current = null;
    };
  }, []);

  // Efecto para reaccionar a cambios en el volumen sin reiniciar la música
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        Math.max(0, Math.min(1, volume)),
        audioCtxRef.current.currentTime,
        0.1
      );
    }
  }, [volume]);

  // Lógica de programación de notas (scheduler) e interpolación
  useEffect(() => {
    const ctx = audioCtxRef.current;
    if (!ctx) return;

    let timerID: number | null = null;

    const playNote = (time: number) => {
      if (!masterGainRef.current) return;
      
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const noteGain = ctx.createGain();

      // Timbre suave y brillante (kawaii)
      osc1.type = 'sine';
      osc2.type = 'triangle';
      
      // Patrón de arpegio relajante
      const pattern = [0, 2, 4, 1, 3, 5, 2, 4, 6, 3, 5, 1];
      const idx = noteIndexRef.current % pattern.length;
      const freq = scale[pattern[idx]];
      
      osc1.frequency.value = freq;
      osc2.frequency.value = freq * 1.005; // Ligero desafine (detune) para dar efecto chorus

      osc1.connect(noteGain);
      osc2.connect(noteGain);
      noteGain.connect(masterGainRef.current);

      // Envolvente (Envelope): Ataque suave y release muy largo para efecto de "sustain"
      noteGain.gain.setValueAtTime(0, time);
      noteGain.gain.linearRampToValueAtTime(0.15, time + 0.05);
      noteGain.gain.exponentialRampToValueAtTime(0.001, time + 1.2);

      osc1.start(time);
      osc2.start(time);
      osc1.stop(time + 1.2);
      osc2.stop(time + 1.2);

      noteIndexRef.current++;
    };

    const scheduler = () => {
      // Lookahead para asegurar que las notas siempre estén programadas a tiempo
      while (nextNoteTimeRef.current < ctx.currentTime + 0.1) {
        playNote(nextNoteTimeRef.current);
        nextNoteTimeRef.current += 0.25; // Separación de notas (BPM relajado)
      }
    };

    if (musicOn) {
      if (ctx.state === 'suspended') {
        ctx.resume();
      }
      // Si el tiempo avanzó mientras estaba pausado, resetear el reloj para el scheduler
      if (nextNoteTimeRef.current < ctx.currentTime) {
        nextNoteTimeRef.current = ctx.currentTime + 0.05;
      }
      timerID = window.setInterval(scheduler, 25);
    } else {
      if (ctx.state === 'running') {
        ctx.suspend();
      }
    }

    return () => {
      // Limpieza del intervalo
      if (timerID !== null) {
        window.clearInterval(timerID);
      }
    };
  }, [musicOn]);
};
