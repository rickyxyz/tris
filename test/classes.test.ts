import { describe, it, expect } from "vitest";
import { testPlayer, testLevel1, testLevel2 } from "./testData";
import Stage from "../src/classes/Stage";
import * as Move from "../src/classes/Move";

const testStage1 = Stage(testPlayer, testLevel1);
const testStage2 = Stage(testPlayer, testLevel2);

describe("Stage", () => {
  it("Constructor should return the correct object", () => {
    expect(testStage1).toBeTypeOf("object");
  });

  it("Stage reset should return the original stage", () => {
    expect(JSON.stringify(testStage1.reset())).toEqual(
      JSON.stringify(testStage1)
    );
  });
});

describe("Move.getClickableArea", () => {
  it("getClickableArea should return a plus shape", () => {
    expect(
      Move.getClickableArea(testStage1, "player", {
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
      Move.getClickableArea(testStage1, "player", {
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
      Move.getClickableArea(testStage1, "player", {
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

describe("Move.execute", () => {
  it("attacking enemy should reduce enemy health", () => {
    Move.execute(
      testStage2,
      "player",
      {
        name: "",
        action: {
          type: "attack",
          direction: "cross",
          range: 2,
          damage: 1,
        },
      },
      { x: 2, y: 2 }
    );
    expect(testStage2.entities[0].health).toBe(1);
  });
});
