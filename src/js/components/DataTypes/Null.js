import React from 'react'

// theme
import Theme from './../../themes/getStyle'

export default function Null (props) {
  return <div {...Theme(props.theme, 'null')}>NULL</div>
}
