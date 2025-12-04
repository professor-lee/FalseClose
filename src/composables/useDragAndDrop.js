import { ref } from 'vue'

/**
 * 拖拽功能 composable
 * 处理组件拖拽相关逻辑
 */
export function useDragAndDrop() {
  const isDragging = ref(false)
  const dragData = ref(null)

  /**
   * 开始拖拽
   */
  const startDrag = (event, data) => {
    isDragging.value = true
    dragData.value = data
    
    // 设置拖拽数据
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('component', JSON.stringify(data))
    
    // 设置拖拽图像（可选）
    if (event.target) {
      event.dataTransfer.setDragImage(event.target, 0, 0)
    }
  }

  /**
   * 拖拽结束
   */
  const endDrag = () => {
    isDragging.value = false
    dragData.value = null
  }

  /**
   * 处理放置
   */
  const handleDrop = (event, callback) => {
    event.preventDefault()
    event.stopPropagation()

    try {
      const data = JSON.parse(event.dataTransfer.getData('component'))
      if (callback) {
        callback(data, event)
      }
    } catch (error) {
      console.error('解析拖拽数据失败:', error)
    }

    endDrag()
  }

  /**
   * 允许放置
   */
  const allowDrop = (event) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'copy'
  }

  return {
    isDragging,
    dragData,
    startDrag,
    endDrag,
    handleDrop,
    allowDrop,
  }
}
