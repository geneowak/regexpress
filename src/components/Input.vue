<template>
	<div>
		<div class="font-sans py-2 px-4 text-gray-900 font-normal text-lg content-center w-full bg-gray-200 flex">
			<p class="font-bold">/</p>
			<div class="font-sans flex-grow focus:outline-none text-left px-2 regex"
				id="regex-input"
				ref="expressionInput"
				@keyup="expressionChanged"
				@blur="colorize"
				contenteditable></div>
				<tippy
					interactive
					:animate-fill="false"
					trigger="click"
					theme="light outline-none"
					placement="bottom"
					>
					<template v-slot:trigger>
						<p class="font-bold cursor-pointer">/{{ flags.join('') }}</p>
					</template>
					<div>
						<ul class="text-left">
							<li 
							v-for="flag in availableFlags"
							:key="flag.flag"
							class="py-2 px-4 hover:bg-gray-200 cursor-pointer border-b border-gray-200" @click="toggleFlag(flag.flag)">
								<div class="flex pb-2 justify-center">
									<p class="pr-2 flex-grow">{{ flag.name }}</p>
									<p v-if="flags.indexOf(flag.flag) !== -1">✅</p>
								</div>
								<span class="text-gray-600">{{ flag.hint }}</span>
							</li>
						</ul>
					</div>
				</tippy>
			</div>
	</div>
</template>
<script>
import 'regex-colorize/themes/sweetest.css';
import RegexColorize from 'regex-colorize';

const rgx = new RegexColorize();


export default {
	props: [
		'expression'
	],
	data() {
		return {
			flags: ['g', 'm'],
			availableFlags: [
				{
					flag: 'g',
					name: 'global',
					hint: 'Don\'t return after first match'
				},
				{
					flag: 'm',
					name: 'multi line',
					hint: '^ and $ match start/end of line'
				},
				{
					flag: 'i',
					name: 'insensitive',
					hint: 'Case insensitive match'
				},
				{
					flag: 's',
					name: 'single line',
					hint: 'Dot matches newline'
				},
				{
					flag: 'u',
					name: 'unicode',
					hint: 'Match wih full unicode'
				},
				{
					flag: 'y',
					name: 'sticky',
					hint: 'Proceed matching from where previous match ended only'
				},
			],
			debounceTimeout: null,
		};
	},
	methods: {
		colorize() {
			rgx.colorizeAll()
		},
		toggleFlag(flag) {
			if (this.flags.indexOf(flag) === -1) {
				this.flags.push(flag);
			} else {
				this.flags.splice(this.flags.indexOf(flag), 1);
			}

			this.$emit('expressionChanged', {
				regex: this.$refs.expressionInput.innerText,
				flags: this.flags
			})
		},
		expressionChanged() {
			clearTimeout(this.debounceTimeout);

			this.debounceTimeout = setTimeout(() => {
				this.$emit('expressionChanged', {
					regex: this.$refs.expressionInput.innerText,
					flags: this.flags
				})
			}, 700);
		}
	}
};
</script>
<style>
.tippy-tooltip {
	@apply p-0;
}
*:focus {
	@apply outline-none;
}
</style>