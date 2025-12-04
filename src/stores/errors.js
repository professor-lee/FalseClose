import { defineStore } from 'pinia'

export const useErrorsStore = defineStore('errors', {
  state: () => ({
    errors: [], // { id, type: 'syntax' | 'validation' | 'warning', message, file, line, column }
    warnings: [],
  }),

  getters: {
    errorCount: state => state.errors.length,
    warningCount: state => state.warnings.length,
    hasErrors: state => state.errors.length > 0,
    hasWarnings: state => state.warnings.length > 0,
  },

  actions: {
    // 添加错误
    addError(error) {
      this.errors.push({
        id: Date.now(),
        timestamp: new Date(),
        ...error,
      })
    },

    // 添加警告
    addWarning(warning) {
      this.warnings.push({
        id: Date.now(),
        timestamp: new Date(),
        ...warning,
      })
    },

    // 清除所有错误
    clearErrors() {
      this.errors = []
    },

    // 清除所有警告
    clearWarnings() {
      this.warnings = []
    },

    // 清除特定错误
    removeError(id) {
      this.errors = this.errors.filter(e => e.id !== id)
    },

    // 清除特定警告
    removeWarning(id) {
      this.warnings = this.warnings.filter(w => w.id !== id)
    },

    // 清除所有
    clearAll() {
      this.errors = []
      this.warnings = []
    },
  },
})
