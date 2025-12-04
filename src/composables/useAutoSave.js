import { watch, onUnmounted } from 'vue'
import { useProjectStore } from '@/stores/project'
import { debounce } from 'lodash-es'

/**
 * 自动保存 composable
 * 监听项目变化，自动触发保存（带防抖）
 */
export function useAutoSave() {
  const projectStore = useProjectStore()

  // 创建防抖保存函数
  const debouncedSave = debounce(
    () => {
      if (projectStore.autoSave && projectStore.isDirty && projectStore.projectPath) {
        projectStore.saveProject()
      }
    },
    projectStore.autoSaveInterval || 500
  )

  // 监听项目是否修改
  const unwatch = watch(
    () => projectStore.isDirty,
    (isDirty) => {
      if (isDirty) {
        debouncedSave()
      }
    }
  )

  // 组件卸载时清理
  onUnmounted(() => {
    unwatch()
    debouncedSave.cancel()
  })

  return {
    saveNow: () => projectStore.saveProject(),
    isDirty: () => projectStore.isDirty,
  }
}
