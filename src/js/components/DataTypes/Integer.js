import React from 'react'
import DataTypeLabel from './DataTypeLabel'

// theme
import Theme from './../../themes/getStyle'

export default function Integer (props) {
  const typeName = 'int'

  return (
    <div {...Theme(props.theme, 'integer')}>
      <DataTypeLabel typeName={typeName} {...props} />
      {props.value}
    </div>
  )
}
