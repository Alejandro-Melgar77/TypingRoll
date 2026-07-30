import { useEffect, useRef } from 'react';
import type { ParagraphCategory } from '../../content/types';

export type BgmMood = 'menu' | ParagraphCategory;

interface BgmProfile {
  scale: readonly number[];
  pattern: readonly number[];
  interval: number;
  release: number;
  primaryWave: OscillatorType;
  secondaryWave: OscillatorType;
}

const BGM_PROFILES: Readonly<Record<BgmMood, BgmProfile>> = {
  menu: { scale: [277.18, 349.23, 415.3, 523.25, 554.37, 698.46, 830.61], pattern: [0, 2, 4, 1, 3, 5, 2, 4, 6, 3, 5, 1], interval: 0.25, release: 1.2, primaryWave: 'sine', secondaryWave: 'triangle' },
  poetic: { scale: [293.66, 369.99, 440, 587.33, 659.25, 739.99, 880], pattern: [0, 3, 1, 4, 2, 5, 3, 6, 4, 1], interval: 0.42, release: 1.8, primaryWave: 'sine', secondaryWave: 'sine' },
  'motivational-literature': { scale: [220, 277.18, 329.63, 440, 554.37, 659.25, 880], pattern: [0, 2, 4, 6, 4, 2, 1, 3, 5, 3], interval: 0.3, release: 1.1, primaryWave: 'triangle', secondaryWave: 'sine' },
  romanticism: { scale: [261.63, 329.63, 392, 493.88, 523.25, 659.25, 783.99], pattern: [0, 2, 4, 1, 3, 5, 6, 4, 2, 1], interval: 0.36, release: 1.65, primaryWave: 'sine', secondaryWave: 'triangle' },
  'self-improvement': { scale: [261.63, 293.66, 392, 440, 523.25, 587.33, 783.99], pattern: [0, 1, 3, 4, 2, 5, 4, 6, 3, 1], interval: 0.32, release: 1.25, primaryWave: 'triangle', secondaryWave: 'sine' },
  'biblical-self-help': { scale: [196, 246.94, 293.66, 392, 440, 493.88, 587.33], pattern: [0, 2, 4, 3, 1, 5, 4, 2, 6, 3], interval: 0.5, release: 2.1, primaryWave: 'sine', secondaryWave: 'sine' },
  'constructive-dialogues': { scale: [329.63, 392, 493.88, 587.33, 659.25, 783.99, 987.77], pattern: [0, 2, 1, 4, 3, 5, 2, 6, 4, 1], interval: 0.28, release: 1.05, primaryWave: 'triangle', secondaryWave: 'sine' },
};

export const bgmProfileForMood = (mood: BgmMood): BgmProfile => BGM_PROFILES[mood];

/** Small procedural BGM profiles keep every screen license-free and mutually exclusive. */
export const useMenuBGM = (musicOn: boolean, volume: number, mood: BgmMood = 'menu') => {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const nextNoteTimeRef = useRef(0);
  const noteIndexRef = useRef(0);

  useEffect(() => {
    const AudioContextClass = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return undefined;
    const ctx = new AudioContextClass();
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.connect(ctx.destination);
    audioCtxRef.current = ctx;
    masterGainRef.current = masterGain;
    return () => {
      if (ctx.state !== 'closed') void ctx.close();
      audioCtxRef.current = null;
      masterGainRef.current = null;
    };
  }, []);

  useEffect(() => {
    const ctx = audioCtxRef.current;
    const masterGain = masterGainRef.current;
    if (ctx && masterGain) masterGain.gain.setTargetAtTime(Math.max(0, Math.min(1, volume)), ctx.currentTime, 0.1);
  }, [volume]);

  useEffect(() => {
    noteIndexRef.current = 0;
    nextNoteTimeRef.current = 0;
  }, [mood]);

  useEffect(() => {
    const ctx = audioCtxRef.current;
    const profile = bgmProfileForMood(mood);
    if (!ctx) return undefined;
    let timerId: number | null = null;

    const playNote = (time: number) => {
      const masterGain = masterGainRef.current;
      if (!masterGain) return;
      const primary = ctx.createOscillator();
      const secondary = ctx.createOscillator();
      const noteGain = ctx.createGain();
      const index = noteIndexRef.current % profile.pattern.length;
      const frequency = profile.scale[profile.pattern[index]];
      primary.type = profile.primaryWave;
      secondary.type = profile.secondaryWave;
      primary.frequency.value = frequency;
      secondary.frequency.value = frequency * 1.004;
      primary.connect(noteGain);
      secondary.connect(noteGain);
      noteGain.connect(masterGain);
      noteGain.gain.setValueAtTime(0, time);
      noteGain.gain.linearRampToValueAtTime(0.12, time + 0.06);
      noteGain.gain.exponentialRampToValueAtTime(0.001, time + profile.release);
      primary.start(time);
      secondary.start(time);
      primary.stop(time + profile.release);
      secondary.stop(time + profile.release);
      noteIndexRef.current += 1;
    };

    const schedule = () => {
      while (nextNoteTimeRef.current < ctx.currentTime + 0.12) {
        playNote(nextNoteTimeRef.current);
        nextNoteTimeRef.current += profile.interval;
      }
    };

    if (musicOn) {
      if (ctx.state === 'suspended') void ctx.resume();
      if (nextNoteTimeRef.current < ctx.currentTime) nextNoteTimeRef.current = ctx.currentTime + 0.05;
      timerId = window.setInterval(schedule, 30);
    } else if (ctx.state === 'running') {
      void ctx.suspend();
    }

    return () => { if (timerId !== null) window.clearInterval(timerId); };
  }, [mood, musicOn]);
};
