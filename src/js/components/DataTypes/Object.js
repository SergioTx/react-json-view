import React from 'react'
import { toType } from './../../helpers/util'
import { JsonCircularReference } from './DataTypes'
import VariableEditor from './../VariableEditor'
import VariableMeta from './../VariableMeta'
import ArrayGroup from './../ArrayGroup'
import ObjectName from './../ObjectName'
import AttributeStore from './../../stores/ObjectAttributes'
import { CollapsedIcon, ExpandedIcon } from './../ToggleIcons'
import Theme from './../../themes/getStyle'

const SINGLE_INDENT = 5

function getExpanded (props) {
  const expanded =
    (props.collapsed === false ||
      (props.collapsed !== true && props.collapsed > props.depth)) &&
    (!props.shouldCollapse ||
      props.shouldCollapse({
        name: props.name,
        src: props.src,
        type: toType(props.src),
        namespace: props.namespace
      }) === false) &&
    Object.keys(props.src).length !== 0
  return AttributeStore.get(props.rjvId, props.namespace, 'expanded', expanded)
}

export default function RjvObject (props) {
  const {
    depth,
    src,
    namespace,
    name,
    type,
    parent_type: parentType,
    theme,
    jsvRoot,
    iconStyle,
    isLast,
    ...rest
  } = props
  const [state, setState] = React.useState(() => ({
    expanded: getExpanded(props),
    prevProps: props
  }))
  const [hovered, setHovered] = React.useState(false)
  const previous = state.prevProps
  if (
    src !== previous.src ||
    props.collapsed !== previous.collapsed ||
    name !== previous.name ||
    namespace !== previous.namespace ||
    props.rjvId !== previous.rjvId
  ) {
    setState({ expanded: getExpanded(props), prevProps: props })
  }
  const { expanded } = state
  const objectType = type === 'array' ? 'array' : 'object'
  const size = Object.keys(src).length
  const ancestors = [...(props.listOfAncestors || []), src]

  function toggleCollapsed () {
    const nextExpanded = !expanded
    AttributeStore.set(props.rjvId, namespace, 'expanded', nextExpanded)
    setState({ expanded: nextExpanded, prevProps: props })
  }

  function renderContents () {
    let keys = Object.keys(src)
    if (props.sortKeys && objectType !== 'array') keys = keys.sort()
    return keys.map((key, index) => {
      const value = src[key]
      const valueType = toType(value)
      const variableName =
        parentType === 'array_group' && props.index_offset
          ? parseInt(key, 10) + props.index_offset
          : key
      const childProps = {
        theme,
        iconStyle,
        ...rest,
        depth: depth + 1,
        name: variableName,
        src: value,
        namespace: namespace.concat(variableName),
        parent_type: objectType,
        isLast: index === keys.length - 1
      }
      if (valueType === 'window') return null
      if (ancestors.includes(value)) {
        return (
          <JsonCircularReference
            key={variableName}
            {...childProps}
            singleIndent={SINGLE_INDENT}
          />
        )
      }
      if (valueType === 'object' || valueType === 'array') {
        const ObjectComponent =
          valueType === 'array' &&
          props.groupArraysAfterLength &&
          value.length > props.groupArraysAfterLength
            ? ArrayGroup
            : RjvObject
        return (
          <ObjectComponent
            key={variableName}
            {...childProps}
            type={valueType}
            listOfAncestors={ancestors}
          />
        )
      }
      return (
        <VariableEditor
          key={variableName + '_' + namespace}
          {...childProps}
          variable={{ name: variableName, value, type: valueType }}
          singleIndent={SINGLE_INDENT}
          namespace={namespace}
          type={type}
        />
      )
    })
  }

  const styles = {}
  if (!jsvRoot && parentType !== 'array_group') { styles.paddingLeft = props.indentWidth * SINGLE_INDENT } else if (parentType === 'array_group') {
    styles.borderLeft = 0
    styles.display = 'inline'
  }
  const IconComponent = expanded ? ExpandedIcon : CollapsedIcon

  return (
    <div
      className='object-key-val'
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...Theme(theme, jsvRoot ? 'jsv-root' : 'objectKeyVal', styles)}
    >
      {parentType === 'array_group'
        ? (
          <span>
            <span {...Theme(theme, 'brace')}>
              {objectType === 'array' ? '[' : '{'}
            </span>
          </span>
          )
        : (
          <span>
            <span onClick={toggleCollapsed} {...Theme(theme, 'brace-row')}>
              <div className='icon-container' {...Theme(theme, 'icon-container')}>
                <IconComponent {...{ theme, iconStyle }} />
              </div>
              <ObjectName {...props} />
              <span {...Theme(theme, 'brace')}>
                {objectType === 'array' ? '[' : '{'}
              </span>
            </span>
          </span>
          )}
      {expanded
        ? (
          <div className='pushed-content object-container'>
            <div className='object-content' {...Theme(theme, 'pushed-content')}>
              {renderContents()}
            </div>
          </div>
          )
        : (
            size !== 0 && (
              <div
                {...Theme(theme, 'ellipsis')}
                className='node-ellipsis'
                onClick={toggleCollapsed}
              >
                ...
              </div>
            )
          )}
      <span className='brace-row'>
        <span
          style={{
            ...Theme(theme, 'brace').style,
            paddingLeft: expanded ? '3px' : '0px'
          }}
        >
          {objectType === 'array' ? ']' : '}'}
        </span>
      </span>
      {!isLast && !jsvRoot && <span {...Theme(theme, 'comma')}>,</span>}
      <VariableMeta rowHovered={hovered} size={size} {...props} />
    </div>
  )
}
