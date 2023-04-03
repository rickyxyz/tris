function calculatePossibleMoves(startLocation, shape, range, bound) {
  let possibleMoves = [];
  const {x, y} = startLocation;
  switch (shape) {
    case "plus":
      possibleMoves = [
        { x: x + range, y: y },
        { x: x - range, y: y },
        { x: x, y: y + range },
        { x: x, y: y - range },
      ];
  }

  possibleMoves = possibleMoves.filter(({x, y}) => y > 0 && x > 0 && y < bound && x < bound);

  return possibleMoves;
}

function coordinateToIndex(x, y, size) {
  return (y - size) * size * -1 + x - 1;
}

export { calculatePossibleMoves, coordinateToIndex };
