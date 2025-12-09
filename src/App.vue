<template>
  <router-view />
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useProjectStore } from '@/stores/project'
import { ElMessageBox } from 'element-plus'

const projectStore = useProjectStore()
let cleanupAbout = null

const handleMenuAbout = () => {
  ElMessageBox.alert(
    `
    <div style="text-align: center;">
      <h3 style="margin-bottom: 16px; font-size: 16px;">关于</h3>
      <img src="icon/icon.svg" alt="Logo" style="height: 64px; margin-bottom: 16px;">
      <h3>VueDrag Builder</h3>
      <p>版本: v1.5.3</p>
      <p>零配置的 Vue3 可视化前端搭建平台</p>
      <p>Copyright © 2025 professor-lee</p>
    </div>
    `,
    '',
    {
      dangerouslyUseHTMLString: true,
      showConfirmButton: false,
      customClass: 'about-dialog',
      center: true,
      showClose: true,
    }
  )
}

onMounted(() => {
  // 加载最近项目列表
  projectStore.loadRecentProjects()

  if (window.electron) {
    cleanupAbout = window.electron.onMenuAbout(handleMenuAbout)
  }
})

onUnmounted(() => {
  if (cleanupAbout) cleanupAbout()
})
</script>

<style>
/* Global Overrides for Element Plus to match VS Code */
:root {
  --el-bg-color: var(--vscode-bg);
  --el-bg-color-page: var(--vscode-bg);
  --el-bg-color-overlay: var(--vscode-sidebar-bg);
  
  --el-text-color-primary: var(--vscode-fg);
  --el-text-color-regular: var(--vscode-fg);
  --el-text-color-secondary: var(--vscode-fg-muted);
  --el-text-color-placeholder: var(--vscode-fg-tertiary);
  
  --el-border-color: var(--vscode-border);
  --el-border-color-light: var(--vscode-border);
  --el-border-color-lighter: var(--vscode-border);
  --el-border-color-extra-light: var(--vscode-border);
  
  --el-fill-color: var(--vscode-input-bg);
  --el-fill-color-light: var(--vscode-list-hover);
  --el-fill-color-lighter: var(--vscode-sidebar-bg);
  --el-fill-color-extra-light: var(--vscode-bg);
  
  --el-color-primary: var(--vscode-button-bg);
  --el-color-primary-light-3: var(--vscode-button-hover);
  --el-color-primary-light-5: var(--vscode-button-hover);
  --el-color-primary-light-7: var(--vscode-button-bg);
  --el-color-primary-light-8: var(--vscode-button-bg);
  --el-color-primary-light-9: var(--vscode-button-bg);
  
  --el-disabled-bg-color: var(--vscode-list-hover);
  --el-disabled-text-color: var(--vscode-fg-tertiary);
  --el-disabled-border-color: var(--vscode-border);
  
  --el-border-radius-base: 2px;
  --el-border-radius-small: 2px;
  --el-border-radius-round: 2px;
  --el-border-radius-circle: 50%;
}

html,
body,
#app {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

/* Element Plus Component Overrides */

/* Buttons */
.el-button {
  border-radius: 2px;
  border-color: transparent;
  background-color: var(--vscode-button-bg);
  color: var(--vscode-button-fg);
  font-weight: 400;
}

.el-button:hover,
.el-button:focus {
  background-color: var(--vscode-button-hover);
  border-color: transparent;
  color: var(--vscode-button-fg);
}

.el-button--default {
  background-color: #3c3c3c; /* Secondary button */
  color: #ffffff;
}

.el-button--default:hover {
  background-color: #4c4c4c;
}

.el-button.is-text {
  background-color: transparent;
  color: var(--vscode-fg);
}

.el-button.is-text:hover {
  background-color: var(--vscode-list-hover);
}

/* Inputs */
.el-input__wrapper {
  background-color: var(--vscode-input-bg);
  box-shadow: none !important;
  border: 1px solid var(--vscode-input-border);
  border-radius: 2px;
}

.el-input__wrapper:hover {
  border-color: var(--vscode-input-border);
}

.el-input__wrapper.is-focus {
  border-color: var(--vscode-focusBorder);
  outline: 1px solid var(--vscode-focusBorder);
  outline-offset: -1px;
}

.el-input__inner {
  color: var(--vscode-input-fg);
}

/* Select */
.el-select-dropdown {
  background-color: var(--vscode-sidebar-bg);
  border: 1px solid var(--vscode-border);
}

.el-select-dropdown__item {
  color: var(--vscode-fg);
}

.el-select-dropdown__item.hover,
.el-select-dropdown__item:hover {
  background-color: var(--vscode-list-hover);
}

.el-select-dropdown__item.selected {
  background-color: var(--vscode-list-active);
  color: var(--vscode-fg);
  font-weight: normal;
}

/* Dialog/Modal */
.el-dialog {
  background-color: var(--vscode-sidebar-bg);
  border: 1px solid var(--vscode-border);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.4);
}

.el-dialog__header {
  padding: 10px 15px;
  border-bottom: 1px solid var(--vscode-border);
  margin-right: 0;
}

.el-dialog__title {
  color: var(--vscode-fg);
  font-size: 14px;
}

.el-dialog__body {
  padding: 15px;
  color: var(--vscode-fg);
}

/* Tabs (Element Plus Tabs) */
.el-tabs__header {
  margin-bottom: 0;
}

.el-tabs__nav-wrap::after {
  background-color: var(--vscode-border);
  height: 1px;
}

.el-tabs__item {
  color: var(--vscode-fg-muted);
  font-weight: normal;
}

.el-tabs__item.is-active {
  color: var(--vscode-fg);
}

.el-tabs__item:hover {
  color: var(--vscode-fg);
}

/* Card */
.el-card {
  background-color: var(--vscode-sidebar-bg);
  border: 1px solid var(--vscode-border);
  color: var(--vscode-fg);
}

.el-card__header {
  border-bottom: 1px solid var(--vscode-border);
  padding: 10px 15px;
}

/* Empty State */
.el-empty__description {
  color: var(--vscode-fg-muted);
}

/* About Dialog */
.about-dialog {
  background-color: var(--vscode-bg) !important;
  border: 1px solid var(--vscode-border) !important;
  --el-bg-color: var(--vscode-bg) !important;
  --el-text-color-primary: var(--vscode-fg) !important;
}

.about-dialog .el-message-box__header {
  padding: 10px 15px;
  border-bottom: none;
}

.about-dialog .el-message-box__title {
  display: none;
}

.about-dialog .el-message-box__headerbtn {
  top: 10px;
  right: 10px;
}

.about-dialog .el-message-box__headerbtn .el-message-box__close {
  color: var(--vscode-fg) !important;
}

.about-dialog .el-message-box__headerbtn:hover .el-message-box__close {
  color: var(--vscode-fg) !important;
}

.about-dialog .el-message-box__content {
  color: var(--vscode-fg) !important;
}
</style>
