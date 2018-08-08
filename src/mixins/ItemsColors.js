export default {
  methods: {
    makeColorLighter (color, alpha) {
      return color.replace('rgb', 'rgba').replace(')', ', ' + alpha + ')')
    }
  }
}
