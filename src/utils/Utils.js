function rangeBetween(start, end, step = 1) {
  let arr = [];
  if (end > start) {
    for (let i = start; i <= end; i += step) {
      arr.push(i);
    }
  }
  return arr;
}

function calculatePossibleMoves(startLocation, shape, range, bound) {
  let possibleMoves = [];
  const { x, y } = startLocation;
  switch (shape) {
    case "plus":
      console.log("plus");
      possibleMoves = [
        ...rangeBetween(1, range).map(dx => ({x: x + dx, y: y})),
        ...rangeBetween(1, range).map(dx => ({x: x - dx, y: y})),
        ...rangeBetween(1, range).map(dy => ({x: x, y: y + dy})),
        ...rangeBetween(1, range).map(dy => ({x: x, y: y - dy}))
      ];
      break;
    case "cross":
      console.log("cross");
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

function coordinateToIndex(x, y, size) {
  return (y - size) * size * -1 + x - 1;
}

export { calculatePossibleMoves, coordinateToIndex };
