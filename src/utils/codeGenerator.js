import { cloneDeep } from 'lodash-es'

/**
 * 代码生成器
 * 将组件树转换为 Vue SFC 代码
 */

/**
 * 生成完整的 Vue SFC 代码
 * @param {Object} page - 页面数据
 * @param {Object} project - 项目配置
 * @returns {string} Vue SFC 代码
 */
export function generateVueSFC(page, project = {}) {
  const template = generateTemplate(page.components)
  const script = generateScript(page, project)
  const style = generateStyle(page.components, page.globalStyles)

  return `<template>
${template}
</template>

<script setup>
${script}
</script>

<style scoped>
${style}
</style>
`
}

/**
 * 生成 template 部分
 * @param {Array} components - 组件树
 * @returns {string} template 代码
 */
export function generateTemplate(components) {
  if (!components || !Array.isArray(components) || components.length === 0) {
    return '  <div class="page-container">\n    <!-- 页面内容 -->\n  </div>'
  }

  const lines = ['  <div class="page-container">']
  components.forEach(component => {
    lines.push(...generateComponentTemplate(component, 2))
  })
  lines.push('  </div>')

  return lines.join('\n')
}

/**
 * 递归生成单个组件的 template
 * @param {Object} component - 组件数据
 * @param {number} indent - 缩进级别
 * @returns {Array} template 行数组
 */
function generateComponentTemplate(component, indent = 0) {
  const lines = []
  const indentStr = '  '.repeat(indent)
  
  // 获取组件标签名
  const tagName = getTemplateTagName(component.type)
  
  // 构建属性字符串
  const attrs = generateAttributes(component)
  const attrStr = attrs.length > 0 ? ' ' + attrs.join(' ') : ''
  
  // 判断是否有子组件或文本内容
  const hasChildren = component.children && component.children.length > 0
  const hasText = component.props?.text || component.props?.label
  
  if (!hasChildren && !hasText && isSelfClosingTag(component.type)) {
    // 自闭合标签
    lines.push(`${indentStr}<${tagName}${attrStr} />`)
  } else if (!hasChildren && hasText) {
    // 单行文本内容
    const text = component.props?.text || component.props?.label || ''
    lines.push(`${indentStr}<${tagName}${attrStr}>${escapeHtml(text)}</${tagName}>`)
  } else {
    // 有子组件或多行内容
    lines.push(`${indentStr}<${tagName}${attrStr}>`)
    
    // 递归渲染子组件
    if (hasChildren && Array.isArray(component.children)) {
      component.children.forEach(child => {
        if (child && typeof child === 'object') {
          lines.push(...generateComponentTemplate(child, indent + 1))
        }
      })
    }
    
    lines.push(`${indentStr}</${tagName}>`)
  }
  
  return lines
}

/**
 * 获取组件对应的 template 标签名
 */
function getTemplateTagName(type) {
  const tagMap = {
    'Container': 'div',
    'Flex': 'div',
    'Grid': 'div',
    'Card': 'el-card',
    'Button': 'el-button',
    'Text': 'span',
    'Heading': 'h2',
    'Image': 'el-image',
    'Divider': 'el-divider',
    'Link': 'el-link',
    'Input': 'el-input',
    'Select': 'el-select',
    'Checkbox': 'el-checkbox',
    'Radio': 'el-radio',
    'Switch': 'el-switch',
  }
  return tagMap[type] || 'div'
}

/**
 * 判断是否是自闭合标签
 */
function isSelfClosingTag(type) {
  // 为了兼容 DOMParser 解析，尽量不使用自闭合标签，除非是标准 HTML void 元素
  // 这里我们全部返回 false，强制生成闭合标签
  return false
}

/**
 * 生成组件属性
 */
function generateAttributes(component) {
  const attrs = []
  
  // 添加 class
  if (component.props?.className) {
    attrs.push(`class="${component.props.className}"`)
  }
  
  // 添加通用属性
  const props = component.props || {}
  Object.entries(props).forEach(([key, value]) => {
    if (key === 'text' || key === 'label' || key === 'className') {
      return // 跳过特殊处理的属性
    }
    
    // 布尔值
    if (typeof value === 'boolean') {
      if (value) attrs.push(`:${key}="true"`)
    }
    // 数字
    else if (typeof value === 'number') {
      attrs.push(`:${key}="${value}"`)
    }
    // 字符串
    else if (value) {
      attrs.push(`${key}="${escapeAttr(String(value))}"`)
    }
  })
  
  // 添加事件绑定
  if (component.events) {
    Object.entries(component.events).forEach(([event, handler]) => {
      if (handler && handler.action) {
        attrs.push(`@${event}="handle${capitalizeFirst(event)}"`)
      }
    })
  }
  
  // 添加内联样式 (如果有样式)
  if (component.styles && Object.keys(component.styles).length > 0) {
    const styleStr = generateInlineStyle(component.styles)
    if (styleStr) {
      attrs.push(`style="${escapeAttr(styleStr)}"`)
    }
  }
  
  return attrs
}

/**
 * 生成内联样式字符串
 */
