<template>
  <div class="h-full w-full flex flex-col">
    <h1 class="text-center font-bold text-xl py-4">RegExpress</h1>
    <div class="flex flex-row flex-1">
      <div class="flex flex-col flex-1">
        <div class="flex flex-col flex-1 w-full">
            <Input 
              @expressionChanged="updateRegex"
              :expression="regex.expression"
            />
            <Matches
              @matchesChanged="updateMatches"
              :expression="regex.expression"
              :flags="regex.flags"
            />            
            <Visualization 
            :expression="regex.expression" 
            :flags="regex.flags" />
        </div>
      </div>
      <div class="px-8">
        <MatchOutput 
          :expression="regex.expression" 
          :flags="regex.flags" 
          :match-string="matches" />
      </div>
    </div>
  </div>
</template>

<script>
const Store = require('electron-store');

import Input from './components/Input';
import Matches from './components/Matches';
import Visualization from './components/Visualization';
import MatchOutput from './components/MatchOutput';

const store = new Store({
  watch: true,
});

export default {
  name: 'App',
  components: {
    Input,
    Matches,
    Visualization,
    MatchOutput,
  },
  data() {
    return {
      licenseKey: store.get('licenseKey', ''),
      email: store.get('email', ''),
      matches: '',
      regex: {
        expression: '',
        flags: ['g', 'm']
      }
    }
  },
  computed: {
  },
  mounted() {
    store.onDidChange('licenseKey', (newValue) => {
      this.licenseKey = newValue;
    })
    store.onDidChange('email', (newValue) => {
      this.email = newValue;
    })
  },
  methods: {
    updateRegex(event) {
      this.regex.expression = event.regex;
      this.regex.flags = event.flags;
    },

    updateMatches(event) {
      this.matches = event.matches;
    }
  }
}
</script>

<style src="./assets/tailwind.css"></style>

<style>
html, body {
  height: 100%;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
