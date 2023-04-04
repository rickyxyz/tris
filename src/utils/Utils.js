function rangeBetween(start, end, step = 1) {
  let arr = [];
  if (end > start) {
    for (let i = start; i <= end; i += step) {
      arr.push(i);
    }
  }
  return arr;
}

function calculatePossibleMoves({x, y}, shape, range, bound) {
  let possibleMoves = [];
  switch (shape) {
    case "plus":
      possibleMoves = [
        ...rangeBetween(1, range).map(dx => ({x: x + dx, y: y})),
        ...rangeBetween(1, range).map(dx => ({x: x - dx, y: y})),
        ...rangeBetween(1, range).map(dy => ({x: x, y: y + dy})),
        ...rangeBetween(1, range).map(dy => ({x: x, y: y - dy}))
      ];
      break;
    case "cross":
      possibleMoves = [
        ...rangeBetween(1, range).map(dxy => ({x: x + dxy, y: y +dxy})),
        ...rangeBetween(1, range).map(dxy => ({x: x - dxy, y: y + dxy})),
        ...rangeBetween(1, range).map(dxy => ({x: x + dxy, y: y - dxy})),
        ...rangeBetween(1, range).map(dxy => ({x : x - dxy, y: y - dxy}))
      ];
      break;
  }

  possibleMoves = possibleMoves.filter(
    ({ x, y }) => y > 0 && x > 0 && y <= bound && x <= bound
  );

  return possibleMoves;
}

function coordinateToIndex({x, y}, size) {
  return (y - size) * size * -1 + x - 1;
}

function calculateCollisionResult({x:x1, y:y1}, {x:x2, y:y2}) {
  const dx = x2 - x1;
  const dy = y2 - y1;

  let rx, ry = 0;

  if(dx > 0) rx = x2 - 1;
  if(dx < 0) rx = x2 + 1;
  if(dx === 0) rx = x1;

  if(dy > 0) ry = y2 - 1;
  if(dy < 0) ry = y2 + 1;
  if(dy === 0) ry = y1;

  return {x: rx, y: ry};
}

export { calculatePossibleMoves, coordinateToIndex, calculateCollisionResult };
