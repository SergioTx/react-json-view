import type { CircularProps } from "../../types";
import React from "react";

// theme
import Theme from "./../../themes/getStyle";
export default function CircularReference(props: CircularProps) {
  const {
    namespace,
    quotesOnKeys,
    indentWidth = 4,
    theme,
    singleIndent = 5,
    isLast,
    jsvRoot,
  } = props;
  const displayName = props.name ? props.name : "";
  return (
    <div className="variable-row">
      <span
        {...Theme(theme, "object-name")}
        key={JSON.stringify(namespace)}
        {...Theme(theme, "objectKeyVal", {
          paddingLeft: indentWidth * singleIndent,
        })}
      >
        <span className="object-key">
          {quotesOnKeys && (
            <span
              style={{
                verticalAlign: "top",
              }}
            >
              "
            </span>
          )}
          <span>{displayName}</span>
          {quotesOnKeys && (
            <span
              style={{
                verticalAlign: "top",
              }}
            >
              "
            </span>
          )}
        </span>
        <span {...Theme(theme, "colon")}>:</span>
      </span>
      <span {...Theme(theme, "circularReference")}>[CIRCULAR REFERENCE]</span>
      {!isLast && !jsvRoot && <span {...Theme(theme, "comma")}>,</span>}
    </div>
  );
}
