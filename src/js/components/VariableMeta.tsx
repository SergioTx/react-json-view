import React from "react";

import type { MetadataProps } from "../types";
import Theme from "./../themes/getStyle";
import CopyToClipboard from "./CopyToClipboard";
export default function VariableMeta({
  size,
  theme,
  displayObjectSize,
  enableClipboard,
  src,
  namespace,
  rowHovered,
}: MetadataProps) {
  return (
    <div {...Theme(theme, "object-meta-data")} className="object-meta-data">
      {displayObjectSize && (
        <span className="object-size" {...Theme(theme, "object-size")}>
          {size} item{size === 1 ? "" : "s"}
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
