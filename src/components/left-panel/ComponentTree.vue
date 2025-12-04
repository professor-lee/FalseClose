<template>
  <div class="component-tree">
    <div class="tree-header">
      <span class="tree-title">组件树</span>
      <el-button @click="expandAll" size="small" text>
        全部展开
      </el-button>
    </div>

    <div class="tree-content">
      <el-scrollbar>
        <div v-if="treeData.length === 0" class="empty-tree">
          <el-empty description="暂无组件" :image-size="80" />
        </div>
        <el-tree
          v-else
          :data="treeData"
          :props="treeProps"
          :expand-on-click-node="false"
          :highlight-current="true"
          :current-node-key="editorStore.selectedComponentId"
          default-expand-all
          node-key="id"
          @node-click="handleNodeClick"
          @node-contextmenu="handleContextMenu"
        >
          <template #default="{ node, data }">
            <div class="tree-node">
              <span class="node-icon">{{ getComponentIcon(data.type) }}</span>
              <span class="node-label">{{ data.label }}</span>
              <span class="node-type">{{ data.type }}</span>
            </div>
          </template>
        </el-tree>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useCanvasStore } from '@/stores/canvas'
import { useEditorStore } from '@/stores/editor'
import { ElMessageBox } from 'element-plus'

const canvasStore = useCanvasStore()
const editorStore = useEditorStore()

const treeProps = {
  children: 'children',
  label: 'label',
}

// 将扁平的组件列表转换为树形结构
const treeData = computed(() => {
  const components = canvasStore.componentTreeHierarchy
  if (!components || !Array.isArray(components) || components.length === 0) {
    return []
  }

  return buildTreeData(components)
})

/**
 * 构建树形数据
 */
function buildTreeData(components) {
  if (!Array.isArray(components)) return []
  
  return components.map(component => {
    if (!component || !component.id) {
      console.warn('无效的组件:', component)
      return null
    }
    
    const node = {
      id: component.id,
      label: component.props?.label || component.props?.text || component.type || '未命名',
      type: component.type || 'Unknown',
      data: component,
    }

    // 递归处理子组件
    if (Array.isArray(component.children) && component.children.length > 0) {
      // 如果 children 是 ID 数组，需要获取实际的组件对象
      const childComponents = component.children.map(childId => {
        if (typeof childId === 'string') {
          return canvasStore.getComponentById(childId)
        }
        return childId
      }).filter(Boolean)

      if (childComponents.length > 0) {
        node.children = buildTreeData(childComponents)
      }
    }

    return node
  }).filter(Boolean)
}

/**
 * 获取组件图标
 */
function getComponentIcon(type) {
  const iconMap = {
    Container: '📦',
    Flex: '↔️',
    Grid: '⊞',
    Card: '🃏',
    Button: '🔘',
    Text: '📝',
    Heading: '📑',
    Image: '🖼️',
    Divider: '➖',
    Link: '🔗',
    Input: '📝',
    Select: '▼',
    Checkbox: '☑',
    Radio: '⦿',
    Switch: '🔀',
  }
  return iconMap[type] || '📦'
}

/**
 * 节点点击事件
 */
function handleNodeClick(data) {
  editorStore.selectComponent(data.id)
}

/**
 * 右键菜单
 */
function handleContextMenu(event, data) {
  event.preventDefault()
  
  ElMessageBox.confirm(
    `是否删除组件 "${data.label}"？`,
    '删除确认',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    canvasStore.deleteComponent(data.id)
  }).catch(() => {
    // 用户取消
  })
}

/**
 * 展开所有节点
 */
const expandAll = () => {
  // el-tree 的 default-expand-all 属性已经设置，这里可以做其他处理
  console.log('展开所有节点')
}
</script>

<style scoped>
.component-tree {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: var(--vscode-sidebar-bg);
}

.tree-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--vscode-border);
}

.tree-title {
  font-weight: 600;
  font-size: 11px;
  text-transform: uppercase;
  color: var(--vscode-fg-muted);
}

.tree-content {
  flex: 1;
  overflow: hidden;
}

.empty-tree {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 32px;
}

.tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  padding: 2px 0;
}

.node-icon {
  font-size: 16px;
}

.node-label {
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--vscode-fg);
}

.node-type {
  font-size: 11px;
  color: var(--vscode-fg-muted);
  background: var(--vscode-input-bg);
  padding: 2px 6px;
  border-radius: 3px;
}

:deep(.el-tree-node__content) {
  height: 28px;
  padding-right: 8px;
}

:deep(.el-tree-node__content:hover) {
  background-color: var(--vscode-list-hover);
}

:deep(.el-tree-node.is-current > .el-tree-node__content) {
  background-color: var(--vscode-list-active);
  color: var(--vscode-fg);
}
</style>
