import React from 'react';

import type { MetadataProps } from '../types';
import { getFlashClass } from './../helpers/util';
import Theme from './../themes/getStyle';
import CopyToClipboard from './CopyToClipboard';
export default function VariableMeta({
  size,
  theme,
  displayObjectSize,
  enableClipboard,
  src,
  namespace,
  rowHovered,
  flashingUpdates,
}: MetadataProps) {
  const [flash, setFlash] = React.useState({ size, count: 0 });
  if (flash.size !== size) {
    setFlash({
      size,
      count: flashingUpdates ? flash.count + 1 : flash.count,
    });
  }
  const flashClass = getFlashClass(flashingUpdates, flash.count);
  return (
    <div {...Theme(theme, 'object-meta-data')} className="object-meta-data">
      {displayObjectSize && (
        <span
          className={['object-size', flashClass].filter(Boolean).join(' ')}
          {...Theme(theme, 'object-size')}
        >
          {size} item{size === 1 ? '' : 's'}
        </span>
      )}
      {enableClipboard && (
        <CopyToClipboard
          rowHovered={rowHovered}
          clickCallback={enableClipboard}
          {...{
            src,
            theme,
            namespace,
          }}
        />
      )}
    </div>
  );
}
