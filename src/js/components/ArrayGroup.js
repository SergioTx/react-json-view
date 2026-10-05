import React from 'react'
import Theme from './../themes/getStyle'

import VariableMeta from './VariableMeta'
import ObjectName from './ObjectName'
import ObjectComponent from './DataTypes/Object'

// icons
import { CollapsedIcon, ExpandedIcon } from './ToggleIcons'

// single indent is 5px
const SINGLE_INDENT = 5

export default function ArrayGroup (props) {
  const [expanded, setExpanded] = React.useState([])

  const toggleCollapsed = (index) => {
    const newExpanded = []
    const maxLength = Math.max(expanded.length || 0, index + 1)
    for (let groupIndex = 0; groupIndex < maxLength; groupIndex++) {
      newExpanded[groupIndex] = expanded[groupIndex] === true
    }
    newExpanded[index] = !newExpanded[index]
    setExpanded(newExpanded)
  }

  function getExpandedIcon (index) {
    const { theme, iconStyle } = props

    if (expanded[index]) {
      return <ExpandedIcon {...{ theme, iconStyle }} />
    }

    return <CollapsedIcon {...{ theme, iconStyle }} />
  }

  const {
    src,
    groupArraysAfterLength,
    depth,
    name,
    theme,
    jsvRoot,
    namespace,
    ...rest
  } = props

  let objectPaddingLeft = 0

  const arrayGroupPaddingLeft = props.indentWidth * SINGLE_INDENT

  if (!jsvRoot) {
    objectPaddingLeft = props.indentWidth * SINGLE_INDENT
  }

  const size = groupArraysAfterLength
  const groups = Math.ceil(src.length / size)

  return (
    <div
      className='object-key-val'
      {...Theme(theme, jsvRoot ? 'jsv-root' : 'objectKeyVal', {
        paddingLeft: objectPaddingLeft
      })}
    >
      <ObjectName {...props} />

      <span>
        <VariableMeta size={src.length} {...props} />
      </span>
      {[...Array(groups)].map((_, index) => (
        <div
          key={index}
          className='object-key-val array-group'
          {...Theme(theme, 'objectKeyVal', {
            marginLeft: 6,
            paddingLeft: arrayGroupPaddingLeft
          })}
        >
          <span {...Theme(theme, 'brace-row')}>
            <div
              className='icon-container'
              {...Theme(theme, 'icon-container')}
              onClick={(e) => {
                toggleCollapsed(index)
              }}
            >
              {getExpandedIcon(index)}
            </div>
            {expanded[index]
              ? (
                <ObjectComponent
                  {...rest}
                  key={name + index}
                  depth={0}
                  name={false}
                  collapsed={false}
                  groupArraysAfterLength={size}
                  index_offset={index * size}
                  src={src.slice(index * size, index * size + size)}
                  namespace={namespace}
                  type='array'
                  parent_type='array_group'
                  theme={theme}
                  isLast={index === groups - 1 && (jsvRoot || props.isLast)}
                  listOfAncestors={[...(props.listOfAncestors || []), src]}
                />
                )
              : (
                <span
                  {...Theme(theme, 'brace')}
                  onClick={(e) => {
                    toggleCollapsed(index)
                  }}
                  className='array-group-brace'
                >
                  [
                  <div
                    {...Theme(theme, 'array-group-meta-data')}
                    className='array-group-meta-data'
                  >
                    <span
                      className='object-size'
                      {...Theme(theme, 'object-size')}
                    >
                      {index * size}
                      {' - '}
                      {index * size + size - 1 > src.length
                        ? src.length - 1
                        : index * size + size - 1}
                    </span>
                  </div>
                  ]
                </span>
                )}
            {!expanded[index] &&
              (index !== groups - 1 || (!jsvRoot && !props.isLast)) && (
                <span {...Theme(theme, 'comma')}>,</span>
            )}
          </span>
        </div>
      ))}
    </div>
  )
}
