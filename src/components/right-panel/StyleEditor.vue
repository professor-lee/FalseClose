<template>
  <div class="style-editor">
    <el-form label-position="top">
      <el-text class="section-title">尺寸与间距</el-text>
      <div class="two-col">
        <el-form-item label="宽度">
          <el-input
            :model-value="componentStyles.width || ''"
            @update:model-value="handleUpdateStyle('width', $event)"
            placeholder="auto"
          />
        </el-form-item>
        <el-form-item label="高度">
          <el-input
            :model-value="componentStyles.height || ''"
            @update:model-value="handleUpdateStyle('height', $event)"
            placeholder="auto"
          />
        </el-form-item>
      </div>

      <div class="two-col">
        <el-form-item label="内边距">
          <el-input
            :model-value="componentStyles.padding || ''"
            @update:model-value="handleUpdateStyle('padding', $event)"
            placeholder="16px"
          />
        </el-form-item>
        <el-form-item label="外边距">
          <el-input
            :model-value="componentStyles.margin || ''"
            @update:model-value="handleUpdateStyle('margin', $event)"
            placeholder="0"
          />
        </el-form-item>
      </div>

      <div class="two-col">
        <el-form-item label="圆角">
          <el-input
            :model-value="componentStyles.borderRadius || ''"
            @update:model-value="handleUpdateStyle('borderRadius', $event)"
            placeholder="4px"
          />
        </el-form-item>
        <el-form-item label="边框">
          <el-input
            :model-value="componentStyles.border || ''"
            @update:model-value="handleUpdateStyle('border', $event)"
            placeholder="1px solid #3e3e42"
          />
        </el-form-item>
      </div>

      <el-form-item label="阴影">
        <el-input
          :model-value="componentStyles.boxShadow || ''"
          @update:model-value="handleUpdateStyle('boxShadow', $event)"
          placeholder="0 4px 12px rgba(0,0,0,0.1)"
        />
      </el-form-item>

      <el-divider />

      <el-text class="section-title">颜色与字体</el-text>
      <div class="two-col">
        <el-form-item label="背景色">
          <el-color-picker
            :model-value="componentStyles.backgroundColor || ''"
            @update:model-value="handleUpdateStyle('backgroundColor', $event)"
          />
        </el-form-item>
        <el-form-item label="文字颜色">
          <el-color-picker
            :model-value="componentStyles.color || ''"
            @update:model-value="handleUpdateStyle('color', $event)"
          />
        </el-form-item>
      </div>

      <div class="two-col">
        <el-form-item label="字体大小">
          <el-input
            :model-value="componentStyles.fontSize || ''"
            @update:model-value="handleUpdateStyle('fontSize', $event)"
            placeholder="14px"
          />
        </el-form-item>
        <el-form-item label="字体粗细">
          <el-select
            :model-value="componentStyles.fontWeight || '400'"
            @update:model-value="handleUpdateStyle('fontWeight', $event)"
          >
            <el-option label="细" value="300" />
            <el-option label="常规" value="400" />
            <el-option label="中等" value="500" />
            <el-option label="粗体" value="600" />
          </el-select>
        </el-form-item>
      </div>

      <el-form-item label="对齐方式">
        <el-select
          :model-value="componentStyles.textAlign || ''"
          @update:model-value="handleUpdateStyle('textAlign', $event)"
          placeholder="inherit"
        >
          <el-option label="左对齐" value="left" />
          <el-option label="居中" value="center" />
          <el-option label="右对齐" value="right" />
        </el-select>
      </el-form-item>

      <el-divider />

      <el-text class="section-title">布局 & Flex/Grid</el-text>
      <el-form-item label="显示类型">
        <el-select
          :model-value="componentStyles.display || ''"
          @update:model-value="handleUpdateStyle('display', $event)"
          placeholder="block"
        >
          <el-option label="块级" value="block" />
          <el-option label="Flex" value="flex" />
          <el-option label="Grid" value="grid" />
          <el-option label="Inline" value="inline-block" />
        </el-select>
      </el-form-item>

      <template v-if="componentStyles.display === 'flex'">
        <div class="two-col">
          <el-form-item label="方向">
            <el-select
              :model-value="componentStyles.flexDirection || 'row'"
              @update:model-value="handleUpdateStyle('flexDirection', $event)"
            >
              <el-option label="水平" value="row" />
              <el-option label="垂直" value="column" />
            </el-select>
          </el-form-item>
          <el-form-item label="换行">
            <el-select
              :model-value="componentStyles.flexWrap || 'nowrap'"
              @update:model-value="handleUpdateStyle('flexWrap', $event)"
            >
              <el-option label="不换行" value="nowrap" />
              <el-option label="自动换行" value="wrap" />
            </el-select>
          </el-form-item>
        </div>
        <div class="two-col">
          <el-form-item label="主轴对齐">
            <el-select
              :model-value="componentStyles.justifyContent || 'flex-start'"
              @update:model-value="handleUpdateStyle('justifyContent', $event)"
            >
              <el-option label="起始" value="flex-start" />
              <el-option label="居中" value="center" />
              <el-option label="末端" value="flex-end" />
              <el-option label="均匀" value="space-between" />
              <el-option label="等距" value="space-around" />
            </el-select>
          </el-form-item>
          <el-form-item label="交叉轴对齐">
            <el-select
              :model-value="componentStyles.alignItems || 'stretch'"
              @update:model-value="handleUpdateStyle('alignItems', $event)"
            >
              <el-option label="拉伸" value="stretch" />
              <el-option label="居中" value="center" />
              <el-option label="起始" value="flex-start" />
              <el-option label="末端" value="flex-end" />
            </el-select>
          </el-form-item>
        </div>
        <el-form-item label="元素间距">
          <el-input
            :model-value="componentStyles.gap || ''"
            @update:model-value="handleUpdateStyle('gap', $event)"
            placeholder="12px"
          />
        </el-form-item>
      </template>

      <template v-if="componentStyles.display === 'grid'">
        <el-form-item label="列定义">
          <el-input
            :model-value="componentStyles.gridTemplateColumns || ''"
            @update:model-value="handleUpdateStyle('gridTemplateColumns', $event)"
            placeholder="repeat(3, 1fr)"
          />
        </el-form-item>
        <el-form-item label="行定义">
          <el-input
            :model-value="componentStyles.gridTemplateRows || ''"
            @update:model-value="handleUpdateStyle('gridTemplateRows', $event)"
            placeholder="auto"
          />
        </el-form-item>
        <el-form-item label="网格间距">
          <el-input
            :model-value="componentStyles.gap || ''"
            @update:model-value="handleUpdateStyle('gap', $event)"
            placeholder="16px"
          />
        </el-form-item>
      </template>
    </el-form>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useCanvasStore } from '@/stores/canvas'

const props = defineProps({
  component: {
    type: Object,
    required: true,
  },
})

const canvasStore = useCanvasStore()

const componentStyles = computed(() => {
  return props.component.styles || {}
})

const handleUpdateStyle = (key, value) => {
  const currentStyles = props.component.styles || {}
  canvasStore.updateComponent(props.component.id, {
    styles: {
      ...currentStyles,
      [key]: value,
    },
  })
}
</script>

<style scoped>
.style-editor {
  padding: 8px 0;
}

.section-title {
  display: block;
  font-size: 12px;
  letter-spacing: 0.4px;
  color: var(--vscode-fg-muted);
  margin-bottom: 6px;
}

.two-col {
  display: flex;
  gap: 8px;
}

.two-col :deep(.el-form-item) {
  flex: 1;
}

:deep(.el-divider) {
  margin: 16px 0;
  border-color: var(--vscode-border);
}
</style>
