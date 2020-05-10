import View from './components/view'
import Link from './components/link'

// 导出Vue
export let _Vue

export function install (Vue) {
  if (install.installed && _Vue === Vue) return
  install.installed = true

  _Vue = Vue

  const isDef = v => v !== undefined

  const registerInstance = (vm, callVal) => {
    let i = vm.$options._parentVnode
    if (isDef(i) && isDef(i = i.data) && isDef(i = i.registerRouteInstance)) {
      i(vm, callVal)
    }
  }

  // 混入beforeCreate和destroyed钩子
  Vue.mixin({
    beforeCreate () {
      // 根 Vue 实例
      if (isDef(this.$options.router)) {
        this._routerRoot = this
        // router实例
        this._router = this.$options.router
        // 执行初始化方法
        this._router.init(this)
        // 把this._route变成响应式对象，router-view的render方法会访问到$route，把依赖收集起来
        // _route变化时通知router-view组件重新渲染
        Vue.util.defineReactive(this, '_route', this._router.history.current)
      } else {
        // 子组件中的_routerRoot指向离它最近的传入了router对象作为配置而实例化的父实例
        this._routerRoot = (this.$parent && this.$parent._routerRoot) || this
      }
      registerInstance(this, this)
    },
    destroyed () {
      registerInstance(this)
    }
  })

  // 挂载路由器和路由到Vue原型
  Object.defineProperty(Vue.prototype, '$router', {
    get () { return this._routerRoot._router }
  })

  Object.defineProperty(Vue.prototype, '$route', {
    get () { return this._routerRoot._route }
  })

  // 注册router-view、router-link组件
  Vue.component('RouterView', View)
  Vue.component('RouterLink', Link)

  // 定义了路由钩子函数的合并策略，和Vue的created一致
  const strats = Vue.config.optionMergeStrategies
  // use the same hook merging strategy for route hooks
  strats.beforeRouteEnter = strats.beforeRouteLeave = strats.beforeRouteUpdate = strats.created
}
