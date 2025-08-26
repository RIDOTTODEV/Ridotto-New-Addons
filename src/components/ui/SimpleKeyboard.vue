<template>
  <div :class="keyboardClass"></div>
</template>

<script>
import Keyboard from "simple-keyboard";
import "simple-keyboard/build/css/index.css";
import turkishLayout from "simple-keyboard-layouts/build/layouts/turkish";
export default {
  name: "SimpleKeyboard",
  props: {
    keyboardClass: {
      default: "simple-keyboard",
      type: String
    },
    input: {
      //type: String
    },
    inputName: {
      type: String
    },
    themeName: {
      type: String,
      default: () => "hg-theme-default myTheme1"
    }
  },
  data: () => ({
    keyboard: null
  }),
  mounted() {
    this.keyboard = new Keyboard({
      onChange: this.onChange,
      onKeyPress: this.onKeyPress,
      inputName: this.inputName,
      theme: `${this.themeName} myTheme1`,
      physicalKeyboardHighlight: true,
      //physicalKeyboardHighlightPress: true,
      display: {
        "{bksp}": "←",
        "{tab}": "Tab ⇄",
        "{lock}": "Caps Lock",
        "{enter}": "Enter↵",
        "{shift}": "⇑Shift",
        "{space}": "Space",
      },
      ...turkishLayout,

    });
    this.initTheme(this.themeName);
  },
  methods: {
    onChange(input) {
      this.$emit("onChange", input);
    },
    onKeyPress(button) {
      this.$emit("onKeyPress", button);

      /**
       * If you want to handle the shift and caps lock buttons
       */
      if (button === "{shift}" || button === "{lock}") this.handleShift();
    },
    handleShift() {
      let currentLayout = this.keyboard.options.layoutName;
      let shiftToggle = currentLayout === "default" ? "shift" : "default";

      this.keyboard.setOptions({
        layoutName: shiftToggle
      });
    },

    initTheme(themeName) {
      this.keyboard.setOptions({ theme: themeName });
      if (themeName === 'hg-theme-default hg-layout-numeric numeric-theme') {
        this.keyboard.setOptions({
          layout: {
            default: ["1 2 3", "4 5 6", "7 8 9", "{shift} 0 _", "{bksp}"],
            shift: ["! / #", "$ % ^", "& * (", "{shift} ) +", "{bksp}"]
          },
        });
      } else {
        this.keyboard.setOptions({
          ...turkishLayout
        });
      }
    }
  },
  watch: {
    inputName(inputName) {
      this.keyboard.setOptions({ inputName });
    },
    input(input) {
      const inputName = this.inputName
      this.keyboard.setOptions({ inputName });
      this.keyboard.setInput(input);
    },
    themeName(themeName) {
      this.initTheme(themeName);
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  >


/*
  Theme: myTheme1
*/


.simple-keyboard.myTheme1 .hg-button:active {
  background: #1c4995;
  color: white;
}

#root .simple-keyboard.myTheme1 + .simple-keyboard-preview {
  background: #1c4995;
}


/*
  Theme: numeric
*/
/*
.numeric-theme {
  max-width: 320px;
  margin: 0 auto;
}

.numeric-theme + .simple-keyboard-preview {
  max-width: 320px;
}

.simple-keyboard.hg-theme-default.numeric-theme
.hg-button.hg-standardBtn.hg-button-at {
  max-width: none;
}
*/
.hg-theme-default.hg-layout-numeric .hg-button {
  height: 40px!important;
}
</style>
