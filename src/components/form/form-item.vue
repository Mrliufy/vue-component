<template>
  <div>
    <label v-show="lable" />
    <slot />
  </div>
</template>

<script>
import emiterMixin from '../../mixins/emitter'
import AsyncValidator from 'async-validator'

export default {
// eslint-disable-next-line
  name: 'iFormItem',
  mixins: [emiterMixin],
  inject: ['form'],
  props: {
    // eslint-disable-next-line
    lable: {
      type: String
    },
    // eslint-disable-next-line
    prop: {
      type: String
    }
  },
  data() {
    return {
      validateState: '', // 校验状态
      validateMessage: '' // 校验不通过时的提示信息
    }
  },
  computed: {
    // 从 Form 的 model 中动态得到当前表单组件的数据
    fieldValue() {
      return this.form.model[this.prop]
    }
  },
  mounted() {
    if (this.prop) this.dispatch('iForm', 'form-item-add', this)
    this.setRules()
  },
  methods: {
    setRules() {
      this.$on('on-form-blur', this.onFieldBlur)
      this.$on('on-form-change', this.onFieldChange)
    },
    // 从 Form 的 rules 属性中，获取当前 FormItem 的校验规则
    getRules() {
      let formRules = this.form.rules

      formRules = formRules ? formRules[this.prop] : []

      return [].concat(formRules || [])
    },
    // 只支持 blur 和 change，所以过滤出符合要求的 rule 规则
    getFilteredRule(trigger) {
      const rules = this.getRules()
      return rules.filter(
        rule => !rule.trigger || rule.trigger.indexOf(trigger) !== -1
      )
    },
    /**
     * 校验数据
     * @param trigger 校验类型
     * @param callback 回调函数
     */
    validate(trigger, callback = function() { }) {
      const rules = this.getFilteredRule(trigger)

      if (!rules || rules.length === 0) {
        return true
      }

      // 设置状态为校验中
      this.validateState = 'validating'

      // 以下为 async-validator 库的调用方法
      const descriptor = {}
      descriptor[this.prop] = rules

      const validator = new AsyncValidator(descriptor)
      const model = {}

      model[this.prop] = this.fieldValue

      validator.validate(model, { firstFields: true }, errors => {
        this.validateState = !errors ? 'success' : 'error'
        this.validateMessage = errors ? errors[0].message : ''

        callback(this.validateMessage)
      })
    },
    onFieldBlur() {
      debugger
      this.validate('blur')
    },
    onFieldChange() {
      this.validate('change')
    }
  },
  beforeDestry() {
    if (this.prop) this.dispatch('iForm', 'form-item-remove', this)
  }
}
</script>
