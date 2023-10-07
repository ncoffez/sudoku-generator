<template>
<main class="container">
	<div class="board" id="problem" v-if="!showSolution">
		<h2>Sudoku of the day</h2>
		<Grid :grid="sudoku.problem.value" />
	</div>
	<div class="board" id="solution" v-if="showSolution">
		<h2>Solution</h2>
		<Grid :grid="sudoku.solution.value" />
	</div>
	<button id="show-solution" class="secondary outline" @click="showSolution = !showSolution">Show Solution</button>
	<button id="new-grid" @click="newGrid()">Create new grid</button>
</main>
</template>
<script lang="ts" setup>
import { Sudoku } from '~/composables/sudoku'

const showSolution = ref(false)
let sudoku: Ref<Sudoku> = ref(new Sudoku())
onMounted(() => sudoku.value = new Sudoku('new'));

const newGrid = () => (sudoku.value = new Sudoku('new'))

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