import { Grid } from "./sudoku";

export function _randomNumber() {
  return Math.floor(Math.random() * 9 + 1);
}
export function convertTo9x9(arr: number[]): number[][] {
  if (arr.length !== 81) {
    throw new Error("Input array must have exactly 81 elements.");
  }

  const result: number[][] = [];

  for (let i = 0; i < 9; i++) {
    const row: number[] = [];
    for (let j = 0; j < 9; j++) {
      row.push(arr[i * 9 + j]);
    }
    result.push(row);
  }

  return result;
}
export function isValidArray(arr: (number | null)[]): boolean {
  // Check for length of 9
  if (arr.length !== 9) {
    return false;
  }

  // Filter out null values
  const nonNullValues = arr.filter((val) => val !== null);

  // Check for duplicate non-null values
  const uniqueValues = new Set(nonNullValues);
  if (nonNullValues.length !== uniqueValues.size) {
    return false;
  }

  // Check for values < 1 or > 9
  if (nonNullValues.length === 0) return true;
  for (const val of nonNullValues) {
    if (val! < 1 || val! > 9) {
      return false;
    }
  }

  return true;
}
export function fieldIsValid(num: number, pos: number, grid: (number | null)[]): boolean {
  const [row, col] = [Math.floor(pos / 9), pos % 9];
  // Check row
  for (let i = 0; i < 9; i++) {
    if (grid[row * 9 + i] === num) return false;
  }
  // Check column
  for (let i = 0; i < 9; i++) {
    if (grid[i * 9 + col] === num) return false;
  }
  // Check square
  const startRow = Math.floor(row / 3) * 3;
  const startCol = Math.floor(col / 3) * 3;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (grid[(startRow + i) * 9 + (startCol + j)] === num) return false;
    }
  }
  return true;
}
export function randomizeArray(array: number[]) {
  let shuffledArray = array.slice();
  for (let i = shuffledArray.length - 1; i > 0; i--) {
    const j: number = Math.floor(Math.random() * (i + 1));
    [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
  }
  return shuffledArray;
}
export function countErrors(grid: Grid): number {
  let errors = 0;
  const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  for (let i = 0; i < 9; i++) {
    const row = grid
      .row(i + 1)
      .slice()
      .sort((a, b) => a - b);
    const column = grid
      .column(i + 1)
      .slice()
      .sort((a, b) => a - b);
    const square = grid
      .square(i + 1)
      .slice()
      .sort((a, b) => a - b);

    if (!isValidArray(row)) errors++;
    if (!isValidArray(column)) errors++;
    if (!isValidArray(square)) errors++;
  }
  return errors;
}
export function printGridToConsole(array: (number | number[] | null)[]) {
  if (array.length !== 81) {
    console.error("Array must have 81 elements.");
    return;
  }

  let gridObject: any = {};
  for (let i = 0; i < 9; i++) {
    let row = [];
    for (let j = 0; j < 9; j++) {
      row.push(array[i * 9 + j]);
    }
    gridObject[`Row ${i + 1}`] = row.map((v) => v?.toString());
  }
  console.table(gridObject);
  return null;
}
export function missingIndices(grid: (number | null)[]): number[] {
  return grid.map((v, i) => (v === null ? i : "notMissing")).filter((v) => v !== "notMissing") as number[];
}
export function findValidValues(index: number, grid: number[]): number[] {
  if (typeof index !== "number") throw new Error("Index is missing.");
  const grid9x9 = new Grid(convertTo9x9(grid));
  const defaultArray = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  const position = getPosition(index);
  const row = grid9x9.row(position.row + 1).filter((v) => v !== null);
  const column = grid9x9.column(position.column + 1).filter((v) => v !== null);
  const square = grid9x9.square(position.square + 1).filter((v) => v !== null);

  const missingRowValues = defaultArray.filter((v) => !row.includes(v));
  const missingColumnValues = defaultArray.filter((v) => !column.includes(v));
  const missingSquareValues = defaultArray.filter((v) => !square.includes(v));

  const validValues = missingRowValues
    .filter((v) => missingColumnValues.includes(v))
    .filter((v) => missingSquareValues.includes(v));

  return validValues;
}
export function getPosition(index: number): { row: number; column: number; square: number } {
  if (index >= 81 || index < 0) throw new Error("Index is out of range.");

  const [row, col] = [Math.floor(index / 9), index % 9];
  const squareRow = Math.floor(row / 3) * 3;
  const squareCol = Math.floor(col / 3) * 3;

  // console.log({ row, column: col, square: squareRow + squareCol / 3 });
  return { row, column: col, square: squareRow + squareCol / 3 };
}
