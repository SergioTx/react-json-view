import type { ValueProps } from '../../types';
import React from 'react';

// theme
import Theme from './../../themes/getStyle';
export default function Null(props: ValueProps) {
  return <div {...Theme(props.theme, 'null')}>NULL</div>;
}