function generateInlineStyle(styles) {
  const parts = []
  Object.entries(styles).forEach(([key, value]) => {
    if (value) {
      // 转换驼峰命名为短横线命名
      const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      parts.push(`${cssKey}: ${value}`)
    }
  })
  return parts.join('; ')
}

/**
 * 生成 script 部分
 */
export function generateScript(page, project = {}) {
  const lines = []
  
  // 导入必要的依赖
  lines.push("import { ref, reactive } from 'vue'")
  
  // 检查是否有事件绑定，需要导入 router
  const hasNavigation = checkHasNavigation(page.components)
  if (hasNavigation) {
    lines.push("import { useRouter } from 'vue-router'")
    lines.push('')
    lines.push('const router = useRouter()')
  }
  
  lines.push('')
  
  // 生成响应式数据
  const formFields = collectFormFields(page.components)
  if (formFields.length > 0) {
    lines.push('// 表单数据')
    lines.push('const formData = reactive({')
    formFields.forEach(field => {
      lines.push(`  ${field}: '',`)
    })
    lines.push('})')
    lines.push('')
  }
  
  // 生成事件处理函数
  const handlers = generateEventHandlers(page.components)
  if (handlers.length > 0) {
    lines.push('// 事件处理函数')
    handlers.forEach(handler => {
      lines.push(handler)
      lines.push('')
    })
  }
  
  return lines.join('\n')
}

/**
 * 检查是否有导航事件
 */
function checkHasNavigation(components) {
  if (!Array.isArray(components)) {
    console.warn('checkHasNavigation: components is not an array', components)
    return false
  }
  
  for (const component of components) {
    if (!component) continue
    
    if (component.events) {
      const hasNav = Object.values(component.events).some(
        handler => handler?.action === 'navigateTo'
      )
      if (hasNav) return true
    }
    
    if (component.children && component.children.length > 0) {
      if (checkHasNavigation(component.children)) return true
    }
  }
  return false
}

/**
 * 收集表单字段
 */
function collectFormFields(components) {
  const fields = new Set()
  
  function traverse(comps) {
    if (!Array.isArray(comps)) {
      console.warn('traverse: comps is not an array', comps)
      return
    }
    
    comps.forEach(component => {
      if (!component) return
      
      // 表单组件
      if (['Input', 'Textarea', 'Select', 'Checkbox', 'Radio', 'Switch', 'DatePicker'].includes(component.type)) {
        const fieldName = component.props?.name || component.props?.placeholder || component.id
        if (fieldName) {
          fields.add(fieldName)
        }
      }
      
      if (component.children && component.children.length > 0) {
        traverse(component.children)
      }
    })
  }
  
  traverse(components)
  return Array.from(fields)
}

/**
 * 生成事件处理函数
 */
function generateEventHandlers(components) {
  const handlers = []
  const handlerSet = new Set()
  
  function traverse(comps) {
    if (!Array.isArray(comps)) {
      console.warn('generateEventHandlers traverse: comps is not an array', comps)
      return
    }
    comps.forEach(component => {
      if (!component) return
      if (component.events) {
        Object.entries(component.events).forEach(([event, handler]) => {
          if (handler && handler.action) {
            const funcName = `handle${capitalizeFirst(event)}`
            
            if (!handlerSet.has(funcName)) {
              handlerSet.add(funcName)
              
              if (handler.action === 'navigateTo' && handler.params?.path) {
                handlers.push(`const ${funcName} = () => {
  router.push('${handler.params.path}')
}`)
              } else if (handler.action === 'toggleComponent' && handler.params?.targetId) {
                handlers.push(`const ${funcName} = () => {
  // TODO: 实现组件显示/隐藏逻辑
  console.log('Toggle component: ${handler.params.targetId}')
}`)
              } else if (handler.action === 'customCode' && handler.params?.code) {
                handlers.push(`const ${funcName} = () => {
${handler.params.code.split('\n').map(line => '  ' + line).join('\n')}
}`)
              } else {
                handlers.push(`const ${funcName} = () => {
  console.log('${event} triggered')
}`)
              }
            }
          }
        })
      }
      
      if (component.children && component.children.length > 0) {
        traverse(component.children)
      }
    })
  }
  
  if (Array.isArray(components)) {
    traverse(components)
  }
  return handlers
}

/**
 * 生成 style 部分
 */
export function generateStyle(components, globalStyles = {}) {
  const lines = []
  
  // 全局样式
  if (globalStyles && Object.keys(globalStyles).length > 0) {
    lines.push('/* 全局样式 */')
    lines.push('.page-container {')
    Object.entries(globalStyles).forEach(([key, value]) => {
      if (value) {
        const cssKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
        lines.push(`  ${cssKey}: ${value};`)
      }
    })
    lines.push('}')
    lines.push('')
  }
  
  // 组件特定样式 (如果需要)
  // 这里可以根据组件类型生成一些默认样式
  
  return lines.join('\n')
}

/**
 * 工具函数
 */
function capitalizeFirst(str) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  }
  return text.replace(/[&<>"']/g, m => map[m])
}

function escapeAttr(text) {
  return text.replace(/"/g, '&quot;')
}

export default {
  generateVueSFC,
  generateTemplate,
  generateScript,
  generateStyle,
}
