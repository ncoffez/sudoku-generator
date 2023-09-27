import { expect, test, describe, beforeEach, beforeAll } from 'bun:test'
import { Sudoku } from './sudoku'

let sudoku: Sudoku
const sortedArray = [1, 2, 3, 4, 5, 6, 7, 8, 9]

describe('Dummy data', () => {
	beforeEach(() => {
		sudoku = new Sudoku('dummy')
	})

	test('Sudoku is an array of 9x9', () => {
		expect(sudoku.problem).toBeArray
		expect(sudoku.problem).toBeArrayOfSize(9)
		sudoku.problem.value.forEach(val => {
			expect(val).toBeArrayOfSize(9)
		})
		expect(sudoku.solution).toBeArray
		expect(sudoku.solution).toBeArrayOfSize(9)
		sudoku.solution.value.forEach(val => {
			expect(val).toBeArrayOfSize(9)
		})
	})

	test('sudoku.row works properly', () => {
		expect(sudoku.solution.row(1)).toEqual([5, 4, 3, 1, 7, 9, 8, 2, 6])
		expect(sudoku.solution.row(2)).toEqual([8, 6, 9, 3, 2, 5, 4, 1, 7])
		expect(sudoku.solution.row(3)).toEqual([1, 7, 2, 6, 4, 8, 9, 5, 3])
		expect(sudoku.solution.row(4)).toEqual([6, 3, 4, 9, 1, 2, 7, 8, 5])
		expect(sudoku.solution.row(5)).toEqual([9, 1, 7, 8, 5, 3, 6, 4, 2])
		expect(sudoku.solution.row(6)).toEqual([2, 5, 8, 7, 6, 4, 3, 9, 1])
		expect(sudoku.solution.row(7)).toEqual([3, 9, 5, 2, 8, 6, 1, 7, 4])
		expect(sudoku.solution.row(8)).toEqual([7, 2, 6, 4, 9, 1, 5, 3, 8])
		expect(sudoku.solution.row(9)).toEqual([4, 8, 1, 5, 3, 7, 2, 6, 9])
	})

	test('sudoku.column works properly', () => {
		expect(sudoku.solution.column(1)).toEqual([5, 8, 1, 6, 9, 2, 3, 7, 4])
		expect(sudoku.solution.column(2)).toEqual([4, 6, 7, 3, 1, 5, 9, 2, 8])
		expect(sudoku.solution.column(3)).toEqual([3, 9, 2, 4, 7, 8, 5, 6, 1])
		expect(sudoku.solution.column(4)).toEqual([1, 3, 6, 9, 8, 7, 2, 4, 5])
		expect(sudoku.solution.column(5)).toEqual([7, 2, 4, 1, 5, 6, 8, 9, 3])
		expect(sudoku.solution.column(6)).toEqual([9, 5, 8, 2, 3, 4, 6, 1, 7])
		expect(sudoku.solution.column(7)).toEqual([8, 4, 9, 7, 6, 3, 1, 5, 2])
		expect(sudoku.solution.column(8)).toEqual([2, 1, 5, 8, 4, 9, 7, 3, 6])
		expect(sudoku.solution.column(9)).toEqual([6, 7, 3, 5, 2, 1, 4, 8, 9])
	})

	test('sudoku.square works properly', () => {
		expect(sudoku.solution.square(1)).toEqual([5, 4, 3, 8, 6, 9, 1, 7, 2])
		expect(sudoku.solution.square(2)).toEqual([1, 7, 9, 3, 2, 5, 6, 4, 8])
		expect(sudoku.solution.square(3)).toEqual([8, 2, 6, 4, 1, 7, 9, 5, 3])
		expect(sudoku.solution.square(4)).toEqual([6, 3, 4, 9, 1, 7, 2, 5, 8])
		expect(sudoku.solution.square(5)).toEqual([9, 1, 2, 8, 5, 3, 7, 6, 4])
		expect(sudoku.solution.square(6)).toEqual([7, 8, 5, 6, 4, 2, 3, 9, 1])
		expect(sudoku.solution.square(7)).toEqual([3, 9, 5, 7, 2, 6, 4, 8, 1])
		expect(sudoku.solution.square(8)).toEqual([2, 8, 6, 4, 9, 1, 5, 3, 7])
		expect(sudoku.solution.square(9)).toEqual([1, 7, 4, 5, 3, 8, 2, 6, 9])
	})

	test('Has no duplicate values', () => {
		for (let i = 1; i <= 9; i++) {
			expect(sudoku.solution.row(i).sort((a, b) => a - b)).toEqual(sortedArray)
			expect(sudoku.solution.column(i).sort((a, b) => a - b)).toEqual(sortedArray)
			expect(sudoku.solution.square(i).sort((a, b) => a - b)).toEqual(sortedArray)
		}
	})
})

describe('Grid creation', () => {
	beforeAll(() => {
		sudoku = new Sudoku('new')
		console.log('sudoku.solution', sudoku.solution.value.flat().join(''))
	})
	test('Sudoku is an array of 9x9', () => {
		expect(sudoku.problem).toBeArray
		expect(sudoku.problem).toBeArrayOfSize(9)
		sudoku.problem.value.forEach(val => {
			expect(val).toBeArrayOfSize(9)
		})
		expect(sudoku.solution).toBeArray
		expect(sudoku.solution).toBeArrayOfSize(9)
		sudoku.solution.value.forEach(val => {
			expect(val).toBeArrayOfSize(9)
		})
	})

	test('Has no duplicate rows', () => {
		for (let i = 1; i <= 9; i++) {
			expect(sudoku.solution.row(i).sort((a, b) => a - b)).toEqual(sortedArray)
		}
	})

	test('Has no duplicate columns', () => {
		for (let i = 1; i <= 9; i++) {
			expect(sudoku.solution.column(i).sort((a, b) => a - b)).toEqual(sortedArray)
		}
	})

	test('Has no duplicate squares', () => {
		for (let i = 1; i <= 9; i++) {
			expect(sudoku.solution.square(i).sort((a, b) => a - b)).toEqual(sortedArray)
		}
	})
})
