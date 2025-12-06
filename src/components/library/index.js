// Element Plus and utility component re-exports used by componentRegistry
import { h, Teleport as VueTeleport, Suspense as VueSuspense, TransitionGroup } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Draggable from 'vuedraggable'
import {
  ElButton,
  ElInput,
  ElSelect,
  ElCheckbox,
  ElRadio,
  ElSwitch,
  ElSlider,
  ElDatePicker,
  ElTimePicker,
  ElUpload,
  ElImage,
  ElIcon,
  ElDivider,
  ElCard,
  ElTabs,
  ElTabPane,
  ElCollapse,
  ElCollapseItem,
  ElTable,
  ElTableColumn,
  ElForm,
  ElFormItem,
} from 'element-plus'

// Atomic wrappers (simple pass-through)
export const VButton = ElButton
export const VInput = ElInput
export const VTextarea = ElInput
export const VSelect = ElSelect
export const VCheckbox = ElCheckbox
export const VRadio = ElRadio
export const VSwitch = ElSwitch
export const VSlider = ElSlider
export const VDatePicker = ElDatePicker
export const VTimePicker = ElTimePicker
export const VUpload = ElUpload
export const VImage = ElImage
export const VIcon = ElIcon
export const VDivider = ElDivider
export const VCard = ElCard
export const VTabs = ElTabs
export const VTabPane = ElTabPane
export const VAccordion = ElCollapse
export const VAccordionItem = ElCollapseItem
export const VTable = ElTable
export const VTableColumn = ElTableColumn
export const VForm = ElForm
export const VFormItem = ElFormItem
export const VText = {
  name: 'VText',
  props: ['text'],
  setup(props) {
    return () => h('span', props.text || '')
  },
}

// Link wrapper to keep canvas inert unless explicitly allowed
export const VLink = {
  name: 'VLink',
  props: {
    href: { type: String, default: '#' },
    type: { type: String, default: 'primary' },
    underline: { type: Boolean, default: true },
    disabled: { type: Boolean, default: false },
    target: { type: String, default: '_self' },
    allowNavigate: { type: Boolean, default: false },
    text: { type: String, default: '' },
  },
  emits: ['click'],
  setup(props, { emit, slots }) {
    const handleClick = (e) => {
      e.stopPropagation()
      if (!props.allowNavigate || props.disabled) {
        e.preventDefault()
      }
      emit('click', e)
    }

    return () => h(
      'a',
      {
        href: props.allowNavigate && !props.disabled ? props.href || '#' : 'javascript:void(0)',
        target: props.target,
        class: [
          'el-link',
          props.type ? `el-link--${props.type}` : '',
          props.underline ? 'is-underline' : '',
          props.disabled ? 'is-disabled' : '',
        ].filter(Boolean),
        onClick: handleClick,
      },
      slots.default ? slots.default() : (props.text || props.href || '链接文本')
    )
  },
}

// Drag/transition
export const VDraggable = Draggable
export const VTransitionGroup = TransitionGroup

// Vue core wrappers
export const VTeleport = VueTeleport
export const VSuspense = VueSuspense

// Router
export const VRouterLink = {
  name: 'VRouterLink',
  props: {
    to: { type: [String, Object], default: '/' },
    replace: { type: Boolean, default: false },
    allowNavigate: { type: Boolean, default: false },
    text: { type: String, default: '' },
    target: { type: String, default: '_self' },
  },
  setup(props, { slots }) {
    return () => h(
      RouterLink,
      { to: props.to || '/', replace: props.replace, custom: true },
      {
        default: ({ href, navigate, isActive, isExactActive }) => h(
          'a',
          {
            href,
            target: props.target || '_self',
            class: {
              'router-link-active': isActive,
              'router-link-exact-active': isExactActive,
            },
            onClick: (e) => {
              e.stopPropagation()
              if (!props.allowNavigate) {
                e.preventDefault()
                return
              }
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) {
                return
              }
              e.preventDefault()
              navigate()
            },
          },
          slots.default ? slots.default() : (props.text || href || '跳转')
        ),
      }
    )
  },
}

export const VRouterView = RouterView

// Reusable placeholder (render nothing but keeps type)
export const VReusable = {
  name: 'VReusable',
  props: ['path'],
  setup(props) {
    return () => h('div', { class: 'reusable-placeholder' }, props.path || 'Reusable Component')
  },
}
