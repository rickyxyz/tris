function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function rangeBetween(start, end, step = 1) {
  let arr = [];
  if (end >= start) {
    for (let i = start; i <= end; i += step) {
      arr.push(i);
    }
  }
  return arr;
}

function calculateHorizontal({ x, y }, range, filled = true) {
  let res = [
    ...rangeBetween(1, range).map((dx) => ({ x: x + dx, y: y })),
    ...rangeBetween(1, range).map((dx) => ({ x: x - dx, y: y })),
  ];

  if (!filled) {
    res = res.filter(({ x: dx, _ }) => dx === x + range || dx === x - range);
  }

  return res;
}

function calculateVertical({ x, y }, range, filled = true) {
  let res = [
    ...rangeBetween(1, range).map((dy) => ({ x: x, y: y + dy })),
    ...rangeBetween(1, range).map((dy) => ({ x: x, y: y - dy })),
  ];

  if (!filled) {
    res = res.filter(({ _, y: dy }) => dy === y + range || dy === y - range);
  }

  return res;
}

function calculatePositiveDiagonal({ x, y }, range, filled = true) {
  let res = [
    ...rangeBetween(1, range).map((dxy) => ({ x: x - dxy, y: y + dxy })),
    ...rangeBetween(1, range).map((dxy) => ({ x: x + dxy, y: y - dxy })),
  ];

  if (!filled) {
    res = res.filter(
      ({ x: dx, y: dy }) =>
        (dx === x - range && dy === y + range) ||
        (dx === x + range && dy === y - range)
    );
  }

  return res;
}

function calculateNegativeDiagonal({ x, y }, range, filled = true) {
  let res = [
    ...rangeBetween(1, range).map((dxy) => ({ x: x + dxy, y: y + dxy })),
    ...rangeBetween(1, range).map((dxy) => ({ x: x - dxy, y: y - dxy })),
  ];

  if (!filled) {
    res = res.filter(
      ({ x: dx, y: dy }) =>
        (dx === x + range && dy === y + range) ||
        (dx === x - range && dy === y - range)
    );
  }

  return res;
}

function calculateRadius({ x, y }, range, filled = true) {
  let verticalArray = [{ x, y }, ...calculateVertical({ x, y }, range)].sort(
    (a, b) => b.y - a.y
  );
  let horizontalArray = [];

  if (!filled) {
    for (let i = 0; i < verticalArray.length; i++) {
      let width = Math.abs(Math.abs(verticalArray[i].y - y) - range);
      let arr = calculateHorizontal({ x, y: verticalArray[i].y }, width);
      arr = arr.filter(({ x: dx, _ }) => dx === x + width || dx === x - width);
      horizontalArray.push(...arr);
    }
    verticalArray = verticalArray.filter(
      ({ _, y: dy }) => dy === y + range || dy === y - range
    );
  } else {
    for (let i = 0; i < verticalArray.length; i++) {
      horizontalArray.push(
        ...calculateHorizontal(
          { x, y: verticalArray[i].y },
          Math.abs(Math.abs(verticalArray[i].y - y) - range)
        )
      );
    }
  }

  return [...verticalArray, ...horizontalArray];
}

function calculatePossibleMoves({ x, y }, shape, range, bound) {
  let possibleMoves = [];
  switch (shape) {
    case "plus":
      possibleMoves = [
        ...calculateHorizontal({ x, y }, range),
        ...calculateVertical({ x, y }, range),
      ];
      break;
    case "cross":
      possibleMoves = [
        ...calculatePositiveDiagonal({ x, y }, range),
        ...calculateNegativeDiagonal({ x, y }, range),
      ];
      break;
    case "radius":
      possibleMoves = [...calculateRadius({ x, y }, range)];
      break;
  }

  possibleMoves = possibleMoves.filter(
    ({ x, y }) => y > 0 && x > 0 && y <= bound && x <= bound
  );

  return possibleMoves;
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

export {
  calculatePossibleMoves,
  coordinateToIndex,
  calculateCollisionResult,
  timeout,
};
