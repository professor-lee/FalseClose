// 组件注册表
import * as VLib from '@/components/library'

// 组件映射表
export const componentMap = {
  Button: VLib.VButton,
  Input: VLib.VInput,
  Textarea: VLib.VTextarea,
  Select: VLib.VSelect,
  Checkbox: VLib.VCheckbox,
  Radio: VLib.VRadio,
  Switch: VLib.VSwitch,
  Slider: VLib.VSlider,
  DatePicker: VLib.VDatePicker,
  TimePicker: VLib.VTimePicker,
  Upload: VLib.VUpload,
  Image: VLib.VImage,
  Icon: VLib.VIcon,
  Divider: VLib.VDivider,
  Card: VLib.VCard,
  Tabs: VLib.VTabs,
  Accordion: VLib.VAccordion,
  Table: VLib.VTable,
  Form: VLib.VForm,
  Container: 'div',
  Flex: 'div',
  Grid: 'div',
  Text: VLib.VText,
  Heading: 'h2',
  Link: VLib.VLink,
  Video: 'div',
  Teleport: VLib.VTeleport,
  Suspense: VLib.VSuspense,
  Draggable: VLib.VDraggable,
  TransitionGroup: VLib.VTransitionGroup,
  Reusable: VLib.VReusable,
  RouterLink: VLib.VRouterLink,
  RouterView: VLib.VRouterView,
}

