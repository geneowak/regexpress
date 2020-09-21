<template>
  <div class="w-full overflow-auto">
    <div
      id="output"
      ref="output"
      class="bg-gray-100 py-4 w-full border-t border-gray-200 flex justify-center items-end"
    ></div>
  </div>
</template>
<script>
import { parse, visualize, Raphael } from "@/lib/regulex";
import PCRE from "pcre-to-regexp";
import { ipcRenderer } from "electron";
import html2canvas from "html2canvas";
let paper;

export default {
  props: ["expression", "flags"],
  data() {
    return {};
  },
  methods: {
    drawSvg() {
      try {
        let regex;

        try {
          regex = PCRE(`/${this.expression}/${this.flags.join("")}`, this.groups);
        } catch (err) {
          regex = new RegExp(this.expression, this.flags.join(""));
        }

        visualize(parse(regex.source), regex.flags, paper);
      } catch (e) {
        if (e instanceof parse.RegexSyntaxError) {
          console.log(e);
        } else {
          throw e;
        }
      }
    },
  },
  watch: {
    expression() {
      this.drawSvg();
    },
    flags() {
      this.drawSvg();
    },
  },
  mounted() {
    paper = Raphael(this.$refs.output, 0, 0);

    ipcRenderer.on("saveVisualization", async () => {
      const canvas = await html2canvas(this.$refs.output);
      
      ipcRenderer.send('visualizationAvailable',{
        png: canvas.toDataURL('image/png')
      })
    });
  },
};
</script>
<style>
svg {
  margin-top: -20px;
}
svg > defs + rect {
  fill: transparent;
  stroke: transparent;
}
svg text[text-anchor="start"] {
  @apply hidden;
}
svg circle[fill="#52c41a"] {
  @apply fill-current;
  @apply text-green-400;
}
svg circle[fill="#597ef7"] {
  @apply fill-current;
  @apply text-blue-400;
}
svg rect[fill="#d3adf7"] {
  @apply fill-current;
  @apply text-green-600;
}
svg rect[fill="#bae7ff"] {
  @apply fill-current;
  @apply text-gray-400;
}
svg path[stroke="#391085"] {
  @apply stroke-current;
  @apply text-gray-800;
}
svg rect[fill="#ffc0cb"] {
  @apply fill-current;
  @apply text-red-400;
}
</style>