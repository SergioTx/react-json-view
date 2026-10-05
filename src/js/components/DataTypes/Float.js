import React from 'react'
import DataTypeLabel from './DataTypeLabel'

// theme
import Theme from './../../themes/getStyle'

export default function Float (props) {
  const typeName = 'float'

  return (
    <div {...Theme(props.theme, 'float')}>
      <DataTypeLabel typeName={typeName} {...props} />
      {props.value}
    </div>
  )
}