// 组件定义（对齐 changeDoc 清单，兼容旧项目）
export const components = {
  // === 容器组件 ===
  Container: {
    name: 'Container',
    displayName: '容器',
    category: '容器组件',
    icon: '📦',
    type: 'Container',
    defaultProps: {},
    canHaveChildren: true,
    slots: ['header', 'default', 'footer'],
    package: 'builtin',
  },

  Flex: {
    name: 'Flex',
    displayName: 'Flex 容器',
    category: '容器组件',
    icon: '↔️',
    type: 'Flex',
    defaultProps: {
      direction: 'row',
      justify: 'flex-start',
      align: 'flex-start',
      gap: '12px',
    },
    canHaveChildren: true,
    slots: ['header', 'default', 'footer'],
    package: 'builtin',
  },

  Grid: {
    name: 'Grid',
    displayName: 'Grid 容器',
    category: '容器组件',
    icon: '⊞',
    type: 'Grid',
    defaultProps: {
      columns: 3,
      gap: '12px',
    },
    canHaveChildren: true,
    slots: ['header', 'default', 'footer'],
    package: 'builtin',
  },

  Card: {
    name: 'Card',
    displayName: '卡片',
    category: '容器组件',
    icon: '🃏',
    type: 'Card',
    defaultProps: {
      header: '卡片标题',
      shadow: 'always',
    },
    canHaveChildren: true,
    slots: ['header', 'default', 'footer'],
    package: 'element-plus',
  },

  Form: {
    name: 'Form',
    displayName: '表单容器',
    category: '容器组件',
    icon: '🗂️',
    type: 'Form',
    defaultProps: {
      labelPosition: 'top',
      labelWidth: '120px',
      inline: false,
    },
    canHaveChildren: true,
    slots: ['default'],
    package: 'element-plus',
  },

  // === 基础组件 ===
  Button: {
    name: 'Button',
    displayName: '按钮',
    category: '基础组件',
    icon: '🔘',
    type: 'Button',
    defaultProps: {
      label: '按钮',
      type: 'primary',
      size: 'default',
      disabled: false,
      loading: false,
      icon: '',
    },
    events: ['click', 'dblclick', 'mouseenter', 'mouseleave', 'focus', 'blur'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  Text: {
    name: 'Text',
    displayName: '文本',
    category: '基础组件',
    icon: '📄',
    type: 'Text',
    defaultProps: {
      text: '文本内容',
    },
    canHaveChildren: false,
    package: 'builtin',
  },

  Heading: {
    name: 'Heading',
    displayName: '标题',
    category: '基础组件',
    icon: '📰',
    type: 'Heading',
    defaultProps: {
      text: '这是标题',
    },
    canHaveChildren: false,
    package: 'builtin',
  },

  Image: {
    name: 'Image',
    displayName: '图片',
    category: '媒体组件',
    icon: '🖼️',
    type: 'Image',
    defaultProps: {
      src: '',
      fit: 'cover',
      alt: '图片',
    },
    styles: {
      width: '100%',
      minHeight: '200px',
      borderRadius: '4px',
      overflow: 'hidden',
    },
    events: ['load', 'error', 'click'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  Divider: {
    name: 'Divider',
    displayName: '分割线',
    category: '基础组件',
    icon: '➖',
    type: 'Divider',
    defaultProps: {
      direction: 'horizontal',
      borderStyle: 'solid',
    },
    canHaveChildren: false,
    package: 'element-plus',
  },

  Link: {
    name: 'Link',
    displayName: '链接',
    category: '基础组件',
    icon: '🔗',
    type: 'Link',
    defaultProps: {
      text: '链接文本',
      href: '#',
      target: '_self',
      allowNavigate: false,
    },
    events: ['click'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  Icon: {
    name: 'Icon',
    displayName: '图标',
    category: '媒体组件',
    icon: '⭐',
    type: 'Icon',
    defaultProps: {
      name: 'Star',
      size: 24,
      color: '#333',
    },
    events: ['click', 'mouseenter'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  Video: {
    name: 'Video',
    displayName: '视频',
    category: '媒体组件',
    icon: '📹',
    type: 'Video',
    defaultProps: {
      src: '',
      controls: true,
      width: '100%',
      height: '',
    },
    canHaveChildren: false,
    package: 'builtin',
  },

  // === 表单组件 ===
  Input: {
    name: 'Input',
    displayName: '输入框',
    category: '表单组件',
    icon: '📝',
    type: 'Input',
    defaultProps: {
      placeholder: '请输入',
      modelValue: '',
      clearable: true,
      type: 'text',
    },
    vModelProp: 'modelValue',
    events: ['input', 'change', 'focus', 'blur', 'keydown', 'keyup', 'paste'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  Textarea: {
    name: 'Textarea',
    displayName: '文本域',
    category: '表单组件',
    icon: '📋',
    type: 'Textarea',
    defaultProps: {
      placeholder: '请输入文本',
      modelValue: '',
      type: 'textarea',
      rows: 4,
      maxlength: 200,
      showWordLimit: false,
    },
    vModelProp: 'modelValue',
    events: ['input', 'change', 'focus', 'blur', 'keydown'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  Select: {
    name: 'Select',
    displayName: '下拉框',
    category: '表单组件',
    icon: '📑',
    type: 'Select',
    defaultProps: {
      placeholder: '请选择',
      modelValue: '',
      options: [],
      multiple: false,
      filterable: true,
    },
    vModelProp: 'modelValue',
    events: ['change', 'focus', 'blur', 'visible-change'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  Checkbox: {
    name: 'Checkbox',
    displayName: '复选框',
    category: '表单组件',
    icon: '☑️',
    type: 'Checkbox',
    defaultProps: {
      label: '复选框',
      modelValue: false,
    },
    vModelProp: 'modelValue',
    events: ['change', 'click'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  Radio: {
    name: 'Radio',
    displayName: '单选框',
    category: '表单组件',
    icon: '🔘',
    type: 'Radio',
    defaultProps: {
      label: '单选框',
      modelValue: false,
    },
    vModelProp: 'modelValue',
    events: ['change', 'click'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  Switch: {
    name: 'Switch',
    displayName: '开关',
    category: '表单组件',
    icon: '🔀',
    type: 'Switch',
    defaultProps: {
      modelValue: false,
      activeText: '开启',
      inactiveText: '关闭',
    },
    vModelProp: 'modelValue',
    events: ['change', 'click'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  Slider: {
    name: 'Slider',
    displayName: '滑块',
    category: '表单组件',
    icon: '🎚️',
    type: 'Slider',
    defaultProps: {
      modelValue: 20,
      min: 0,
      max: 100,
      step: 1,
      range: false,
      showTooltip: true,
    },
    vModelProp: 'modelValue',
    events: ['input', 'change', 'start', 'end'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  DatePicker: {
    name: 'DatePicker',
    displayName: '日期选择器',
    category: '表单组件',
    icon: '📅',
    type: 'DatePicker',
    defaultProps: {
      placeholder: '选择日期',
      type: 'date',
      format: 'YYYY-MM-DD',
      modelValue: '',
    },
    vModelProp: 'modelValue',
    events: ['change', 'open', 'close', 'panel-change'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  TimePicker: {
    name: 'TimePicker',
    displayName: '时间选择器',
    category: '表单组件',
    icon: '⏰',
    type: 'TimePicker',
    defaultProps: {
      placeholder: '选择时间',
      format: 'HH:mm:ss',
      modelValue: '',
    },
    vModelProp: 'modelValue',
    events: ['change', 'open', 'close'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  Upload: {
    name: 'Upload',
    displayName: '上传',
    category: '表单组件',
    icon: '⤴️',
    type: 'Upload',
    defaultProps: {
      action: '',
      multiple: true,
      drag: true,
      limit: 3,
    },
    events: ['change', 'success', 'error', 'progress', 'remove', 'dragover', 'drop'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  // === 数据/展示组件 ===
  Tabs: {
    name: 'Tabs',
    displayName: '标签页',
    category: '数据组件',
    icon: '📑',
    type: 'Tabs',
    defaultProps: {
      modelValue: 'tab1',
      items: [
        { label: '标签一', name: 'tab1' },
        { label: '标签二', name: 'tab2' },
      ],
    },
    vModelProp: 'modelValue',
    events: ['tab-click', 'tab-change'],
    canHaveChildren: true,
    slots: ['default'],
    package: 'element-plus',
  },

  Accordion: {
    name: 'Accordion',
    displayName: '折叠面板',
    category: '数据组件',
    icon: '📂',
    type: 'Accordion',
    defaultProps: {
      items: [
        { title: '面板一', name: 'pane1', content: '内容' },
        { title: '面板二', name: 'pane2', content: '内容' },
      ],
      modelValue: [],
    },
    vModelProp: 'modelValue',
    events: ['expand', 'collapse', 'change'],
    canHaveChildren: true,
    slots: ['default'],
    package: 'element-plus',
  },

  Table: {
    name: 'Table',
    displayName: '表格',
    category: '数据组件',
    icon: '📊',
    type: 'Table',
    defaultProps: {
      columns: [
        { label: '列1', prop: 'col1' },
        { label: '列2', prop: 'col2' },
      ],
      data: [
        { col1: '行1-1', col2: '行1-2' },
        { col1: '行2-1', col2: '行2-2' },
      ],
      stripe: true,
    },
    events: ['row-click', 'row-dblclick', 'sort-change', 'selection-change', 'page-change'],
    canHaveChildren: false,
    package: 'element-plus',
  },

  // === 结构组件 / Vue 核心 ===
  Teleport: {
    name: 'Teleport',
    displayName: 'Teleport',
    category: '结构组件',
    icon: '🛰️',
    type: 'Teleport',
    defaultProps: {
      to: 'body',
      disabled: false,
    },
    canHaveChildren: true,
    slots: ['default'],
    events: ['mounted', 'updated'],
    package: 'vue',
  },

  Suspense: {
    name: 'Suspense',
    displayName: 'Suspense',
    category: '结构组件',
    icon: '⏳',
    type: 'Suspense',
    defaultProps: {},
    canHaveChildren: true,
    slots: ['default', 'fallback'],
    events: ['resolve', 'fallback'],
    package: 'vue',
  },

  // === 拖拽特性 ===
  Draggable: {
    name: 'Draggable',
    displayName: '可拖拽列表',
    category: '拖拽特性',
    icon: '🧲',
    type: 'Draggable',
    defaultProps: {
      list: [],
      itemKey: 'id',
      group: 'default',
      animation: 200,
    },
    events: ['start', 'end', 'add', 'remove', 'change', 'move'],
    canHaveChildren: true,
    slots: ['default'],
    package: 'sortablejs',
  },

  TransitionGroup: {
    name: 'TransitionGroup',
    displayName: '列表动画容器',
    category: '拖拽特性',
    icon: '🎞️',
    type: 'TransitionGroup',
    defaultProps: {
      name: 'fade-move',
      tag: 'div',
    },
    events: ['before-enter', 'enter', 'after-enter', 'leave'],
    canHaveChildren: true,
    slots: ['default'],
    package: 'vue',
  },

  // === 复用组件 ===
  Reusable: {
    name: 'Reusable',
    displayName: '可复用组件',
    category: '复用组件',
    icon: '♻️',
    type: 'Reusable',
    defaultProps: {
      path: '',
    },
    canHaveChildren: false,
    package: 'builtin',
  },

  // === 路由组件 ===
  RouterLink: {
    name: 'RouterLink',
    displayName: '路由链接',
    category: '路由组件',
    icon: '🧭',
    type: 'RouterLink',
    defaultProps: {
      to: '/',
      text: '跳转',
      allowNavigate: false,
      target: '_self',
    },
    events: ['click', 'navigate'],
    canHaveChildren: true,
    slots: ['default'],
    package: 'vue-router',
  },

  RouterView: {
    name: 'RouterView',
    displayName: '路由视图',
    category: '路由组件',
    icon: '🗺️',
    type: 'RouterView',
    defaultProps: {},
    canHaveChildren: false,
    package: 'vue-router',
  },
}

// 按类别分组（用于左侧面板展示）
export const componentsByCategory = {
  容器组件: [
    components.Container,
    components.Flex,
    components.Grid,
    components.Card,
    components.Form,
  ],
  基础组件: [
    components.Button,
    components.Text,
    components.Heading,
    components.Divider,
    components.Link,
  ],
  媒体组件: [
    components.Image,
    components.Icon,
    components.Video,
  ],
  表单组件: [
    components.Input,
    components.Textarea,
    components.Select,
    components.Checkbox,
    components.Radio,
    components.Switch,
    components.Slider,
    components.DatePicker,
    components.TimePicker,
    components.Upload,
  ],
  数据组件: [
    components.Tabs,
    components.Accordion,
    components.Table,
  ],
  结构组件: [
    components.Teleport,
    components.Suspense,
  ],
  拖拽特性: [
    components.Draggable,
    components.TransitionGroup,
  ],
  路由组件: [
    components.RouterLink,
    components.RouterView,
  ],
  复用组件: [
    components.Reusable,
  ],
}

export default {
  map: componentMap,
  components,
  byCategory: componentsByCategory,
}

