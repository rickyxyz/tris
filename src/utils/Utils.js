function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function coordinateToIndex({ x, y }, size) {
  return (y - size) * size * -1 + x - 1;
}

function calculateCollisionResult({ x: x1, y: y1 }, { x: x2, y: y2 }) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  let rx,
    ry = 0;

  if (dx > 0) rx = x2 - 1;
  if (dx < 0) rx = x2 + 1;
  if (dx === 0) rx = x1;

  if (dy > 0) ry = y2 - 1;
  if (dy < 0) ry = y2 + 1;
  if (dy === 0) ry = y1;

  return { x: rx, y: ry };
}

export { coordinateToIndex, calculateCollisionResult, timeout };
