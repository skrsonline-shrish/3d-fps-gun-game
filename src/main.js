<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Arena Strike 3D</title>
    <meta
      name="description"
      content="A polished 3D arena shooter with weapon switching, rounds, pickups, and fast arcade gameplay."
    />
  </head>
  <body>
    <div id="hud">
      <div class="topbar">
        <span>HP: <strong id="health">100</strong></span>
        <span>Weapon: <strong id="weaponName">Rifle</strong></span>
        <span>Ammo: <strong id="ammo">18 / 90</strong></span>
        <span>Score: <strong id="score">0</strong></span>
      </div>
      <div id="statusText">Click to enter arena</div>
    </div>

    <div id="crosshair" aria-hidden="true">
      <span></span>
      <span></span>
    </div>

    <div id="startOverlay" class="overlay">
      <div class="panel">
        <p class="eyebrow">Arcade FPS</p>
        <h1>Arena Strike</h1>
        <p>Move with WASD, aim with the mouse, and survive the wave.</p>
        <ul>
          <li>1 / 2 / 3 weapons</li>
          <li>Shift to dash</li>
          <li>R to reload</li>
          <li>E to heal</li>
        </ul>
        <button id="startBtn">Start Match</button>
      </div>
    </div>

    <div id="gameOver" class="overlay hidden">
      <div class="panel">
        <p class="eyebrow">Match over</p>
        <h2>Final Score</h2>
        <p id="finalScore">0</p>
        <button id="restartBtn">Play Again</button>
      </div>
    </div>

    <script type="module" src="/src/main.js"></script>
  </body>
</html>
