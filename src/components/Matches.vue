<template>
	<div ref="container" class="relative flex-1 m-4 text-lg overflow-none">
		<textarea 
			id="matches-input"
			class="absolute top-0 left-0 z-10 bg-transparent w-full h-full focus:outline-none" 
			v-model="matches" placeholder="Insert your test string here"></textarea>
		<div class="absolute top-0 left-0 w-full h-full whitespace-pre-wrap text-transparent break-all" 
        ref="matches" 
        v-text="matches"></div>
	</div>
</template>
<script>
import Mark from 'mark.js';
import PCRE from 'pcre-to-regexp';

import {ipcRenderer} from 'electron'

let instance;

export default {
	props: ['expression', 'flags'],
	data() {
		return {
			matches: '',
		}
	},
	mounted() {
		instance = new Mark(this.$refs.matches);

		ipcRenderer.on('matchFileSelected', (event, args) => {
			this.matches = args.contents;
		})
	},
	methods: {
		mark(regex) {
			const reg = PCRE(`/${regex}/${this.flags.join('')}`);

			instance.unmark();
			instance.markRegExp(reg);
		}
	},
	watch: {
		expression(value) {
			this.mark(value);
		},
		flags() {
			this.mark(this.expression);
		},
		matches() {
			this.$nextTick(() => {
				this.mark(this.expression);
			})
			this.$emit('matchesChanged', {
				matches: this.matches,
			})
		}
	}
}
</script>