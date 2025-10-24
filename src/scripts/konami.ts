const SEQUENCE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
const POW_DURATION = 8000;
const LONG_PRESS_MS = 800;

export function initKonami() {
  const allowed = document.body.dataset.konami === 'true';
  if (!allowed) return;

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return;

  let position = 0;
  let timeoutId: number | null = null;

  const onKeydown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key === SEQUENCE[position].toLowerCase()) {
      position += 1;
      if (position === SEQUENCE.length) {
        trigger();
        position = 0;
      }
    } else {
      position = key === SEQUENCE[0].toLowerCase() ? 1 : 0;
    }
  };

  const logo = document.querySelector<HTMLElement>('[data-konami-logo]');
  let pressTimer: number | null = null;

  const clearPressTimer = () => {
    if (pressTimer) {
      window.clearTimeout(pressTimer);
      pressTimer = null;
    }
  };

  const onPointerDown = () => {
    clearPressTimer();
    pressTimer = window.setTimeout(() => {
      trigger();
      clearPressTimer();
    }, LONG_PRESS_MS);
  };

  const trigger = () => {
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
    const existing = document.querySelector('.pow-mode');
    if (existing) {
      existing.remove();
    }
    const overlay = document.createElement('div');
    overlay.className = 'pow-mode';
    overlay.setAttribute('aria-hidden', 'true');
    const canvas = document.createElement('canvas');
    overlay.append(canvas);

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.className = 'close';
    closeButton.textContent = 'End Pow Day';
    overlay.append(closeButton);
    document.body.append(overlay);

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let frame: number;
    const flakes = Array.from({ length: 120 }, () => createFlake(canvas));

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * ratio;
      canvas.height = window.innerHeight * ratio;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(ratio, ratio);
    };
    resize();

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      flakes.forEach((flake) => {
        flake.y += flake.speed;
        flake.x += Math.sin(flake.y / 15) * flake.sway;
        if (flake.y > window.innerHeight + 20) {
          flake.y = -10;
          flake.x = Math.random() * window.innerWidth;
        }
        ctx.beginPath();
        ctx.fillStyle = flake.color;
        ctx.arc(flake.x, flake.y, flake.size, 0, Math.PI * 2);
        ctx.fill();
      });
      frame = window.requestAnimationFrame(draw);
    };
    frame = window.requestAnimationFrame(draw);

    const stop = () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      overlay.remove();
    };

    window.addEventListener('resize', resize);
    closeButton.addEventListener('click', stop);

    timeoutId = window.setTimeout(stop, POW_DURATION);
  };

  const onPointerUp = () => {
    clearPressTimer();
  };

  window.addEventListener('keydown', onKeydown);
  if (logo) {
    logo.addEventListener('pointerdown', onPointerDown);
    logo.addEventListener('pointerup', onPointerUp);
    logo.addEventListener('pointerleave', onPointerUp);
    logo.addEventListener('pointercancel', onPointerUp);
  }
}

type Flake = {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  color: string;
};

function createFlake(canvas: HTMLCanvasElement): Flake {
  const palette = ['#FFFFFF', '#CBE3F4', '#F7EAD0'];
  return {
    x: Math.random() * canvas.clientWidth,
    y: Math.random() * canvas.clientHeight,
    size: Math.random() * 2 + 1,
    speed: Math.random() * 1.5 + 0.5,
    sway: Math.random() * 0.6,
    color: palette[Math.floor(Math.random() * palette.length)]
  };
}
