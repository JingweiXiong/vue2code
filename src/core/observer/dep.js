/* @flow */

import type Watcher from './watcher'
import { remove } from '../util/index'

let uid = 0

/**
 * A dep is an observable that can have multiple
 * directives subscribing to it.
 */
// Dep类是Watcher管理器，负责增加或移除Watcher、通知所有Watcher更新
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    this.subs = []
  }

  // 添加依赖
  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  // 移除依赖
  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  // 添加Dep.target到订阅数组中
  depend () {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  // 触发订阅的watcher的upate方法
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      subs[i].update()
    }
  }
}

// the current target watcher being evaluated.
// this is globally unique because there could be only one
// watcher being evaluated at any time.
// Dep.target是全局唯一的Dep.target
Dep.target = null
const targetStack = []

// 设置Dep.target
export function pushTarget (_target: ?Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}
// 把Dep.target恢复成上一个状态
export function popTarget () {
  Dep.target = targetStack.pop()
}
