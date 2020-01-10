
function brodercast(componetname, event, param) {
  const children = this.$children
  children && children.forEach(child => {
    const parent = child
    if (child.$options.name === componetname) {
      child.$emit.apply(child, [event].concat([param]))
    }
    if (parent.$children && parent.$children.length > 0) {
      brodercast.apply(parent, [componetname, event].concat([param]))
    }
  })
}

export default {
  methods: {
    brodercast(componentname, event, param) {
      brodercast.call(this, componentname, event, param)
    },
    dispatch(componentname, event, param) {
      let parent = this.$parent || this.$root
      let name = parent.$options.name
      while (parent && (name !== componentname)) {
        parent = parent.$parent
        if (parent) {
          name = parent.$options.name
        }
      }
      if (parent) {
        this.$emit.apply(parent, [event].concat([param]))
      }
    }
  }
}
