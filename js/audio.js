/* Original Web Audio tones. No audio files, libraries, or downloads. */
(function () {
  'use strict';
  const LE = window.LE = window.LE || {};
  let context = null, master = null, music = null, sfx = null, loop = null, step = 0;
  let suspendedByVisibility = false;
  let preferences = {muted: false, musicVolume: 0.2, sfxVolume: 0.45};
  const tune = [60, 64, 67, 72, 69, 67, 64, 62, 60, 64, 67, 69, 67, 64, 62, 55];
  const hz = midi => 440 * Math.pow(2, (midi - 69) / 12);
  function tone(note, duration, volume, bus, delay = 0, shape = 'sine') {
    if (!context || context.state !== 'running') return;
    const oscillator = context.createOscillator();
    const envelope = context.createGain();
    const time = context.currentTime + delay;
    oscillator.type = shape;
    oscillator.frequency.value = hz(note);
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(volume, time + 0.015);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(envelope);
    envelope.connect(bus);
    oscillator.onended = () => { oscillator.disconnect(); envelope.disconnect(); };
    oscillator.start(time);
    oscillator.stop(time + duration + 0.02);
  }
  function beat() {
    if (!context || document.hidden || context.state !== 'running' || preferences.muted || preferences.musicVolume === 0) return;
    tone(tune[step % tune.length], 0.65, 0.13, music, 0, 'triangle');
    if (step % 4 === 0) tone([48, 53, 55, 48][Math.floor(step / 4) % 4], 1.6, 0.09, music);
    step++;
  }
  function apply() {
    if (!context) return;
    const time = context.currentTime;
    master.gain.setTargetAtTime(preferences.muted ? 0 : 0.65, time, 0.025);
    music.gain.setTargetAtTime(preferences.musicVolume, time, 0.025);
    sfx.gain.setTargetAtTime(preferences.sfxVolume, time, 0.025);
  }
  LE.Audio = {
    async unlock() {
      try {
        if (!context) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!AudioContext) return false;
          context = new AudioContext();
          master = context.createGain(); music = context.createGain(); sfx = context.createGain();
          music.connect(master); sfx.connect(master); master.connect(context.destination);
          apply();
        }
        if (context.state === 'suspended') await context.resume();
        if (!loop) { loop = window.setInterval(beat, 520); beat(); }
        return true;
      } catch (error) { return false; }
    },
    setPreferences(value) { preferences = {...preferences, ...value}; apply(); },
    play(name) {
      if (!context || preferences.muted) return;
      if(name==='rumble'){tone(26,0.85,0.10,sfx,0,'sine');return;}
      if(name==='surf'){tone(38,0.85,0.08,sfx,0,'sine');tone(43,0.6,0.05,sfx,0.15,'sine');return;}
      const patterns = {
        tap:[43], whistle:[88], select: [72], back: [64, 60], success: [60, 64, 67, 72],
        start: [60, 67, 72], oops: [55, 52], footstep: [43], alarm: [69, 76, 69]
      };
      (patterns[name] || patterns.select).forEach((note, index) => tone(note, 0.16, 0.22, sfx, index * 0.085, 'triangle'));
    },
    available: () => Boolean(window.AudioContext || window.webkitAudioContext),
    unlocked: () => Boolean(context && context.state === 'running'),
    stop() {
      if (loop) window.clearInterval(loop);
      loop = null;
      if (context && context.state === 'running') context.suspend().catch(() => {});
    }
  };
  document.addEventListener('visibilitychange', () => {
    if (!context) return;
    if (document.hidden) {
      suspendedByVisibility = context.state === 'running';
      if (suspendedByVisibility) context.suspend().catch(() => {});
    } else if (suspendedByVisibility) {
      suspendedByVisibility = false;
      context.resume().catch(() => {});
    }
  });
})();
