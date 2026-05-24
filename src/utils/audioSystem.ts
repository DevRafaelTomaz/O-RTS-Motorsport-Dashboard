// Web Audio API Synth and Sequencer for Porsche Telemetry
// Provides real-time interactive Flat-Six Boxer Engine synthesized audio,
// gearshift exhausts backfire pop, pitlane radio static chirps,
// and progressive electronic racing music tracks including Brazilian Bass.

class AudioSystem {
  private audioCtx: AudioContext | null = null;
  private isEngineActive = false;
  private isMusicActive = false;

  // Engine Synth nodes
  private engineOsc1: OscillatorNode | null = null;
  private engineOsc2: OscillatorNode | null = null;
  private engineOsc3: OscillatorNode | null = null; // high-end mechanical valve cylinder harmonic
  private engineFilter: BiquadFilterNode | null = null;
  private engineGain: GainNode | null = null;

  // Rich exhaust combustion noise representing real flow compression
  private engineNoise: AudioBufferSourceNode | null = null;
  private engineNoiseFilter: BiquadFilterNode | null = null;
  private engineNoiseGain: GainNode | null = null;

  // Sequencer beat nodes
  private sequencerTimer: any = null;
  private currentBeat = 0;
  private musicGain: GainNode | null = null;
  private tempo = 125; // BPM
  private trackStyle: 'synthwave' | 'techno' | 'cyberpunk' | 'brazilian-bass' = 'synthwave';

  constructor() {
    // Lazy loaded, needs user gesture
  }

