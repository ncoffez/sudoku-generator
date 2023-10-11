import { Grid } from "./sudoku";

export function _newSolution(): Grid {
  let grid = Array(81).fill(null);
  let progress = `0 of 81`;

  grid = fillGrid(grid);
  const storedGrid = [...grid];
  try {
    grid = solve(grid);
  } catch {
    return _newSolution();
  }
  return new Grid(convertTo9x9(grid));
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
        if (fieldIsValid(num, position, grid)) {
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
