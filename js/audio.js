/* Original Web Audio tones. No audio files, libraries, or downloads. */
(function() {
  'use strict';
  const LE = window.LE = window.LE || {};
  let context = null,
    master = null,
    music = null,
    sfx = null,
    loop = null,
    step = 0;
  let suspendedByVisibility = false;
  let weatherRequest = null,
    weatherNodes = null,
    weatherSignature = '';
  let preferences = {
    muted: false,
    musicVolume: 0.2,
    sfxVolume: 0.45
  };
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
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
    };
    oscillator.start(time);
    oscillator.stop(time + duration + 0.02);
  }

  function beat() {
    if (!context || document.hidden || context.state !== 'running' || preferences.muted || preferences
      .musicVolume === 0) return;
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
    syncWeather();
  }

  function clearWeatherNodes() {
    if (!weatherNodes) return;
    for (const source of weatherNodes.sources) {
      try {
        source.stop();
      } catch (error) {
        /* Already stopped. */
      }
      source.disconnect();
    }
    for (const node of weatherNodes.nodes) node.disconnect();
    weatherNodes = null;
    weatherSignature = '';
  }

  function syncWeather() {
    if (!context || context.state !== 'running') return;
    if (!weatherRequest || !weatherRequest.active || preferences.muted || preferences.sfxVolume <= 0) {
      clearWeatherNodes();
      return;
    }
    const phase = weatherRequest.phase;
    const rainy = ['rain', 'storm', 'outage', 'flood-low', 'flood-high', 'receding'].includes(phase);
    const level = Math.max(0, Math.min(1, weatherRequest.waterLevel || 0));
    if (!rainy && level <= 0) {
      clearWeatherNodes();
      return;
    }
    // Gracefully supports old/limited Web Audio implementations and test doubles.
    if (!context.createBuffer || !context.createBufferSource || !context.createBiquadFilter) return;
    if (!weatherNodes) {
      const buffer = context.createBuffer(1, context.sampleRate * 3, context.sampleRate);
      const data = buffer.getChannelData(0);
      let previous = 0;
      for (let i = 0; i < data.length; i++) {
        const noise = Math.random() * 2 - 1;
        previous = previous * 0.8 + noise * 0.2;
        data[i] = previous;
      }
      const sources = [],
        nodes = [],
        gains = [];
      for (let i = 0; i < 2; i++) {
        const source = context.createBufferSource(),
          filter = context.createBiquadFilter();
        const gain = context.createGain();
        source.buffer = buffer;
        source.loop = true;
        source.playbackRate.value = i ? 0.37 : 1;
        filter.type = i ? 'lowpass' : 'highpass';
        filter.frequency.value = i ? 470 : 650;
        gain.gain.value = 0;
        source.connect(filter);
        filter.connect(gain);
        gain.connect(sfx);
        source.start();
        sources.push(source);
        nodes.push(filter, gain);
        gains.push(gain);
      }
      const oscillator = context.createOscillator(),
        modulation = context.createGain();
      oscillator.type = 'sine';
      oscillator.frequency.value = 0.32;
      modulation.gain.value = 0;
      oscillator.connect(modulation);
      modulation.connect(gains[1].gain);
      oscillator.start();
      sources.push(oscillator);
      nodes.push(modulation);
      weatherNodes = {
        sources,
        nodes,
        gains,
        modulation
      };
    }
    const signature = [phase, Math.round(level * 100), weatherRequest.outdoor].join(':');
    if (signature === weatherSignature) return;
    weatherSignature = signature;
    const damp = weatherRequest.outdoor ? 1 : 0.43;
    const rainVolume = phase === 'flood-high' || phase === 'storm' || phase === 'outage' ? 0.24 :
      phase === 'receding' ? 0.065 : 0.12;
    const now = context.currentTime;
    weatherNodes.gains[0].gain.setTargetAtTime(rainy ? rainVolume * damp : 0, now, 0.12);
    weatherNodes.gains[1].gain.setTargetAtTime(level * 0.18 * damp, now, 0.18);
    weatherNodes.modulation.gain.setTargetAtTime(level * 0.035 * damp, now, 0.18);
  }
  LE.Audio = {
    async unlock() {
      try {
        if (!context) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (!AudioContext) return false;
          context = new AudioContext();
          master = context.createGain();
          music = context.createGain();
          sfx = context.createGain();
          music.connect(master);
          sfx.connect(master);
          master.connect(context.destination);
          apply();
        }
        if (context.state === 'suspended') await context.resume();
        syncWeather();
        if (!loop) {
          loop = window.setInterval(beat, 520);
          beat();
        }
        return true;
      } catch (error) {
        return false;
      }
    },
    setPreferences(value) {
      preferences = {
        ...preferences,
        ...value
      };
      apply();
    },
    setWeather(value) {
      weatherRequest = value;
      syncWeather();
    },
    stopWeather() {
      weatherRequest = null;
      clearWeatherNodes();
    },
    play(name) {
      if (!context || preferences.muted) return;
      if (name === 'rumble') {
        tone(26, 0.85, 0.10, sfx, 0, 'sine');
        return;
      }
      if (name === 'surf') {
        tone(38, 0.85, 0.08, sfx, 0, 'sine');
        tone(43, 0.6, 0.05, sfx, 0.15, 'sine');
        return;
      }
      const patterns = {
        tap: [43],
        whistle: [88],
        select: [72],
        back: [64, 60],
        success: [60, 64, 67, 72],
        start: [60, 67, 72],
        oops: [55, 52],
        footstep: [43],
        alarm: [69, 76, 69]
      };
      (patterns[name] || patterns.select).forEach((note, index) => tone(note, 0.16, 0.22, sfx, index *
        0.085, 'triangle'));
    },
    available: () => Boolean(window.AudioContext || window.webkitAudioContext),
    unlocked: () => Boolean(context && context.state === 'running'),
    stop() {
      weatherRequest = null;
      clearWeatherNodes();
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
