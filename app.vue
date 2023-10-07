<template>
<main class="container">
	<div class="board" id="problem" v-if="!showSolution">
		<h2>Sudoku of the day</h2>
		<div class="row" v-for="row of sudoku.problem.value">
			<div class="field" v-for="(field, index) of row">
				<span v-if="field !== null">{{ field }}</span>
				<input type="text" v-else />
			</div>
		</div>
	</div>
	<div class="board" id="solution" v-if="showSolution">
		<h2>Solution</h2>
		<div class="row" v-for="row of sudoku.solution.value">
			<div class="field" v-for="field of row">
				{{ field === null ? '' : field }}
			</div>
		</div>
	</div>
	<a id="show-solution" class="secondary outline" href="#" role="button" @click="showSolution = !showSolution">Show
		Solution</a>
	<button id="new-grid" @click="newGrid()">Create new grid</button>
</main>
</template>
<script lang="ts" setup>
import { Sudoku } from '~/utils/sudoku'

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
