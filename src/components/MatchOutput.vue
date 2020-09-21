<template>
	<div class="flex flex-col flex-1 pt-3 px-4 border-l border-gray-100">
        <h2 class="text-center font-medium">Matches</h2>
		
		<div 
		class="pt-4"
		:key="`match_${index}`"
		v-for="(match, index) in matches">
			<p class="font-medium py-2">Match {{ index+1 }}</p>
			<table class="w-full">
				<tr 
				class="border-b border-gray-400"
				:key="`match_${index}_group_${groupIndex}`"
				v-for="(group, groupIndex) in match">
					<td class="p-2">
						<span v-if="groupIndex === 0">Full match</span>
						<span v-else>{{ groups[groupIndex-1] || `Group ${groupIndex}` }}</span>
					</td>
					<td class="bg-gray-100 p-2"><pre class="bg-gray-100 w-full">{{ group }}</pre></td>
				</tr>
			</table>
		</div>

    </div>
</template>
<script>
import PCRE from 'pcre-to-regexp';

export default {
	props: ['expression', 'flags', 'matchString'],
	data() {
		return {
			groups: [],
			matches: [],
		}
	},
	methods: {
		getMatches() {
			try {
				let regex;
				this.groups = [];

				try {
					regex = PCRE(`/${this.expression}/${this.flags.join('')}`, this.groups);
				} catch (err){
					regex = new RegExp(this.expression, this.flags.join(''));
				}
				let m;
				
				this.matches = [];

				while ((m = regex.exec(this.matchString)) !== null) {
					if (m.index === regex.lastIndex) {
						regex.lastIndex++;
					}
					this.matches.push(m);
				}
			} catch (err) {
				//
				console.log(err);
			}
		}
	},
	watch: {
		expression() { this.getMatches() },
		flags() { this.getMatches() },
		matchString() { this.getMatches() },
	}
}
</script>