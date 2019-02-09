// components/IconToggleButton/IconToggleButton.js
Component({
  /**
   * Component properties
   */
  properties: {
    iconUrl: {
      type: String,
    },
    toggleOnIconUrl: {
      type: String,
    },
    isToggleOn: {
      type: Boolean,
      value: false,
    }
  },

  /**
   * Component initial data
   */
  data: {

  },

  /**
   * Component methods
   */
  methods: {
    onClick() {
      this.triggerEvent('onClick')
    }
  }
})
