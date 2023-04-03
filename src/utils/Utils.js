function calculatePossibleMoves(startLocation, shape, size) {
  let possibleMoves = [];
  const {x, y} = startLocation;
  switch (shape) {
    case "plus":
      possibleMoves = [
        { x: x + size, y: y },
        { x: x - size, y: y },
        { x: x, y: y + size },
        { x: x, y: y - size },
      ];
  }

  return possibleMoves;
}

function coordinateToIndex(x, y, size) {
  return (y - size) * size * -1 + x - 1;
}

export { calculatePossibleMoves, coordinateToIndex };
