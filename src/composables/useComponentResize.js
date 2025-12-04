import { ref, onMounted, onUnmounted } from 'vue'

/**
 * 组件尺寸调整 composable
 * 处理组件边框拖拽调整尺寸
 */
export function useComponentResize(componentId, updateCallback) {
  const isResizing = ref(false)
  const resizeHandle = ref(null)
  const initialSize = ref({ width: 0, height: 0 })
  const initialMouse = ref({ x: 0, y: 0 })

  /**
   * 开始调整尺寸
   */
  const startResize = (event, handle) => {
    event.preventDefault()
    event.stopPropagation()

    isResizing.value = true
    resizeHandle.value = handle

    const rect = event.target.closest('.dynamic-component').getBoundingClientRect()
    initialSize.value = {
      width: rect.width,
      height: rect.height,
    }

    initialMouse.value = {
      x: event.clientX,
      y: event.clientY,
    }

    document.addEventListener('mousemove', onMouseMove)
    document.addEventListener('mouseup', stopResize)
  }

  /**
   * 鼠标移动
   */
  const onMouseMove = (event) => {
    if (!isResizing.value) return

    const deltaX = event.clientX - initialMouse.value.x
    const deltaY = event.clientY - initialMouse.value.y

    let newWidth = initialSize.value.width
    let newHeight = initialSize.value.height

    // 根据拖拽手柄位置计算新尺寸
    switch (resizeHandle.value) {
      case 'e':
        newWidth = initialSize.value.width + deltaX
        break
      case 's':
        newHeight = initialSize.value.height + deltaY
        break
      case 'se':
        newWidth = initialSize.value.width + deltaX
        newHeight = initialSize.value.height + deltaY
        break
      case 'w':
        newWidth = initialSize.value.width - deltaX
        break
      case 'n':
        newHeight = initialSize.value.height - deltaY
        break
      case 'nw':
        newWidth = initialSize.value.width - deltaX
        newHeight = initialSize.value.height - deltaY
        break
      case 'ne':
        newWidth = initialSize.value.width + deltaX
        newHeight = initialSize.value.height - deltaY
        break
      case 'sw':
        newWidth = initialSize.value.width - deltaX
        newHeight = initialSize.value.height + deltaY
        break
    }

    // 限制最小尺寸
    newWidth = Math.max(50, newWidth)
    newHeight = Math.max(30, newHeight)

    // 回调更新组件样式
    if (updateCallback) {
      updateCallback({
        width: `${newWidth}px`,
        height: `${newHeight}px`,
      })
    }
  }

  /**
   * 停止调整尺寸
   */
  const stopResize = () => {
    isResizing.value = false
    resizeHandle.value = null

    document.removeEventListener('mousemove', onMouseMove)
    document.removeEventListener('mouseup', stopResize)
  }

  onUnmounted(() => {
    stopResize()
  })

  return {
    isResizing,
    startResize,
    stopResize,
  }
}
