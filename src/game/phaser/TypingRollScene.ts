import Phaser from 'phaser';
import { createRun, reduceRun, resultFromRun } from '../domain/engine';
import type { CloudState, RunConfig, RunEvent, RunInput, RunResult, RunState } from '../domain/types';

export interface SceneCallbacks {
  onState: (state: RunState) => void;
  onEvents: (events: readonly RunEvent[]) => void;
  onFinished: (result: RunResult) => void;
}

interface CloudView {
  container: Phaser.GameObjects.Container;
  body: Phaser.GameObjects.Graphics;
  label: Phaser.GameObjects.Text;
  typed: Phaser.GameObjects.Text;
}

const skyByTier = ['#bfeef4', '#ffe4a3', '#ffd3bd', '#c6b3df', '#302747'];
const riverByTier = ['#57b9c7', '#3e9ebc', '#387aa5', '#294d83', '#172d60'];

export class TypingRollScene extends Phaser.Scene {
  private state: RunState | null = null;
  private callbacks: SceneCallbacks | null = null;
  private cloudViews = new Map<string, CloudView>();
  private background!: Phaser.GameObjects.Graphics;
  private river!: Phaser.GameObjects.Graphics;
  private hasFinished = false;

  public constructor() {
    super('typingroll-run');
  }

  public begin(config: RunConfig, callbacks: SceneCallbacks) {
    this.state = createRun(config);
    this.callbacks = callbacks;
    this.hasFinished = false;
    this.sync();
  }

  public dispatch(input: RunInput) {
    if (!this.state) return;
    const transition = reduceRun(this.state, input);
    this.state = transition.state;
    this.handleEvents(transition.events);
    this.sync();
  }

  public getState() {
    return this.state;
  }

