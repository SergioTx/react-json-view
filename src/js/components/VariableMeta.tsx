import type { MetadataProps } from "../types";
import React from "react";
import CopyToClipboard from "./CopyToClipboard";
import Theme from "./../themes/getStyle";
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
    <div
      {...Theme(theme, "object-meta-data")}
      className="object-meta-data"
      onClick={(event) => event.stopPropagation()}
    >
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
