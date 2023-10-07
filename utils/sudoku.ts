import dummySudoku from "../data/dummy-sudoku.json";

export class Sudoku {
  problem: Grid;
  solution: Grid;

  constructor(type?: "new" | "dummy", oldGrid?: Grid) {
    if (type === "dummy") {
      this.problem = new Grid(dummySudoku.problem as number[][]);
      this.solution = new Grid(dummySudoku.solution as number[][]);
    } else {
      this.solution = _newGrid();
      this.problem = _newProblem(this.solution);
    }
  }
}

function _newGrid(): Grid {
  let grid = Array(81).fill(null);
  let progress = `0 of 81`;

  grid = fillGrid(grid);
  const storedGrid = [...grid];
  try {
    grid = solve(grid);
  } catch {
    return _newGrid();
  }
  return new Grid(convertTo9x9(grid));
}

function fillGrid(grid: (number | null)[]): (number | null)[] {
  for (const num of [1, 2, 3, 4, 5, 6, 7]) {
    let placed = 0;
    const indices = missingIndices(grid);
    if (indices.length === 0) return grid;

    do {
      const randomizedIndices = randomizeArray(indices);
      placed = grid.filter((v) => v === num).length;
      console.assert(placed <= 9, `Placed is greater than 9 for num ${num}.`);
      if (placed === 9) break;

      for (const position of randomizedIndices) {
        if (isValid(num, position, grid)) {
          grid[position] = num;
          if (++placed >= 9) break;
        }
      }
      // If we reach here, no valid move was found; backtrack
      if (placed < 9) {
        grid = grid.map((v) => (v === num ? null : v));
        console.assert(grid.filter((v) => v === num).length === 0, `Wasn't able to backtrack for num ${num}.`);
      }
    } while (placed < 9);
  }
  console.assert(missingIndices(grid).length % 9 === 0, "Not missing a multiple of 9 fields.");
  if (missingIndices(grid).length > 18) grid = fillGrid(grid);
  return grid;
}

function solve(gridToSolve: number[]): number[] {
  const indices = missingIndices(gridToSolve);
  if (indices.length > 18) throw new Error("The solver will only work if there is 18 or less missing values.");

  const solvableGrid = indices.toSorted(
    (a, b) => findValidValues(a, gridToSolve).length - findValidValues(b, gridToSolve).length
  );
  const solution: number[] = findValidValues(solvableGrid[0], gridToSolve);
  if (solution.length === 0) throw new Error("No solution exists.");
  gridToSolve[solvableGrid[0]] = solution[0];

  if (missingIndices(gridToSolve).length > 0) gridToSolve = solve(gridToSolve);
  return gridToSolve;
}

function _newProblem(solution: Grid): Grid {
  return solution;
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
