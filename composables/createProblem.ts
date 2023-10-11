import { Grid } from "./sudoku";

export function _newProblem(solution: Grid): Grid {
  let problem = [...solution.value].flat();

  // while (gridHasUniqueSolution(problem));
  return solution;
}

function gridHasUniqueSolution(problem: number[]) {
  return true;
}

export function createInverse(problem: number[]): (number[] | null)[] {
  const inverse = [...problem].map((v, i) => {
    if (v !== null) return null;
    return findValidValues(i, problem);
  });
  console.log(problem);
  printGridToConsole(inverse);
  return inverse;
}
