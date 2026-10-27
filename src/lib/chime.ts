// Sonido sutil de cobro con Web Audio API (100% nativo, sin dependencias)
export function playPaymentChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gain = ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'triangle';

    // Acorde agradable ascendente C6 -> G6
    osc1.frequency.setValueAtTime(1046.5, now);
    osc1.frequency.exponentialRampToValueAtTime(1567.98, now + 0.12);

    osc2.frequency.setValueAtTime(1318.5, now);
    osc2.frequency.exponentialRampToValueAtTime(2093.0, now + 0.15);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.5);
    osc2.stop(now + 0.5);
  } catch {
    // Si el navegador bloquea audio sin interacción, ignorar
  }
}
