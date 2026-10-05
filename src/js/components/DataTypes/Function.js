import React from 'react'
import DataTypeLabel from './DataTypeLabel'

// theme
import Theme from './../../themes/getStyle'

// attribute store for storing collapsed state
import AttributeStore from './../../stores/ObjectAttributes'

export default function JsonFunction (props) {
  const [collapsed, setCollapsed] = React.useState(() =>
    AttributeStore.get(props.rjvId, props.namespace, 'collapsed', true)
  )

  const handleToggleCollapsed = () => {
    const nextCollapsed = !collapsed
    AttributeStore.set(props.rjvId, props.namespace, 'collapsed', nextCollapsed)
    setCollapsed(nextCollapsed)
  }

  const typeName = 'function'

  const getFunctionDisplay = () => {
    if (collapsed) {
      return (
        <span>
          {props.value
            .toString()
            .slice(9, -1)
            .replace(/\{[\s\S]+/, '')}
          <span className='function-collapsed' style={{ fontWeight: 'bold' }}>
            <span>{'{'}</span>
            <span {...Theme(props.theme, 'ellipsis')}>...</span>
            <span>{'}'}</span>
          </span>
        </span>
      )
    } else {
      return props.value.toString().slice(9, -1)
    }
  }

  return (
    <div {...Theme(props.theme, 'function')}>
      <DataTypeLabel typeName={typeName} {...props} />
      <span
        {...Theme(props.theme, 'function-value')}
        className='rjv-function-container'
        onClick={handleToggleCollapsed}
      >
        {getFunctionDisplay()}
      </span>
    </div>
  )
}
