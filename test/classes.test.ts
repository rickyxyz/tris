import { describe, it, expect } from "vitest";
import { testPlayer, testLevel } from "./testData";
import Stage from "../src/classes/Stage";
import * as Move from "../src/classes/Move";

const testStage = Stage(testPlayer, testLevel);

describe("Stage", () => {
  it("Constructor should return the correct object", () => {
    expect(testStage).toBeTypeOf("object");
  });

  it("Stage reset should return the original stage", () => {
    expect(JSON.stringify(testStage.reset())).toEqual(
      JSON.stringify(testStage)
    );
  });
});

describe("Move", () => {
  it("getClickableArea should return a plus shape", () => {
    expect(
      Move.getClickableArea(testStage, "player", {
        name: "",
        action: {
          direction: "plus",
          range: 2,
        },
      })
    ).toEqual([
      { x: 3, y: 4 },
      { x: 3, y: 5 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
    ]);
  });

  it("getClickableArea should return an x shape", () => {
    expect(
      Move.getClickableArea(testStage, "player", {
        name: "",
        action: {
          direction: "cross",
          range: 2,
        },
      })
    ).toEqual([
      { x: 4, y: 4 },
      { x: 5, y: 5 },
      { x: 2, y: 4 },
      { x: 1, y: 5 },
      { x: 4, y: 2 },
      { x: 5, y: 1 },
      { x: 2, y: 2 },
      { x: 1, y: 1 },
    ]);
  });

  it("getClickableArea should return a diamond shape", () => {
    expect(
      Move.getClickableArea(testStage, "player", {
        name: "",
        action: {
          direction: "radius",
          range: 2,
        },
      })
    ).toEqual([
      { x: 3, y: 3 },
      { x: 2, y: 3 },
      { x: 1, y: 3 },
      { x: 2, y: 2 },
      { x: 2, y: 4 },
      { x: 3, y: 2 },
      { x: 3, y: 1 },
      { x: 4, y: 2 },
      { x: 4, y: 3 },
      { x: 5, y: 3 },
      { x: 4, y: 4 },
      { x: 3, y: 4 },
      { x: 3, y: 5 },
    ]);
  });
});
