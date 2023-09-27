<template>
	<main class="container">
		<div
			class="board"
			id="problem"
			v-if="!showSolution"
		>
			<h2>Sudoku of the day</h2>
			<div
				class="row"
				v-for="row of sudoku.problem.value"
			>
				<div
					class="field"
					v-for="field of row"
				>
					<span v-if="field !== null">{{ field }}</span>
					<input
						type="text"
						v-else
					/>
				</div>
			</div>
		</div>
		<div
			class="board"
			id="solution"
			v-if="showSolution"
		>
			<h2>Solution</h2>
			<div
				class="row"
				v-for="row of sudoku.solution.value"
			>
				<div
					class="field"
					v-for="field of row"
				>
					{{ field === null ? '' : field }}
				</div>
			</div>
		</div>
		<input
			type="number"
			v-model="query"
		/>

		<a
			id="show-solution"
			href="#"
			role="button"
			@click="showSolution = !showSolution"
			>Show Solution</a
		>
		<a
			id="new-grid"
			href="#"
			role="button"
			class="secondary outline"
			@click="newGrid()"
			>Create new grid</a
		>
	</main>
</template>
<script lang="ts" setup>
import { Sudoku } from '~/utils/sudoku'

const query = ref(0)
const showSolution = ref(false)
let sudoku: Sudoku = new Sudoku('dummy')
const newGrid = () => (sudoku = new Sudoku('new'))

onMounted(newGrid)

watch(query, val => {
	if (sudoku && val && val > 0 && val <= 9) {
		console.clear()
		console.table({
			[`row[${val}]`]: sudoku.solution.row(val),
			[`column[${val}]`]: sudoku.solution.column(val),
			[`square[${val}]`]: sudoku.solution.square(val),
		})
	}
})
</script>
<style scoped>
#show-solution {
	margin-block: 1em;
}

main {
	display: grid;
	justify-content: center;
}
</style>
