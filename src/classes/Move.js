import { calculatePossibleMoves } from "../utils/Utils";

export default function Move(user, { name, action }) {
  function getClickableArea(boundary) {
    return calculatePossibleMoves(
      user.coordinate,
      action.direction,
      action.range,
      boundary
    );
  }

  function onClick(targetTile) {}

  return { colorMap: tileColorMap[action.type], name, getClickableArea };
}

const tileColorMap = {
  attack: {
    self: "white",
    empty: "blue",
    enemy: "red",
  },
  collateral: {
    self: "red",
    empty: "red",
    enemy: "red",
  },
};
