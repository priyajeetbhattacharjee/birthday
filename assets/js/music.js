// Happy Birthday Music Engine (Audio Track + Synthesis Fallback)

class CelestialMusicEngine {
    constructor() {
        this.ctx = null;
        this.isPlaying = false;
        this.isMuted = false;
        this.audioElement = null;
        this.synthTimer = null;
        this.masterGain = null;
        this.isSynth = false;

        this.loadAudioTrack();
        this.setupAutoplay();
    }

    setupAutoplay() {
        // Attempt immediate autoplay on load
        this.play();

        // Autoplay fallback: start on very first interaction (keypad digit press, click, keydown, touch)
        const startOnInteraction = () => {
            this.play();
            ['click', 'touchstart', 'keydown', 'pointerdown'].forEach((evt) => {
                window.removeEventListener(evt, startOnInteraction, { capture: true });
            });
        };

        ['click', 'touchstart', 'keydown', 'pointerdown'].forEach((evt) => {
            window.addEventListener(evt, startOnInteraction, { once: true, capture: true });
        });
    }

    loadAudioTrack() {
        const audio = new Audio();
        audio.src = "./assets/music/happy_birthday.mp3";
        audio.loop = true;
        audio.volume = 0.65;
        audio.preload = "auto";

        audio.addEventListener("canplaythrough", () => {
            this.audioElement = audio;
            this.isSynth = false;
            if (this.isPlaying) {
                audio.play().catch(() => {});
            }
        }, { once: true });

        audio.addEventListener("error", () => {
            console.log("Using synthesized Happy Birthday engine");
            this.isSynth = true;
        }, { once: true });

        this.audioElement = audio;
    }

    initAudioContext() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
            this.masterGain = this.ctx.createGain();
            this.masterGain.gain.setValueAtTime(0.4, this.ctx.currentTime);
            this.masterGain.connect(this.ctx.destination);
        }
        if (this.ctx.state === "suspended") {
            this.ctx.resume();
        }
    }

    play() {
        if (this.isPlaying) return;
        this.isPlaying = true;

        if (this.audioElement && !this.isSynth) {
            const playPromise = this.audioElement.play();
            if (playPromise !== undefined) {
                playPromise.catch(() => {
                    this.isPlaying = false;
                });
            }
        } else if (this.isSynth) {
            this.initAudioContext();
            this.startHbdSynth();
        }
    }

    pause() {
        this.isPlaying = false;
        if (this.audioElement) {
            this.audioElement.pause();
        }
        if (this.synthTimer) {
            clearTimeout(this.synthTimer);
            this.synthTimer = null;
        }
    }

    toggle() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }

    // Gentle celestial bell-piano note synthesizer for fallback
    playNote(freq, time, duration = 1.2, velocity = 0.3) {
        if (!this.ctx || !this.isPlaying) return;

        const osc = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);

        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(freq * 2, time);

        const attack = 0.03;
        gain.gain.setValueAtTime(0.001, time);
        gain.gain.exponentialRampToValueAtTime(velocity, time + attack);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);

        osc.start(time);
        osc2.start(time);
        osc.stop(time + duration);
        osc2.stop(time + duration);
    }

    // Complete "Happy Birthday To You" melody (Key of G)
    startHbdSynth() {
        if (!this.ctx || !this.isPlaying) return;

        // Frequencies for G Major Happy Birthday
        const D4 = 293.66, E4 = 329.63, Fs4 = 369.99, G4 = 392.00, A4 = 440.00, B4 = 493.88, C5 = 523.25, D5 = 587.33;
        const G3 = 196.00, D3 = 146.83, C3 = 130.81;

        const score = [
            // "Happy Birthday to you"
            { f: D4, d: 0.6, v: 0.35, wait: 350 },
            { f: D4, d: 0.6, v: 0.35, wait: 350 },
            { f: E4, d: 1.0, v: 0.40, wait: 600 },
            { f: D4, d: 1.0, v: 0.38, wait: 600 },
            { f: G4, d: 1.2, v: 0.42, wait: 600, chord: G3 },
            { f: Fs4, d: 1.8, v: 0.45, wait: 1200, chord: D3 },

            // "Happy Birthday to you"
            { f: D4, d: 0.6, v: 0.35, wait: 350 },
            { f: D4, d: 0.6, v: 0.35, wait: 350 },
            { f: E4, d: 1.0, v: 0.40, wait: 600 },
            { f: D4, d: 1.0, v: 0.38, wait: 600 },
            { f: A4, d: 1.2, v: 0.42, wait: 600, chord: D3 },
            { f: G4, d: 1.8, v: 0.45, wait: 1200, chord: G3 },

            // "Happy Birthday dear Sneha"
            { f: D4, d: 0.6, v: 0.35, wait: 350 },
            { f: D4, d: 0.6, v: 0.35, wait: 350 },
            { f: D5, d: 1.4, v: 0.48, wait: 600, chord: G3 },
            { f: B4, d: 1.0, v: 0.40, wait: 600 },
            { f: G4, d: 1.0, v: 0.38, wait: 600 },
            { f: Fs4, d: 1.0, v: 0.36, wait: 600, chord: C3 },
            { f: E4, d: 1.8, v: 0.42, wait: 1200 },

            // "Happy Birthday to you"
            { f: C5, d: 0.6, v: 0.38, wait: 350 },
            { f: C5, d: 0.6, v: 0.38, wait: 350 },
            { f: B4, d: 1.0, v: 0.40, wait: 600, chord: G3 },
            { f: G4, d: 1.0, v: 0.38, wait: 600 },
            { f: A4, d: 1.2, v: 0.42, wait: 600, chord: D3 },
            { f: G4, d: 2.2, v: 0.48, wait: 1800, chord: G3 }
        ];

        let i = 0;
        const tick = () => {
            if (!this.isPlaying) return;

            const n = score[i];
            const now = this.ctx.currentTime;
            this.playNote(n.f, now, n.d, n.v);

            if (n.chord) {
                this.playNote(n.chord, now, n.d * 1.5, 0.22);
            }

            i = (i + 1) % score.length;
            this.synthTimer = setTimeout(tick, n.wait);
        };

        tick();
    }
}

export let musicEngine = null;

export function initMusic() {
    if (!musicEngine) {
        musicEngine = new CelestialMusicEngine();
    }
    return musicEngine;
}
