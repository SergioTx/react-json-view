import React from 'react';

import type { DisplayProps } from '../types';
import {
  ArrowDown,
  ArrowRight,
  CircleMinus,
  CirclePlus,
  SquareMinus,
  SquarePlus,
} from './icons';
export function ExpandedIcon(props: DisplayProps) {
  const { iconStyle } = props;
  switch (iconStyle) {
    case 'triangle':
      return <ArrowDown className="expanded-icon" />;
    case 'square':
      return <SquareMinus className="expanded-icon" />;
    default:
      return <CircleMinus className="expanded-icon" />;
  }
}
export function CollapsedIcon(props: DisplayProps) {
  const { iconStyle } = props;
  switch (iconStyle) {
    case 'triangle':
      return <ArrowRight className="collapsed-icon" />;
    case 'square':
      return <SquarePlus className="collapsed-icon" />;
    default:
      return <CirclePlus className="collapsed-icon" />;
  }
}
