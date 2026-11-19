import React from 'react';

import type { MetadataProps } from '../types';
import { getFlashClass } from './../helpers/util';
import CopyToClipboard from './CopyToClipboard';
export default function VariableMeta({
  size,
  theme,
  displayObjectSize,
  enableClipboard,
  src,
  namespace,
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
    <div className="object-meta-data">
      {displayObjectSize && (
        <span className={['object-size', flashClass].filter(Boolean).join(' ')}>
          {size} item{size === 1 ? '' : 's'}
        </span>
      )}
      {enableClipboard && (
        <CopyToClipboard
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
