// A tiny, dependency-free ambient soundscape built on the Web Audio API.
// Generates gentle rain (filtered noise) plus occasional wind-chime tones —
// no external audio assets required. Client-only; instantiate on user gesture.

type SoundKind = "rain" | "chimes";

export class AmbientSound {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private rainSource: AudioBufferSourceNode | null = null;
  private chimeTimer: ReturnType<typeof setTimeout> | null = null;
  private kind: SoundKind = "rain";
  playing = false;

  private ensureContext() {
    if (this.ctx) return;
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new AC();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.0001;
    this.master.connect(this.ctx.destination);
  }

  private makeNoiseBuffer(): AudioBuffer {
    const ctx = this.ctx!;
    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let i = 0; i < length; i++) {
      // brown-ish noise for a soft, rounded texture
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[i] = last * 3.2;
    }
    return buffer;
  }

  private startRainBed() {
    const ctx = this.ctx!;
    const src = ctx.createBufferSource();
    src.buffer = this.makeNoiseBuffer();
    src.loop = true;

    const lp = ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = this.kind === "rain" ? 1100 : 600;

    const bedGain = ctx.createGain();
    bedGain.gain.value = this.kind === "rain" ? 0.5 : 0.28;

    src.connect(lp).connect(bedGain).connect(this.master!);
    src.start();
    this.rainSource = src;
  }

  private scheduleChime() {
    if (!this.ctx) return;
    const delay = 2200 + Math.random() * 4200;
    this.chimeTimer = setTimeout(() => {
      this.playChime();
      this.scheduleChime();
    }, delay);
  }

  private playChime() {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    // pentatonic-ish, airy bells
    const notes = [523.25, 587.33, 659.25, 783.99, 880, 1046.5];
    const freq = notes[Math.floor(Math.random() * notes.length)];
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    const g = ctx.createGain();
    const now = ctx.currentTime;
    const peak = this.kind === "chimes" ? 0.16 : 0.07;
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(peak, now + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 2.4);
    osc.connect(g).connect(this.master);
    osc.start(now);
    osc.stop(now + 2.6);
  }

  start(kind: SoundKind = "rain") {
    this.ensureContext();
    if (!this.ctx || !this.master) return;
    if (this.ctx.state === "suspended") void this.ctx.resume();
    this.kind = kind;
    if (this.playing) this.stopInternal();
    this.startRainBed();
    // Pure, gentle rain — no chimes layered on top of the rain bed.
    if (kind === "chimes") this.scheduleChime();
    else this.scheduleDrop();
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(Math.max(this.master.gain.value, 0.0001), now);
    this.master.gain.exponentialRampToValueAtTime(0.5, now + 1.2);
    this.playing = true;
  }

  private scheduleDrop() {
    if (!this.ctx) return;
    const delay = 700 + Math.random() * 1600;
    this.chimeTimer = setTimeout(() => {
      this.playDrop();
      this.scheduleDrop();
    }, delay);
  }

  private playDrop() {
    const ctx = this.ctx;
    if (!ctx || !this.master) return;
    // soft, rounded rain droplet — a quick filtered blip
    const osc = ctx.createOscillator();
    osc.type = "sine";
    const startF = 480 + Math.random() * 320;
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(startF, now);
    osc.frequency.exponentialRampToValueAtTime(startF * 0.55, now + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, now);
    g.gain.exponentialRampToValueAtTime(0.05 + Math.random() * 0.04, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
    osc.connect(g).connect(this.master);
    osc.start(now);
    osc.stop(now + 0.22);
  }

  private stopInternal() {
    if (this.chimeTimer) {
      clearTimeout(this.chimeTimer);
      this.chimeTimer = null;
    }
    if (this.rainSource) {
      try {
        this.rainSource.stop();
      } catch {
        /* already stopped */
      }
      this.rainSource = null;
    }
  }

  stop() {
    if (!this.ctx || !this.master) {
      this.playing = false;
      return;
    }
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.exponentialRampToValueAtTime(0.0001, now + 0.6);
    setTimeout(() => this.stopInternal(), 700);
    this.playing = false;
  }

  toggle(kind: SoundKind = "rain"): boolean {
    if (this.playing) {
      this.stop();
    } else {
      this.start(kind);
    }
    return this.playing;
  }
}
