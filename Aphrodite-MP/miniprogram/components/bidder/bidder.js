// components/bidder/bidder.js
Component({
  /**
   * Component properties
   */
  properties: {
    name: {
      type: String,
      value: '',
    },
    avatar: {
      type: String,
      value: ''
    },
    review: {
      type: String,
    },
    price: {
      type: Number,
    }
  },

  /**
   * Component initial data
   */
  data: {
    isToggleOn: false
  },

  /**
   * Component methods
   */
  methods: {
    onSetWinner() {
      this.setData({
        isToggleOn: !this.properties.isToggleOn
      })
    }
  }
})