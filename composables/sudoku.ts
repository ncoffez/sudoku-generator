import dummySudoku from "../data/dummy-sudoku.json";
import { _newProblem } from "./createProblem";
import { _newSolution } from "./createSolution";

export class Sudoku {
  problem: Grid;
  solution: Grid;

  constructor(type?: "new" | "dummy" | undefined, oldGrid?: Grid) {
    if (type === "dummy") {
      this.problem = new Grid(dummySudoku.problem as number[][]);
      this.solution = new Grid(dummySudoku.solution as number[][]);
    } else if (type === "new") {
      this.solution = _newSolution();
      this.problem = _newProblem(this.solution);
    } else {
      this.solution = new Grid(Array(81).fill(null));
      this.problem = new Grid(Array(81).fill(null));
    }
  }
}

export class Grid {
  value: number[][] = [];
  constructor(oldGrid: number[][] | number[]) {
    if (typeof oldGrid[0] === "number") this.value = convertTo9x9(oldGrid as number[]);
    else {
      this.value = oldGrid as number[][];
    }
  }
  readonly row = (n: number) => {
    if (n <= 0 || n > 9) throw Error("Row index is out of range.");
    return this.value[n - 1];
  };
  readonly column = (n: number) => {
    if (n <= 0 || n > 9) throw Error("Column index is out of range.");
    return this.value.map((v) => v[n - 1]).flat();
  };
  readonly square = (n: number) => {
    if (n <= 0 || n > 9) throw Error("Square index is out of range.");

    const position = {
      x: (n - 1) % 3, // Can be [0,1,2]
      y: Math.floor((n - 1) / 3), // Can be [0,1,2]
    };

    return this.value
      .slice(position.y * 3, (position.y + 1) * 3)
      .map((v) => v.slice(position.x * 3, position.x * 3 + 3))
      .flat();
  };
}
