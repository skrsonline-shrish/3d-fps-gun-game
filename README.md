* {
  box-sizing: border-box;
}

:root {
  color-scheme: dark;
  --bg: #05151c;
  --panel: rgba(10, 22, 30, 0.75);
  --border: rgba(255, 255, 255, 0.14);
  --text: #edfaff;
  --accent: #71d6ff;
  --gold: #f9d76b;
  --danger: #ff7d7d;
}

html, body {
  margin: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--bg);
  color: var(--text);
  font-family: Inter, "Segoe UI", sans-serif;
}

canvas {
  display: block;
  width: 100vw;
  height: 100vh;
  cursor: crosshair;
}

#hud {
  position: fixed;
  inset: 0 auto auto 0;
  width: 100%;
  padding: 18px;
  z-index: 10;
  pointer-events: none;
}

#hud .stats {
  display: inline-flex;
  gap: 22px;
  padding: 10px 16px;
  background: var(--panel);
  border: 1px solid var(--border);
  border-radius: 999px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.25);
  backdrop-filter: blur(8px);
}

#hud .stats span {
  font-size: 0.9rem;
  letter-spacing: 0.05em;
  font-weight: 700;
}

#statusText {
  position: absolute;
  left: 50%;
  top: 18px;
  transform: translateX(-50%);
  background: rgba(5, 16, 22, 0.52);
  border: 1px solid var(--border);
  border-radius: 999px;
  padding: 10px 16px;
  font-size: 0.75rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--accent);
}

#gameOver {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(3, 10, 16, 0.7);
  z-index: 30;
}

#gameOver.hidden {
  display: none;
}

.panel {
  min-width: min(420px, 80vw);
  background: rgba(12, 20, 28, 0.95);
  border: 1px solid var(--border);
  border-radius: 18px;
  padding: 26px 28px;
  text-align: center;
  box-shadow: 0 30px 60px rgba(0, 0, 0, 0.45);
}

.panel h1 {
  margin: 0 0 12px;
  font-size: clamp(2.2rem, 4vw, 3.3rem);
  color: var(--gold);
}

.panel p {
  margin: 0 0 18px;
  font-size: 1.1rem;
  color: var(--text);
}

button {
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), #7af4d6);
  color: #041b25;
  padding: 12px 22px;
  font-weight: 800;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.15s ease;
}

button:hover {
  transform: translateY(-1px) scale(1.02);
}