  create() {
    this.background = this.add.graphics();
    this.river = this.add.graphics();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.sync, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off(Phaser.Scale.Events.RESIZE, this.sync, this));
  }

  update(_: number, delta: number) {
    if (this.state?.status === 'playing') this.dispatch({ type: 'tick', deltaMs: delta });
  }

  private sync = () => {
    if (!this.state || !this.background || !this.river) return;
    const width = this.scale.width;
    const height = this.scale.height;
    const state = this.state;
    this.drawBackground(width, height, state);
    const active = new Set(state.clouds.map((cloud) => cloud.id));
    this.cloudViews.forEach((view, id) => {
      if (!active.has(id)) {
        this.createBurst(view.container.x, view.container.y, 0x92e1d4);
        view.container.destroy();
        this.cloudViews.delete(id);
      }
    });
    state.clouds.forEach((cloud) => this.syncCloud(cloud, width, height, state));
    this.callbacks?.onState(state);
  };

  private drawBackground(width: number, height: number, state: RunState) {
    const sky = Phaser.Display.Color.HexStringToColor(skyByTier[state.tier - 1]).color;
    const river = Phaser.Display.Color.HexStringToColor(riverByTier[state.tier - 1]).color;
    this.background.clear();
    this.background.fillGradientStyle(sky, sky, sky + 0x101015, sky + 0x101015, 1);
    this.background.fillRect(0, 0, width, height);
    this.background.fillStyle(0xffffff, state.tier < 4 ? 0.16 : 0.08);
    for (let index = 0; index < 6; index += 1) {
      const x = ((index * 193 + state.elapsedMs * 0.007) % (width + 180)) - 90;
      const y = 48 + (index % 3) * 76;
      this.background.fillCircle(x, y, 46 + (index % 2) * 18);
    }
    const riverTop = height * 0.84;
    this.river.clear();
    this.river.fillStyle(river, 0.86);
    this.river.beginPath();
    this.river.moveTo(0, riverTop);
    for (let x = 0; x <= width + 20; x += 20) {
      const y = riverTop + Math.sin(x * 0.025 + state.elapsedMs * 0.005) * (5 + state.tier * 1.8);
      this.river.lineTo(x, y);
    }
    this.river.lineTo(width, height);
    this.river.lineTo(0, height);
    this.river.closePath();
    this.river.fillPath();
    this.river.lineStyle(2, 0xffffff, 0.7);
    this.river.beginPath();
    this.river.moveTo(0, riverTop);
    for (let x = 0; x <= width + 20; x += 20) this.river.lineTo(x, riverTop + Math.sin(x * 0.025 + state.elapsedMs * 0.005) * (5 + state.tier * 1.8));
    this.river.strokePath();
  }

  private syncCloud(cloud: CloudState, width: number, height: number, state: RunState) {
    let view = this.cloudViews.get(cloud.id);
    if (!view) {
      const body = this.add.graphics();
      const label = this.add.text(0, -2, '', { fontFamily: 'Nunito, Arial, sans-serif', fontStyle: '800', fontSize: '22px', color: '#334557' }).setOrigin(0.5);
      const typed = this.add.text(0, -2, '', { fontFamily: 'Nunito, Arial, sans-serif', fontStyle: '800', fontSize: '22px', color: '#138a7b' }).setOrigin(0.5);
      const container = this.add.container(0, 0, [body, label, typed]);
      container.setDepth(3);
      view = { container, body, label, typed };
      this.cloudViews.set(cloud.id, view);
      container.setScale(0.82);
      this.tweens.add({ targets: container, scaleX: 1, scaleY: 1, duration: 150, ease: 'Back.Out' });
    }
    const displayWord = cloud.feedback ?? cloud.word;
    const fontSize = Math.max(15, Math.min(24, width / 28));
    view.label.setFontSize(fontSize).setText(displayWord);
    view.typed.setFontSize(fontSize).setText(state.config.gameMode === 'classic' ? cloud.typed : '');
    const wordWidth = Math.max(view.label.width, view.typed.width);
    const cloudWidth = Math.min(width - 24, Math.max(116, wordWidth + 52));
    const cloudHeight = cloud.feedback ? 76 : 60;
    view.body.clear();
    view.body.fillStyle(cloud.feedback ? 0xffdad0 : 0xffffff, 0.98);
    view.body.fillCircle(-cloudWidth * 0.29, -cloudHeight * 0.04, cloudHeight * 0.28);
    view.body.fillCircle(0, -cloudHeight * 0.23, cloudHeight * 0.38);
    view.body.fillCircle(cloudWidth * 0.29, -cloudHeight * 0.02, cloudHeight * 0.27);
    view.body.fillRoundedRect(-cloudWidth / 2, -cloudHeight * 0.1, cloudWidth, cloudHeight * 0.42, cloudHeight * 0.2);
    view.body.lineStyle(state.targetId === cloud.id ? 3 : 1, state.targetId === cloud.id ? 0xf28c8c : 0xd6e4eb, 0.95);
    view.body.strokeRoundedRect(-cloudWidth / 2, -cloudHeight * 0.1, cloudWidth, cloudHeight * 0.42, cloudHeight * 0.2);
    view.label.setColor(cloud.feedback ? '#97493f' : '#334557');
    view.typed.setPosition(-view.label.width / 2 + view.typed.width / 2, -2);
    view.container.setPosition(cloud.x * width, cloud.y * height);
  }

  private handleEvents(events: readonly RunEvent[]) {
    if (!events.length) return;
    this.callbacks?.onEvents(events);
    if (!this.state || this.hasFinished) return;
    const ended = events.find((event) => event.type === 'game-over');
    if (ended) {
      this.hasFinished = true;
      this.callbacks?.onFinished(resultFromRun(this.state));
    }
  }

  private createBurst(x: number, y: number, color: number) {
    const points = Array.from({ length: 8 }, () => {
      const dot = this.add.circle(x, y, 4, color, 0.9).setDepth(5);
      this.tweens.add({
        targets: dot,
        x: x + Phaser.Math.Between(-42, 42),
        y: y + Phaser.Math.Between(-36, 36),
        alpha: 0,
        scale: 0.2,
        duration: 380,
        ease: 'Quad.Out',
        onComplete: () => dot.destroy(),
      });
      return dot;
    });
    void points;
  }
}
