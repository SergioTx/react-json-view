import React from 'react';

import type { DisplayProps } from '../types';
import Theme from './../themes/getStyle';
import {
  ArrowDown,
  ArrowRight,
  CircleMinus,
  CirclePlus,
  SquareMinus,
  SquarePlus,
} from './icons';
export function ExpandedIcon(props: DisplayProps) {
  const { theme, iconStyle } = props;
  switch (iconStyle) {
    case 'triangle':
      return (
        <ArrowDown
          {...Theme(theme, 'expanded-icon')}
          className="expanded-icon"
        />
      );
    case 'square':
      return (
        <SquareMinus
          {...Theme(theme, 'expanded-icon')}
          className="expanded-icon"
        />
      );
    default:
      return (
        <CircleMinus
          {...Theme(theme, 'expanded-icon')}
          className="expanded-icon"
        />
      );
  }
}
export function CollapsedIcon(props: DisplayProps) {
  const { theme, iconStyle } = props;
  switch (iconStyle) {
    case 'triangle':
      return (
        <ArrowRight
          {...Theme(theme, 'collapsed-icon')}
          className="collapsed-icon"
        />
      );
    case 'square':
      return (
        <SquarePlus
          {...Theme(theme, 'collapsed-icon')}
          className="collapsed-icon"
        />
      );
    default:
      return (
        <CirclePlus
          {...Theme(theme, 'collapsed-icon')}
          className="collapsed-icon"
        />
      );
  }
}
