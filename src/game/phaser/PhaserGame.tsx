import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import type { ForwardedRef } from 'react';
import Phaser from 'phaser';
import type { RunConfig, RunEvent, RunInput, RunResult, RunState } from '../domain/types';
import { TypingRollScene } from './TypingRollScene';

export interface PhaserGameHandle {
  dispatch: (input: RunInput) => void;
  getState: () => RunState | null;
}

interface Props {
  config: RunConfig;
  onState: (state: RunState) => void;
  onEvents: (events: readonly RunEvent[]) => void;
  onFinished: (result: RunResult) => void;
}

export function PhaserGame({ config, onState, onEvents, onFinished }: Props, ref: ForwardedRef<PhaserGameHandle>) {
  const hostRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<TypingRollScene | null>(null);
  const latestCallbacksRef = useRef({ onState, onEvents, onFinished });
  latestCallbacksRef.current = { onState, onEvents, onFinished };

  useImperativeHandle(ref, () => ({
    dispatch: (input) => sceneRef.current?.dispatch(input),
    getState: () => sceneRef.current?.getState() ?? null,
  }), []);

  useEffect(() => {
    if (!hostRef.current) return undefined;
    const scene = new TypingRollScene();
    sceneRef.current = scene;
    const game = new Phaser.Game({
      type: Phaser.AUTO,
      parent: hostRef.current,
      transparent: true,
      antialias: true,
      render: { antialias: true, roundPixels: true },
      scale: { mode: Phaser.Scale.RESIZE, width: '100%', height: '100%', autoCenter: Phaser.Scale.CENTER_BOTH },
      scene: [scene],
    });
    game.events.once(Phaser.Core.Events.READY, () => {
      scene.begin(config, {
        onState: (state) => latestCallbacksRef.current.onState(state),
        onEvents: (events) => latestCallbacksRef.current.onEvents(events),
        onFinished: (result) => latestCallbacksRef.current.onFinished(result),
      });
    });
    return () => {
      sceneRef.current = null;
      game.destroy(true);
    };
  }, [config]);

  return <div ref={hostRef} className="phaser-game" aria-label="Área de juego de TypingRoll" />;
}

export const PhaserGameView = forwardRef(PhaserGame);
