import React from 'react'
import DataTypeLabel from './DataTypeLabel'

// theme
import Theme from './../../themes/getStyle'

export default function Regexp (props) {
  const typeName = 'regexp'

  return (
    <div {...Theme(props.theme, 'regexp')}>
      <DataTypeLabel typeName={typeName} {...props} />
      {props.value.toString()}
    </div>
  )
}
