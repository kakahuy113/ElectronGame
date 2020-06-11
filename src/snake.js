(function () {
  const ipc = require("electron").ipcRenderer;
  
  const blockSize = 10;
  const initialFps = 15;
  const fpsIncrement = 3;

  const mod = (n, m) => ((n % m) + m) % m;
  const keys = {
    space: 32,
    left: 37,
    up: 38,
    right: 39,
    down: 40,
  };

  const canvas = document.getElementById("canvas");
  const ctx = canvas.getContext("2d");
  const canvasXSize = canvas.width;
  const canvasYSize = canvas.height;

  const displayScore = (score) =>
    (document.getElementById("score").innerText = score);

  const moveHead = (head, direction) => {
    const [hx, hy] = head;
    switch (direction) {
      case "left":
        return [mod(hx - blockSize, canvasXSize), hy];
      case "up":
        return [hx, mod(hy - blockSize, canvasYSize)];
      case "right":
        return [mod(hx + blockSize, canvasXSize), hy];
      case "down":
        return [hx, mod(hy + blockSize, canvasYSize)];
    }
  };

  const move = (snake, direction, food) => {
    const head = snake[0];
    const newHead = moveHead(head, direction);
    const eat = pointMatch(newHead, food);
    const newTail = eat ? snake : snake.slice(0, -1);
    return [[newHead].concat(newTail), eat];
  };

  const hasCollision = (snake) => {
    const [head, ...tail] = snake;
    const [hx, hy] = head;
    return tail.some(([x, y]) => x === hx && y === hy);
  };

  const pointMatch = (p1, p2) => {
    const [x1, y1] = p1;
    const [x2, y2] = p2;
    return x1 === x2 && y1 === y2;
  };

  const isPartOfSnake = (snake, point) => {
    const [px, py] = point;
    return snake.some(([x, y]) => px === x && py === y);
  };

  const randomPoint = () => {
    const x = Math.floor((Math.random() * canvasXSize) / blockSize) * blockSize;
    const y = Math.floor((Math.random() * canvasYSize) / blockSize) * blockSize;
    return [x, y];
  };

  const randomFood = (snake) => {
    let food;
    do {
      food = randomPoint();
    } while (isPartOfSnake(snake, food));
    return food;
  };

  const initState = () => {
    const snake = [
      [50, 100],
      [50, 90],
      [50, 80],
      [50, 70],
      [50, 60],
      [50, 50],
      [50, 40],
      [50, 30],
      [50, 20],
      [50, 10],
    ];
    const food = randomFood(snake);
    return {
      fps: initialFps,
      snake,
      direction: "down",
      running: true,
      food,
      score: 0,
    };
  };

  const clear = () => ctx.clearRect(0, 0, canvas.width, canvas.height);
  const render = (state) => {
    const { running, snake, direction, food, fps, score } = state;
    if (!running) return state;

    const [newSnake, eat] = move(snake, direction, food);
    let newFood = food,
      newFps = fps,
      newScore = score;
    if (eat) {
      newScore++;
      displayScore(newScore);
      newFood = randomFood(newSnake);
      newFps = fps + fpsIncrement;
    }

    clear();
    ctx.fillStyle = "rgb(255, 238, 0)";
    newSnake.forEach(([x, y]) => ctx.fillRect(x, y, blockSize, blockSize));
    ctx.fillStyle = "rgb(0, 0, 0)";
    if (food) ctx.fillRect(food[0], food[1], blockSize, blockSize);

    if (hasCollision(newSnake)) {
      alert(ipc.sendSync("lose"));
      alert(ipc.sendSync("Again"));
      displayScore(0);
      return initState();
    }

    return {
      ...state,
      snake: newSnake,
      food: newFood,
      fps: newFps,
      score: newScore,
    };
  };

  document.onkeydown = (e) => {
    switch (e.keyCode) {
      case keys.left:
        if (state.direction != "right") state.direction = "left";
        break;
      case keys.up:
        if (state.direction != "down") state.direction = "up";
        break;
      case keys.right:
        if (state.direction != "left") state.direction = "right";
        break;
      case keys.down:
        if (state.direction != "up") state.direction = "down";
        break;
      case keys.space:
        state.running = !state.running;
        break;
    }
  };

  const loop = () => {
    const currentTime = new Date().getTime();
    const delta = currentTime - lastTime;
    const interval = 1000 / state.fps;
    if (delta > interval) {
      state = render(state);
      lastTime = currentTime;
    }
    requestAnimationFrame(loop);
  };

  let state = initState();
  lastTime = new Date().getTime();
  requestAnimationFrame(loop);
})();
