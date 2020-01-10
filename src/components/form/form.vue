<template>
  <div>
    <slot />
  </div>
</template>
<script>
export default {
  // eslint-disable-next-line
  name: 'iForm',
  props: {
    /* eslint-disable */ 
    model: {
      type: Object
    },
    rules: {
      type: Object
    }
  },
  provide() {
    return {
      form: this
    }
  },
  data() {
    return {
      filds: []
    }
  },
  created() {
    this.$on('form-item-add', item => {
      this.filds.push(item)
    })

    this.$on('form-item-remove', item => {
      const index = this.filds.idexOf(item)
      if (index > -1) {
        this.filds.splice(index, 1)
      }
    })
  }
}
</script>
