import type { ValueProps } from "../../types";
import React from "react";
import DataTypeLabel from "./DataTypeLabel";
import { toType, escapeString } from "./../../helpers/util";

// theme
import Theme from "./../../themes/getStyle";

// attribute store for storing collapsed state
import AttributeStore from "./../../stores/ObjectAttributes";
export default function JsonString(props: ValueProps) {
  const [collapsed, setCollapsed] = React.useState(() =>
    AttributeStore.get(props.rjvId, props.namespace, "collapsed", true)
  );
  const handleToggleCollapsed = () => {
    const nextCollapsed = !collapsed;
    AttributeStore.set(
      props.rjvId,
      props.namespace,
      "collapsed",
      nextCollapsed
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
      <span className="string-value" {...style} onClick={handleToggleCollapsed}>
        "{value}"
      </span>
    </div>
  );
}
