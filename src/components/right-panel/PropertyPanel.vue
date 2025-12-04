<template>
  <div class="property-panel">
    <!-- 选中组件时显示组件属性 -->
    <el-form v-if="component" label-position="top">
      <el-form-item label="组件ID">
        <el-input :value="component.id" disabled />
      </el-form-item>

      <el-form-item label="组件类型">
        <el-input :value="component.type" disabled />
      </el-form-item>

      <!-- 动态属性配置 -->
      <el-form-item
        v-for="(value, key) in component.props"
        :key="key"
        :label="getPropertyLabel(key)"
      >
        <el-input
          v-if="getInputType(key, value) === 'text'"
          :model-value="value"
          @update:model-value="handleUpdateProp(key, $event)"
          :placeholder="getPlaceholder(key)"
        />
        <el-input
          v-else-if="getInputType(key, value) === 'textarea'"
          type="textarea"
          :model-value="value"
          @update:model-value="handleUpdateProp(key, $event)"
          :rows="3"
        />
        <el-input-number
          v-else-if="getInputType(key, value) === 'number'"
          :model-value="value"
          @update:model-value="handleUpdateProp(key, $event)"
        />
        <el-switch
          v-else-if="getInputType(key, value) === 'boolean'"
          :model-value="value"
          @update:model-value="handleUpdateProp(key, $event)"
        />
        <el-input
          v-else
          :model-value="value"
          @update:model-value="handleUpdateProp(key, $event)"
        />
      </el-form-item>
    </el-form>

    <!-- 未选中组件时显示画布设置 -->
    <div v-else class="canvas-settings">
      <div class="section-title">画布设置</div>
      <el-form label-position="top">
        <el-form-item label="固定大小">
          <el-switch
            v-model="canvasStore.canvasSize.isFixed"
            @change="handleCanvasSizeChange"
          />
        </el-form-item>
        
        <template v-if="canvasStore.canvasSize.isFixed">
          <el-form-item label="宽度 (px)">
            <el-input-number 
              v-model="canvasStore.canvasSize.width" 
              :min="300" 
              :max="3840"
              @change="handleCanvasSizeChange"
            />
          </el-form-item>
          <el-form-item label="高度 (px)">
            <el-input-number 
              v-model="canvasStore.canvasSize.height" 
              :min="300" 
              :max="3840"
              @change="handleCanvasSizeChange"
            />
          </el-form-item>
        </template>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useCanvasStore } from '@/stores/canvas'

const props = defineProps({
  component: {
    type: Object,
    default: null,
  },
})

const canvasStore = useCanvasStore()

const handleCanvasSizeChange = () => {
  // 触发 store 更新以保存状态
  canvasStore.updateCanvasSize(canvasStore.canvasSize)
}

const handleUpdateProp = (key, value) => {
  canvasStore.updateComponent(props.component.id, {
    props: {
      ...props.component.props,
      [key]: value,
    },
  })
}

const getPropertyLabel = (key) => {
  const labelMap = {
    text: '文本内容',
    label: '标签',
    placeholder: '提示文字',
    src: '图片/视频地址',
    href: '链接地址',
    size: '尺寸',
    type: '类型',
    controls: '显示控制条',
    width: '宽度',
    height: '高度',
    rows: '行数',
    name: '名称',
  }
  return labelMap[key] || key
}

const getInputType = (key, value) => {
  if (typeof value === 'boolean') return 'boolean'
  if (typeof value === 'number') return 'number'
  if (key === 'text' && typeof value === 'string' && value.length > 50) return 'textarea'
  return 'text'
}

const getPlaceholder = (key) => {
  const placeholderMap = {
    text: '请输入文本内容',
    label: '请输入标签',
    placeholder: '请输入提示文字',
    src: '请输入图片/视频地址',
    href: '请输入链接地址',
  }
  return placeholderMap[key] || `请输入${key}`
}
</script>

<style scoped>
.property-panel {
  padding: 8px 0;
}

.property-panel :deep(.el-form-item) {
  margin-bottom: 16px;
}

.property-panel :deep(.el-form-item__label) {
  font-size: 12px;
  color: var(--vscode-fg-muted);
  padding-bottom: 4px;
}

.property-panel :deep(.el-input__wrapper) {
  font-size: 13px;
}

.section-title {
  font-size: 14px;
  font-weight: bold;
  color: var(--vscode-fg);
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid var(--vscode-border);
}
</style>
