* {
  box-sizing: border-box;
}

:root {
  color-scheme: dark;
  --bg: #07151d;
  --panel: rgba(9, 20, 30, 0.8);
  --border: rgba(255, 255, 255, 0.18);
  --text: #eaf9ff;
  --accent: #74d6ff;
  --gold: #f7d568;
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

body {
  position: relative;
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
  z-index: 20;
  pointer-events: none;
}

.topbar {
  display: inline-flex;
  gap: 18px;
  padding: 12px 18px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(8, 19, 28, 0.7);
  backdrop-filter: blur(7px);
  box-shadow: 0 14px 38px rgba(0, 0, 0, 0.18);
}

.topbar span {
  font-size: 0.9rem;
  letter-spacing: 0.06em;
  font-weight: 700;
}

#statusText {
  position: absolute;
  left: 50%;
  top: 20px;
  transform: translateX(-50%);
  padding: 10px 16px;
  border: 1px solid var(--border);
  border-radius: 999px;
  background: rgba(5, 11, 18, 0.5);
  color: var(--accent);
  font-size: 0.72rem;
  letter-spacing: 0.13em;
  text-transform: uppercase;
}

#crosshair {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 22px;
  height: 22px;
  z-index: 15;
  pointer-events: none;
}

#crosshair span {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}

#crosshair span:first-child {
  left: 50%;
  top: 0;
  width: 2px;
  height: 100%;
  transform: translateX(-50%);
}

#crosshair span:last-child {
  left: 0;
  top: 50%;
  width: 100%;
  height: 2px;
  transform: translateY(-50%);
}

.overlay {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(2, 9, 14, 0.56);
  z-index: 25;
}

.overlay.hidden {
  display: none;
}

.panel {
  width: min(500px, 85vw);
  padding: 28px 24px;
  border: 1px solid var(--border);
  border-radius: 20px;
  background: rgba(12, 20, 29, 0.95);
  text-align: center;
  box-shadow: 0 28px 60px rgba(0, 0, 0, 0.33);
}

.eyebrow {
  margin: 0 0 12px;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  font-size: 0.72rem;
  color: var(--accent);
}

h1, h2 {
  margin: 0;
  color: var(--gold);
}

h1 {
  font-size: clamp(2.4rem, 5vw, 3.5rem);
}

h2 {
  font-size: clamp(1.8rem, 4vw, 2.8rem);
}

.panel p {
  margin: 16px 0;
  font-size: 1rem;
  color: var(--text);
}

.classGrid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 10px;
  margin: 18px 0 14px;
}

.classBtn {
  padding: 12px 10px;
  border: 1px solid var(--border);
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.02);
  color: var(--text);
  font-weight: 700;
  cursor: pointer;
  transition: 0.15s ease;
}

.classBtn.active {
  background: linear-gradient(135deg, var(--accent), #8dfac7);
  color: #061e2a;
}

.panel ul {
  list-style: none;
  padding: 0;
  margin: 18px 0 22px;
  display: grid;
  gap: 8px;
  color: #dff5ff;
}

button {
  border: none;
  border-radius: 999px;
  padding: 12px 22px;
  background: linear-gradient(135deg, var(--accent), #8dfac7);
  color: #041b22;
  font-size: 1rem;
  font-weight: 800;
  cursor: pointer;
  transition: transform 0.15s ease;
}

button:hover {
  transform: translateY(-1px) scale(1.02);
}
