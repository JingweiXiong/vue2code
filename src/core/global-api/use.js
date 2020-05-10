/* @flow */

import { toArray } from '../util/index'

export function initUse (Vue: GlobalAPI) {
  // use方法一般是执行插件的install方法，把Vue作为第一个参数传入
  // 如果插件本身是一个函数，就会被当做install方法
  Vue.use = function (plugin: Function | Object) {
    const installedPlugins = (this._installedPlugins || (this._installedPlugins = []))
    if (installedPlugins.indexOf(plugin) > -1) {
      return this
    }

    // additional parameters
    const args = toArray(arguments, 1)
    args.unshift(this)
    if (typeof plugin.install === 'function') {
      plugin.install.apply(plugin, args)
    } else if (typeof plugin === 'function') {
      plugin.apply(null, args)
    }
    installedPlugins.push(plugin)
    return this
  }
}
