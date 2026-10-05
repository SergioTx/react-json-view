import React from "react";

import type { ValueProps } from "../../types";
import { escapeString, toType } from "./../../helpers/util";
// attribute store for storing collapsed state
import AttributeStore from "./../../stores/ObjectAttributes";
// theme
import Theme from "./../../themes/getStyle";
import DataTypeLabel from "./DataTypeLabel";
export default function JsonString(props: ValueProps) {
  const [collapsed, setCollapsed] = React.useState(() =>
    AttributeStore.get(props.rjvId, props.namespace, "collapsed", true),
  );
  const handleToggleCollapsed = () => {
    const nextCollapsed = !collapsed;
    AttributeStore.set(
      props.rjvId,
      props.namespace,
      "collapsed",
      nextCollapsed,
    );
    setCollapsed(nextCollapsed);
  };
  const typeName = "string";
  const { collapseStringsAfterLength, theme, escapeStrings } = props;
  const rawValue =
    typeof props.value === "string" ? props.value : String(props.value);
  const content = escapeStrings ? escapeString(rawValue) : rawValue;
  let value: React.ReactNode = content;
  const style: {
    style: React.CSSProperties;
  } = {
    style: {
      cursor: "default",
      wordBreak: "break-all",
    },
  };
  if (
    typeof collapseStringsAfterLength === "number" &&
    toType(collapseStringsAfterLength) === "integer" &&
    content.length > collapseStringsAfterLength
  ) {
    style.style.cursor = "pointer";
    if (collapsed) {
      value = (
        <span>
          {content.substring(0, collapseStringsAfterLength)}
          <span {...Theme(theme, "ellipsis")}> ...</span>
        </span>
      );
    }
  }
  return (
    <div {...Theme(theme, "string")}>
      <DataTypeLabel typeName={typeName} {...props} />
      <button
        type="button"
        className="string-value"
        aria-label={collapsed ? "Expand string" : "Collapse string"}
        {...style}
        style={{
          ...style.style,
          display: "inline",
          border: 0,
          padding: 0,
          background: "none",
          font: "inherit",
          color: "inherit",
          verticalAlign: "baseline",
        }}
        onClick={handleToggleCollapsed}
      >
        {'"'}
        {value}
        {'"'}
      </button>
    </div>
  );
}
