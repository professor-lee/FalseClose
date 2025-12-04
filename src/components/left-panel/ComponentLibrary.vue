<template>
  <div class="component-library">
    <el-input v-model="searchQuery" placeholder="搜索组件..." clearable class="search-input" />

    <div v-for="(components, category) in filteredComponents" :key="category" class="category">
      <div class="category-title">{{ category }}</div>

      <div class="component-list">
        <div
          v-for="component in components"
          :key="component.name"
          class="component-item"
          draggable="true"
          @dragstart="handleDragStart($event, component)"
        >
          <span class="component-icon">{{ component.icon }}</span>
          <span class="component-name">{{ component.displayName }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import componentRegistry from '@/utils/componentRegistry'

const searchQuery = ref('')

// 过滤后的组件
const filteredComponents = computed(() => {
  if (!searchQuery.value) {
    return componentRegistry.byCategory
  }

  const query = searchQuery.value.toLowerCase()
  const result = {}

  Object.entries(componentRegistry.byCategory).forEach(([category, components]) => {
    const filtered = components.filter(comp =>
      comp.displayName.toLowerCase().includes(query) ||
      comp.name.toLowerCase().includes(query)
    )

    if (filtered.length > 0) {
      result[category] = filtered
    }
  })

  return result
})

// 拖拽开始
const handleDragStart = (event, component) => {
  event.dataTransfer.effectAllowed = 'copy'
  event.dataTransfer.setData('component', JSON.stringify(component))
}
</script>

<style scoped>
.component-library {
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  overflow-y: auto;
  min-height: 0;
  padding-right: 4px;
  scrollbar-gutter: stable;
}

.search-input {
  margin-bottom: 8px;
}

.category {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.category-title {
  font-size: 11px;
  font-weight: 600;
  color: var(--vscode-fg-muted);
  text-transform: uppercase;
  letter-spacing: 0.8px;
  padding: 4px 8px;
}

.component-list {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 6px;
}

.component-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 10px 6px;
  background-color: var(--vscode-input-bg);
  border: 1px solid var(--vscode-border);
  border-radius: 0;
  cursor: grab;
  transition: all 0.1s;
}

.component-item:hover {
  border-color: var(--vscode-focusBorder);
  background-color: var(--vscode-list-hover);
  transform: translateY(-1px);
}

.component-item:active {
  cursor: grabbing;
}

.component-icon {
  font-size: 22px;
  margin-bottom: 4px;
}

.component-name {
  font-size: 11px;
  color: var(--vscode-fg);
  text-align: center;
}
</style>
