import dummySudoku from '../data/dummy-sudoku.json'

export class Sudoku {
	problem: Grid
	solution: Grid

	constructor(type: 'new' | 'dummy', oldGrid?: Grid) {
		if (type === 'dummy') {
			this.problem = new Grid(dummySudoku.problem as number[][])
			this.solution = new Grid(dummySudoku.solution as number[][])
		} else {
			this.solution = _newGrid()
			this.problem = _newProblem(this.solution)
		}
	}
}

function _newGrid(): Grid {
	let gridAsArray = Array(81).fill(null)

	function isValid(num: number, pos: number, grid: (number | null)[]): boolean {
		const [row, col] = [Math.floor(pos / 9), pos % 9]
		// Check row
		for (let i = 0; i < 9; i++) {
			if (grid[row * 9 + i] === num) return false
		}
		// Check column
		for (let i = 0; i < 9; i++) {
			if (grid[i * 9 + col] === num) return false
		}
		// Check square
		const startRow = Math.floor(row / 3) * 3
		const startCol = Math.floor(col / 3) * 3
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				if (grid[(startRow + i) * 9 + (startCol + j)] === num) return false
			}
		}
		return true
	}

	function solve(grid: (number | null)[]): boolean {
		for (let i = 0; i < 81; i++) {
			if (grid[i] === null) {
				for (let num = 1; num <= 9; num++) {
					if (isValid(num, i, grid)) {
						grid[i] = num
						if (solve(grid)) return true
						grid[i] = null
					}
				}
				return false
			}
		}
		return true
	}

	solve(gridAsArray)
	return new Grid(convertTo9x9(gridAsArray))
}

function _newGridWithFlaws(): Grid {
	let skips = 0,
		iterations = 0
	let gridAsArray: number[] = Array(81).fill(null)
	gridAsArray.forEach((val, i) => {
		if (val !== null) return
		let newValue: number
		for (let index = 0; index <= 50; index++) {
			++iterations
			let newGrid = [...gridAsArray]
			newValue = _randomNumber()
			newGrid[i] = newValue
			let currentErrors = countErrors(new Grid(convertTo9x9(newGrid)))
			if (currentErrors === 0) {
				gridAsArray[i] = newValue
			}
			if (index === 50) {
				skips++
			}
		}
	})
	console.log(
		`Generated new Grid in ${iterations} iterations with ${skips} skips. The grid has ${countErrors(
			new Grid(convertTo9x9(gridAsArray))
		)} errors.`,
		convertTo9x9(gridAsArray)
	)
	return new Grid(convertTo9x9(gridAsArray))
}

function _newGridWithRandom(): Grid {
	let grid: number[][] = [...Array.from({ length: 9 }, () => _randomizeArray())]
	let i = 0
	for (; i < 10000 && countErrors(new Grid(grid)) > 0; i++) {
		let newGrid = [...grid]
		const randomNumber = Math.floor(Math.random() * 9)
		newGrid[randomNumber] = [..._randomizeArray()]

		const errors = { new: countErrors(new Grid(newGrid)), old: countErrors(new Grid(grid)) }
		if (errors.new < errors.old) {
			grid = [...newGrid]
			console.log(`🔥 Improved on ${i}!!`)
		} else if (errors.new === errors.old) {
			grid = [...newGrid]
		}
	}
	console.log(
		`New grid generated after ${i} iterations. It has ${countErrors(new Grid(grid))} errors.`,
		grid
	)
	return new Grid(grid)
}

function _newProblem(solution: Grid): Grid {
	return solution
}

function _randomizeArray() {
	const array = [1, 2, 3, 4, 5, 6, 7, 8, 9]
	let shuffledArray = array.slice()
	for (let i = shuffledArray.length - 1; i > 0; i--) {
		const j: number = Math.floor(Math.random() * (i + 1))
		;[shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]]
	}
	return shuffledArray
}
export function countErrors(grid: Grid): number {
	let errors = 0
	const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]

	for (let i = 0; i < 9; i++) {
		const row = grid
			.row(i + 1)
			.slice()
			.sort((a, b) => a - b)
		const column = grid
			.column(i + 1)
			.slice()
			.sort((a, b) => a - b)
		const square = grid
			.square(i + 1)
			.slice()
			.sort((a, b) => a - b)

		if (!isValidArray(row)) errors++
		if (!isValidArray(column)) errors++
		if (!isValidArray(square)) errors++
	}
	return errors
}

function isValidArray(arr: (number | null)[]): boolean {
	// Check for length of 9
	if (arr.length !== 9) {
		return false
	}

	// Filter out null values
	const nonNullValues = arr.filter(val => val !== null)

	// Check for duplicate non-null values
	const uniqueValues = new Set(nonNullValues)
	if (nonNullValues.length !== uniqueValues.size) {
		return false
	}

	// Check for values < 1 or > 9
	if (nonNullValues.length === 0) return true
	for (const val of nonNullValues) {
		if (val! < 1 || val! > 9) {
			return false
		}
	}

	return true
}

export class Grid {
	value: number[][] = []
	constructor(oldGrid: number[][]) {
		this.value = oldGrid
	}
	readonly row = (n: number) => {
		if (n <= 0 || n > 9) throw Error('Row index is out of range.')
		return this.value[n - 1]
	}
	readonly column = (n: number) => {
		if (n <= 0 || n > 9) throw Error('Column index is out of range.')
		return this.value.map(v => v[n - 1]).flat()
	}
	readonly square = (n: number) => {
		if (n <= 0 || n > 9) throw Error('Square index is out of range.')

		const position = {
			x: (n - 1) % 3, // Can be [0,1,2]
			y: Math.floor((n - 1) / 3), // Can be [0,1,2]
		}

		return this.value
			.slice(position.y * 3, (position.y + 1) * 3)
			.map(v => v.slice(position.x * 3, position.x * 3 + 3))
			.flat()
	}
}

function convertTo9x9(arr: number[]): number[][] {
	if (arr.length !== 81) {
		throw new Error('Input array must have exactly 81 elements.')
	}

	const result: number[][] = []

	for (let i = 0; i < 9; i++) {
		const row: number[] = []
		for (let j = 0; j < 9; j++) {
			row.push(arr[i * 9 + j])
		}
		result.push(row)
	}

	return result
}

function _randomNumber() {
	return Math.floor(Math.random() * 9 + 1)
}
