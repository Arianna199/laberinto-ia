const agent = document.getElementById("agent");
const goal = document.getElementById("goal");

const actions = ["up", "down", "left", "right"];
let qTable = {}; // Estado → acción → valor

let epsilon = 0.3;     // probabilidad de explorar
let alpha = 0.6;       // tasa de aprendizaje
let gamma = 0.9;       // descuento futuro

function getState(pos) {
  return `${Math.round(pos.x)}_${Math.round(pos.z)}`;
}

function getNextPos(pos, action) {
  let dx = 0, dz = 0;
  if (action === "up") dz = -1;
  if (action === "down") dz = 1;
  if (action === "left") dx = -1;
  if (action === "right") dx = 1;
  return { x: Math.round(pos.x + dx), y: pos.y, z: Math.round(pos.z + dz) };
}

function isWall(pos) {
  let walls = document.querySelectorAll(".wall");
  for (let wall of walls) {
    let wp = wall.getAttribute("position");
    if (Math.round(wp.x) === pos.x && Math.round(wp.z) === pos.z) {
      return true;
    }
  }
  return false;
}

function isGoal(pos) {
  let gp = goal.getAttribute("position");
  return Math.round(gp.x) === pos.x && Math.round(gp.z) === pos.z;
}

function chooseAction(state) {
  if (!qTable[state]) qTable[state] = {};
  for (let a of actions) if (qTable[state][a] === undefined) qTable[state][a] = 0;

  if (Math.random() < epsilon) {
    return actions[Math.floor(Math.random() * actions.length)];
  } else {
    return actions.reduce((best, a) => qTable[state][a] > qTable[state][best] ? a : best);
  }
}

function updateQ(state, action, reward, nextState) {
  const maxNext = Math.max(...Object.values(qTable[nextState] || {}));
  qTable[state][action] += alpha * (reward + gamma * maxNext - qTable[state][action]);
}

function resetAgent() {
  agent.setAttribute("position", { x: 1, y: 0.3, z: -1 });
}

function runEpisode() {
  let steps = 0;
  resetAgent();

  function step() {
    if (steps > 100) {
      runEpisode();
      return;
    }

    let pos = agent.getAttribute("position");
    let state = getState(pos);
    let action = chooseAction(state);
    let nextPos = getNextPos(pos, action);
    let nextState = getState(nextPos);

    let reward = -0.1;
    if (isWall(nextPos)) {
      reward = -1;
    } else if (isGoal(nextPos)) {
      reward = 10;
    }

    if (!qTable[nextState]) qTable[nextState] = {};
    for (let a of actions) if (qTable[nextState][a] === undefined) qTable[nextState][a] = 0;

    if (!isWall(nextPos)) {
      agent.setAttribute("position", { ...nextPos });
    }

    updateQ(state, action, reward, nextState);

    steps++;
    if (isGoal(nextPos)) {
      console.log("¡Meta alcanzada!");
      setTimeout(runEpisode, 1000);
    } else {
      setTimeout(step, 200);
    }
  }

  step();
}

setTimeout(runEpisode, 2000);
