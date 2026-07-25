import { useCallback } from 'react';

// Se utiliza una variable a nivel de módulo para el AudioContext
// Esto permite compartir el mismo contexto entre todos los componentes que usen el hook,
// evitando el límite de contextos de audio del navegador y ahorrando recursos.
let audioCtx: AudioContext | null = null;

export const useSFX = () => {
  // Inicializa o recupera el contexto de audio a demanda
  const getContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioCtx = new AudioContextClass();
      }
    }
    // La política de autoplay de los navegadores puede iniciar el contexto en estado "suspended".
    // Intentamos reanudarlo cada vez que se pide un sonido si está suspendido.
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }, []);

  // Función para reproducir el sonido de daño / error
  const playDamageSound = useCallback((volume: number = 0.5) => {
    if (volume <= 0) return;
    
    const ctx = getContext();
    if (!ctx) return;

    // Utilizamos dos osciladores disonantes para generar un sonido tipo "BZZT" retro o impacto.
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    // Ondas cuadradas y sierra dan una textura rugosa (estilo 8-bit)
    osc1.type = 'square';
    osc2.type = 'sawtooth';

    const now = ctx.currentTime;
    const duration = 0.15; // 150ms de duración, rápido y percusivo

    // Frecuencias iniciales disonantes que caen rápidamente (pitch envelope)
    osc1.frequency.setValueAtTime(150, now);
    osc1.frequency.exponentialRampToValueAtTime(20, now + duration);

    osc2.frequency.setValueAtTime(200, now);
    osc2.frequency.exponentialRampToValueAtTime(30, now + duration);

    // Envolvente de volumen (Amplitude envelope) para dar el golpe y evitar "clicks" al final
    // Evitamos bajar a 0 exactamente con exponentialRamp porque lanza error matemáticamente
    gainNode.gain.setValueAtTime(volume * 0.5, now); // escalamos el volumen un poco
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + duration);

    // Distorsión sutil (opcional) para más aspereza
    const waveShaper = ctx.createWaveShaper();
    const curve = new Float32Array(400);
    for (let i = 0; i < 400; ++i) {
      const x = i * 2 / 400 - 1;
      curve[i] = (3 + 20) * x * 20 * (Math.PI / 180) / (Math.PI + 20 * Math.abs(x));
    }
    waveShaper.curve = curve;
    waveShaper.oversample = '4x';

    // Conexiones de los nodos
    osc1.connect(waveShaper);
    osc2.connect(waveShaper);
    waveShaper.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Iniciar y detener
    osc1.start(now);
    osc2.start(now);
    
    // Limpieza
    osc1.stop(now + duration);
    osc2.stop(now + duration);
    
    // Desconectar nodos una vez que terminen de sonar para liberar memoria
    setTimeout(() => {
      osc1.disconnect();
      osc2.disconnect();
      waveShaper.disconnect();
      gainNode.disconnect();
    }, (duration * 1000) + 100);
  }, [getContext]);

  const playTone = useCallback((frequency: number, duration: number, volume: number, type: OscillatorType = 'sine') => {
    if (volume <= 0) return;
    const ctx = getContext();
    if (!ctx) return;
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, now);
    oscillator.frequency.exponentialRampToValueAtTime(frequency * 1.35, now + duration);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(Math.min(0.18, volume * 0.18), now + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.start(now);
    oscillator.stop(now + duration + 0.02);
  }, [getContext]);

  const playSuccessSound = useCallback((volume: number = 0.5) => {
    playTone(523.25, 0.11, volume, 'triangle');
    window.setTimeout(() => playTone(659.25, 0.13, volume * 0.8, 'triangle'), 55);
  }, [playTone]);

  const playPowerSound = useCallback((volume: number = 0.5) => {
    playTone(392, 0.2, volume, 'sine');
    window.setTimeout(() => playTone(783.99, 0.24, volume * 0.85, 'sine'), 80);
  }, [playTone]);

  return { playDamageSound, playSuccessSound, playPowerSound };
};

export default useSFX;