  private initCtx() {
    if (!this.audioCtx) {
      this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  // --- ENGINE SYNTHESIS (DISABLED - DIGITAL MUSIC ONLY) ---
  public startEngine() {
    // Engine sound synthesis disabled
  }

  public updateEngineRPM(rpm: number) {
    // Engine sound synthesis disabled
  }

  // Interactive backfire pop to simulate exhaust combustion on rapid sequential gear shifts or RPM dropouts
  public triggerShiftPop() {
    // Engine sound synthesis disabled
  }

  // Brief radio static "Chhhhh-kzzz-psh" for telemetry active pitlane communications
  public playRadioStatic() {
    this.initCtx();
    if (!this.audioCtx) return;

    try {
      const currTime = this.audioCtx.currentTime;

      // Create 150ms of pink/white analog radio static noise
      const bufferSize = this.audioCtx.sampleRate * 0.15;
      const buffer = this.audioCtx.createBuffer(1, bufferSize, this.audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 1.5 - 0.75;
      }
      const noise = this.audioCtx.createBufferSource();
      noise.buffer = buffer;

      const bandpass = this.audioCtx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime(1400, currTime);
      bandpass.Q.setValueAtTime(3.0, currTime);

      const gain = this.audioCtx.createGain();
      gain.gain.setValueAtTime(0.15, currTime);
      gain.gain.exponentialRampToValueAtTime(0.001, currTime + 0.14);

      noise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.audioCtx.destination);

      noise.start(currTime);
      noise.stop(currTime + 0.15);

      // Short tone alert beep (800Hz)
      const alertBeep = this.audioCtx.createOscillator();
      const beepGain = this.audioCtx.createGain();
      alertBeep.type = 'sine';
      alertBeep.frequency.setValueAtTime(880, currTime);
      beepGain.gain.setValueAtTime(0.08, currTime);
      beepGain.gain.exponentialRampToValueAtTime(0.001, currTime + 0.1);

      alertBeep.connect(beepGain);
      beepGain.connect(this.audioCtx.destination);

      alertBeep.start(currTime);
      alertBeep.stop(currTime + 0.11);
    } catch (e) {
      console.error(e);
    }
  }

  public stopEngine() {
    // Engine sound synthesis disabled
  }

  // --- SEQUENCER CORRIDA MUSIC ---
  // Purely synthesized interactive background racing tracks with custom BPM
  public playMusic() {
    this.initCtx();
    if (!this.audioCtx || this.isMusicActive) return;

    try {
      this.tempo = this.trackStyle === 'brazilian-bass' ? 124 : 125;
      this.musicGain = this.audioCtx.createGain();
      this.musicGain.gain.setValueAtTime(0.12, this.audioCtx.currentTime);
      this.musicGain.connect(this.audioCtx.destination);

      this.currentBeat = 0;
      this.isMusicActive = true;
      this.scheduler();
    } catch (e) {
      console.error("Could not start Web Audio music track", e);
    }
  }

  public setMusicStyle(style: 'synthwave' | 'techno' | 'cyberpunk' | 'brazilian-bass') {
    this.trackStyle = style;
    this.tempo = style === 'brazilian-bass' ? 124 : 125;
  }

  public getMusicStyle() {
    return this.trackStyle;
  }

  private scheduler() {
    if (!this.isMusicActive || !this.audioCtx) return;

    const secondsPerBeat = 60.0 / this.tempo;
    const stepDuration = secondsPerBeat / 4; // 16th notes

    // Schedule next beat slightly ahead of time
    this.playStep(this.currentBeat, this.audioCtx.currentTime + 0.05);

    this.currentBeat = (this.currentBeat + 1) % 16;
    this.sequencerTimer = setTimeout(() => this.scheduler(), stepDuration * 1000);
  }

  private playStep(beat: number, time: number) {
    if (!this.audioCtx || !this.musicGain) return;

    try {
      // 1. Kick Drum Synth (every 4 beats)
      if (beat % 4 === 0) {
        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        osc.connect(gain);
        gain.connect(this.musicGain);

        if (this.trackStyle === 'brazilian-bass') {
          // Extremely punchy, slightly lower sub-bassy Brazilian club kick
          osc.frequency.setValueAtTime(140, time);
          osc.frequency.exponentialRampToValueAtTime(0.001, time + 0.16);
          gain.gain.setValueAtTime(0.65, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.16);
        } else {
          osc.frequency.setValueAtTime(120, time);
          osc.frequency.exponentialRampToValueAtTime(0.01, time + 0.2);
          gain.gain.setValueAtTime(0.5, time);
          gain.gain.exponentialRampToValueAtTime(0.01, time + 0.2);
        }

        osc.start(time);
        osc.stop(time + 0.22);
      }

      // 2. High-Hat / Shakers
      if (beat % 4 === 2 || beat % 8 === 6) {
        if (this.trackStyle === 'brazilian-bass' && beat % 4 === 2) {
          // Syncopated Brazilian Rimshot or Woodblock click
          const rim = this.audioCtx.createOscillator();
          const rimFilter = this.audioCtx.createBiquadFilter();
          const rimGain = this.audioCtx.createGain();
          rim.type = 'triangle';
          rimFilter.type = 'bandpass';
          rimFilter.frequency.setValueAtTime(1800, time);
          rimFilter.Q.setValueAtTime(4.0, time);
          
          rim.connect(rimFilter);
          rimFilter.connect(rimGain);
          rimGain.connect(this.musicGain);

          rim.frequency.setValueAtTime(650, time);
          rimGain.gain.setValueAtTime(0.1, time);
          rimGain.gain.exponentialRampToValueAtTime(0.001, time + 0.04);

          rim.start(time);
          rim.stop(time + 0.05);
        } else {
          // Standard Hihat
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.connect(gain);
          gain.connect(this.musicGain);

          osc.frequency.setValueAtTime(10000, time);
          gain.gain.setValueAtTime(0.06, time);
          gain.gain.exponentialRampToValueAtTime(0.001, time + 0.05);

          osc.start(time);
          osc.stop(time + 0.06);
        }
      }

      // 3. Brazilian syncopated snare/clap "Baile Funk" style pattern
      if (this.trackStyle === 'brazilian-bass' && (beat === 3 || beat === 10 || beat === 11 || beat === 14)) {
        const snare = this.audioCtx.createOscillator();
        const snareFilter = this.audioCtx.createBiquadFilter();
        const snareGain = this.audioCtx.createGain();
        
        snare.type = 'sawtooth';
        snareFilter.type = 'bandpass';
        snareFilter.frequency.setValueAtTime(950, time);
        snareFilter.Q.setValueAtTime(1.5, time);
        
        snare.connect(snareFilter);
        snareFilter.connect(snareGain);
        snareGain.connect(this.musicGain);

        // Quick drop off baile snap
        snare.frequency.setValueAtTime(260, time);
        snare.frequency.exponentialRampToValueAtTime(100, time + 0.08);

        snareGain.gain.setValueAtTime(0.11, time);
        snareGain.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

        snare.start(time);
        snare.stop(time + 0.11);
      }

      // 4. Progressive Sub Bassline
      let notes = [55, 55, 55, 55, 58, 58, 58, 62, 62, 62, 53, 53, 55, 55, 55, 55]; // standard synthwave loop
      if (this.trackStyle === 'cyberpunk') {
        notes = [48, 48, 51, 48, 54, 48, 51, 48, 46, 46, 48, 46, 51, 51, 53, 53];
      } else if (this.trackStyle === 'techno') {
        notes = [50, 50, 50, 50, 53, 53, 53, 50, 55, 55, 55, 55, 50, 50, 50, 50];
      } else if (this.trackStyle === 'brazilian-bass') {
        // Deep progressive punchy Brazilian Bassline notes (G-minor/Eb-major vibe)
        notes = [43, 43, 43, 46, 46, 43, 48, 48, 41, 41, 41, 43, 43, 43, 46, 48];
      }

      const note = notes[beat];
      // Convert MIDI note to frequency
      const freq = Math.pow(2, (note - 69) / 12) * 440;

      const bassOsc = this.audioCtx.createOscillator();
      const bassGain = this.audioCtx.createGain();
      
      // Brazilian bass uses an extremely warm sine/triangle blend for that deep rounded club feel
      bassOsc.type = this.trackStyle === 'brazilian-bass' ? 'triangle' : (this.trackStyle === 'cyberpunk' ? 'sawtooth' : 'triangle');
      bassOsc.connect(bassGain);
      bassGain.connect(this.musicGain);

      bassOsc.frequency.setValueAtTime(freq / 2, time); // drop 1 octave for rich sub bass

      if (this.trackStyle === 'brazilian-bass') {
        // Slap bass sound: fast attack and heavy body decay
        bassGain.gain.setValueAtTime(0.24, time);
        bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.15);
      } else {
        bassGain.gain.setValueAtTime(0.18, time);
        bassGain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
      }

      bassOsc.start(time);
      bassOsc.stop(time + 0.16);

      // 5. Arpeggios & Vocoder synth flares (for style flair)
      const arpFreqs = [0, 4, 7, 11, 7, 4, 12, 7];
      if (beat % 2 === 0 && (this.trackStyle === 'synthwave' || this.trackStyle === 'techno' || this.trackStyle === 'brazilian-bass')) {
        const chordRoot = notes[Math.floor(beat / 4) * 4];
        const arpMIDI = chordRoot + arpFreqs[beat % 8];
        const arpFreq = Math.pow(2, (arpMIDI - 69) / 12) * 440;

        const arpOsc = this.audioCtx.createOscillator();
        const arpGain = this.audioCtx.createGain();

        arpOsc.connect(arpGain);
        arpGain.connect(this.musicGain);

        // Cute sine lead melody layer
        arpOsc.type = 'sine';
        
        if (this.trackStyle === 'brazilian-bass') {
          // Pitched higher for clean vocal-like synth hooks in Brazilian tech-house
          arpOsc.frequency.setValueAtTime(arpFreq * 2.0, time);
          arpGain.gain.setValueAtTime(0.04, time);
          arpGain.gain.exponentialRampToValueAtTime(0.001, time + 0.22);
        } else {
          arpOsc.frequency.setValueAtTime(arpFreq, time);
          arpGain.gain.setValueAtTime(0.06, time);
          arpGain.gain.exponentialRampToValueAtTime(0.001, time + 0.18);
        }

        arpOsc.start(time);
        arpOsc.stop(time + 0.24);
      }
    } catch (e) {}
  }

  public stopMusic() {
    this.isMusicActive = false;
    if (this.sequencerTimer) {
      clearTimeout(this.sequencerTimer);
      this.sequencerTimer = null;
    }
    try {
      this.musicGain?.disconnect();
      this.musicGain = null;
    } catch (e) {}
  }

  public getIsEngineActive() { return this.isEngineActive; }
  public getIsMusicActive() { return this.isMusicActive; }
}

export const audioSystem = new AudioSystem();
