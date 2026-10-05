import React from 'react'

// theme
import Theme from './../../themes/getStyle'

export default function CircularReference (props) {
  const {
    namespace,
    quotesOnKeys,
    indentWidth,
    theme,
    singleIndent,
    isLast,
    jsvRoot
  } = props

  const displayName = props.name ? props.name : ''
  return (
    <div className='variable-row'>
      <span
        {...Theme(theme, 'object-name')}
        key={namespace}
        {...Theme(theme, 'objectKeyVal', {
          paddingLeft: indentWidth * singleIndent
        })}
      >
        <span className='object-key'>
          {quotesOnKeys && <span style={{ verticalAlign: 'top' }}>"</span>}
          <span>{displayName}</span>
          {quotesOnKeys && <span style={{ verticalAlign: 'top' }}>"</span>}
        </span>
        <span {...Theme(theme, 'colon')}>:</span>
      </span>
      <span {...Theme(theme, 'circularReference')}>[CIRCULAR REFERENCE]</span>
      {!isLast && !jsvRoot && <span {...Theme(theme, 'comma')}>,</span>}
    </div>
  )
}
