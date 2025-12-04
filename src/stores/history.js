import { defineStore } from 'pinia'

export const useHistoryStore = defineStore('history', {
  state: () => ({
    history: [], // 历史记录栈
    currentIndex: -1, // 当前位置
    maxHistory: 50, // 最大历史记录数
  }),

  getters: {
    canUndo: state => state.currentIndex > 0,
    canRedo: state => state.currentIndex < state.history.length - 1,
  },

  actions: {
    // 记录操作
    record(action) {
      // 如果当前不在最新位置，删除后面的历史
      if (this.currentIndex < this.history.length - 1) {
        this.history = this.history.slice(0, this.currentIndex + 1)
      }

      // 添加新记录
      this.history.push({
        ...action,
        timestamp: Date.now(),
      })

      // 限制历史记录数量
      if (this.history.length > this.maxHistory) {
        this.history.shift()
      } else {
        this.currentIndex++
      }
    },

    // 撤销
    undo() {
      if (!this.canUndo || !Array.isArray(this.history)) return

      const action = this.history[this.currentIndex]
      if (!action) return
      
      this.currentIndex--
      this.applyAction(action, true)
    },

    // 重做
    redo() {
      if (!this.canRedo || !Array.isArray(this.history)) return

      this.currentIndex++
      const action = this.history[this.currentIndex]
      if (!action) return

      this.applyAction(action, false)
    },

    // 应用操作
    applyAction(action, isUndo) {
      if (!action || !action.type) return
      
      const canvasStore = useCanvasStore()
      if (!canvasStore) return

      switch (action.type) {
        case 'add':
          if (isUndo) {
            // 撤销添加 = 删除
            canvasStore.deleteComponent(action.componentId)
          } else {
            // 重做添加
            const page = canvasStore.pages.find(p => p.id === action.pageId)
            if (page) {
              page.componentTree.push(action.data)
            }
          }
          break

        case 'delete':
          if (isUndo) {
            // 撤销删除 = 恢复
            const page = canvasStore.pages.find(p => p.id === action.pageId)
            if (page) {
              action.data.forEach(item => {
                page.componentTree.push(item.data)
              })
            }
          } else {
            // 重做删除
            canvasStore.deleteComponent(action.componentId)
          }
          break

        case 'update':
          if (isUndo) {
            // 撤销更新 = 恢复旧数据
            const page = canvasStore.pages.find(p => p.id === action.pageId)
            const comp = page?.componentTree.find(c => c.id === action.componentId)
            if (comp) {
              Object.assign(comp, action.oldData)
            }
          } else {
            // 重做更新 = 应用新数据
            const page = canvasStore.pages.find(p => p.id === action.pageId)
            const comp = page?.componentTree.find(c => c.id === action.componentId)
            if (comp) {
              Object.assign(comp, action.newData)
            }
          }
          break

        case 'move':
          if (isUndo) {
            // 撤销移动
            canvasStore.moveComponent(
              action.componentId,
              action.oldParentId,
              action.oldIndex
            )
          } else {
            // 重做移动
            canvasStore.moveComponent(
              action.componentId,
              action.newParentId,
              action.newIndex
            )
          }
          break
      }
    },

    // 清空历史
    clear() {
      this.history = []
      this.currentIndex = -1
    },
  },
})

import { useCanvasStore } from './canvas'
