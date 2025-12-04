<template>
  <div class="event-binder">
    <div v-for="(event, index) in componentEvents" :key="index" class="event-item">
      <el-form label-position="top">
        <el-form-item label="事件类型">
          <el-select :model-value="event.type" @update:model-value="handleUpdateEvent(index, 'type', $event)">
            <el-option label="点击 (click)" value="click" />
            <el-option label="悬停 (hover)" value="hover" />
            <el-option label="聚焦 (focus)" value="focus" />
          </el-select>
        </el-form-item>

        <el-form-item label="动作">
              <el-select :model-value="event.action" @update:model-value="handleUpdateEvent(index, 'action', $event)">
                <el-option label="页面跳转" value="navigateTo" />
                <el-option label="打开弹窗" value="openDialog" />
                <el-option label="显示/隐藏组件" value="toggleComponent" />
                <el-option label="执行脚本" value="runScript" />
              </el-select>
            </el-form-item>

            <!-- 动作参数配置 -->
            <el-form-item v-if="event.action === 'navigateTo'" label="目标页面">
              <el-select :model-value="event.params.targetPage" @update:model-value="val => handleUpdateParam(index, 'targetPage', val)">
                <el-option v-for="p in pages" :key="p.id" :label="p.name" :value="p.id" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="event.action === 'toggleComponent'" label="目标组件">
              <el-select :model-value="event.params.targetComponentId" @update:model-value="val => handleUpdateParam(index, 'targetComponentId', val)">
                <el-option v-for="c in allComponents" :key="c.id" :label="c.type + ' - ' + (c.props?.label || c.id)" :value="c.id" />
              </el-select>
            </el-form-item>

            <el-form-item v-if="event.action === 'openDialog'" label="弹窗内容">
              <el-input type="textarea" :model-value="event.params.message" @update:model-value="val => handleUpdateParam(index, 'message', val)" placeholder="弹窗显示的消息或组件 id" />
            </el-form-item>

            <el-form-item v-if="event.action === 'runScript'" label="脚本">
              <el-input type="textarea" :model-value="event.params.script" @update:model-value="val => handleUpdateParam(index, 'script', val)" placeholder="JavaScript 代码片段" />
            </el-form-item>

        <el-button type="danger" size="small" @click="handleRemoveEvent(index)">
          删除事件
        </el-button>
      </el-form>
    </div>

    <el-button type="primary" @click="handleAddEvent">
      <el-icon><Plus /></el-icon>
      添加事件
    </el-button>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { Plus } from '@element-plus/icons-vue'

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
})

const canvasStore = useCanvasStore()

const componentEvents = computed(() => {
  return Array.isArray(props.component.events) ? props.component.events : []
})

// 页面列表 & 所有组件 (用于动作参数选择)
const pages = computed(() => (useCanvasStore().pages || []).map(p => ({ id: p.id, name: p.name || p.route || '页面' })))
const allComponents = computed(() => {
  const store = useCanvasStore()
  const page = store.pages.find(p => p.id === store.currentPageId)
  if (!page) return []
  return page.componentTree || []
})

const handleUpdateParam = (index, key, value) => {
  const events = [...(props.component.events || [])]
  events[index] = { ...events[index], params: { ...(events[index].params || {}), [key]: value } }
  useCanvasStore().updateComponent(props.component.id, { events })
}

const handleAddEvent = () => {
  const events = [...(props.component.events || [])]
  events.push({
    type: 'click',
    action: 'navigateTo',
    params: {},
  })

  canvasStore.updateComponent(props.component.id, { events })
}

const handleUpdateEvent = (index, key, value) => {
  const events = [...props.component.events]
  events[index] = {
    ...events[index],
    [key]: value,
  }

  canvasStore.updateComponent(props.component.id, { events })
}

const handleRemoveEvent = index => {
  const events = [...props.component.events]
  events.splice(index, 1)

  canvasStore.updateComponent(props.component.id, { events })
}
</script>

<style scoped>
.event-binder {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 8px 0;
}

.event-item {
  padding: 12px;
  background-color: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 0;
}
</style>
