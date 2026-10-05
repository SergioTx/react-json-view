import React from "react";

import type { NodeProps } from "../../types";
import { normalizeNamespace } from "../../types";
import { toType } from "./../../helpers/util";
import AttributeStore from "./../../stores/ObjectAttributes";
import Theme from "./../../themes/getStyle";
import ArrayGroup from "./../ArrayGroup";
import ObjectName from "./../ObjectName";
import { CollapsedIcon, ExpandedIcon } from "./../ToggleIcons";
import VariableEditor from "./../VariableEditor";
import VariableMeta from "./../VariableMeta";
import { JsonCircularReference } from "./DataTypes";
const SINGLE_INDENT = 5;
function getExpanded(props: NodeProps) {
  const expanded =
    (props.collapsed === false ||
      (typeof props.collapsed === "number" &&
        props.collapsed > (props.depth ?? 0))) &&
    (!props.shouldCollapse ||
      props.shouldCollapse({
        name: props.name,
        src: props.src,
        type: Array.isArray(props.src) ? "array" : "object",
        namespace: normalizeNamespace(props.namespace),
      }) === false) &&
    Object.keys(props.src).length !== 0;
  return AttributeStore.get(props.rjvId, props.namespace, "expanded", expanded);
}
export default function RjvObject(props: NodeProps): React.JSX.Element {
  const {
    depth = 0,
    src,
    namespace: namespaceProp,
    name,
    type,
    parent_type: parentType,
    theme,
    jsvRoot,
    iconStyle,
    isLast,
    ...rest
  } = props;
  const namespace = normalizeNamespace(namespaceProp);
  const [state, setState] = React.useState(() => ({
    expanded: getExpanded(props),
    prevProps: props,
  }));
  const [hovered, setHovered] = React.useState(false);
  const previous = state.prevProps;
  if (
    src !== previous.src ||
    props.collapsed !== previous.collapsed ||
    name !== previous.name ||
    props.namespace !== previous.namespace ||
    props.rjvId !== previous.rjvId
  ) {
    setState({
      expanded: getExpanded(props),
      prevProps: props,
    });
  }
  const { expanded } = state;
  const objectType: "array" | "object" = type === "array" ? "array" : "object";
  const size = Object.keys(src).length;
  const ancestors = [...(props.listOfAncestors || []), src];
  function toggleCollapsed() {
    const nextExpanded = !expanded;
    AttributeStore.set(props.rjvId, namespace, "expanded", nextExpanded);
    setState({
      expanded: nextExpanded,
      prevProps: props,
    });
  }
  function renderContents() {
    let keys = Object.keys(src);
    if (props.sortKeys && objectType !== "array") {
      keys = keys.sort();
    }
    return keys.map((key, index) => {
      const value: unknown = Reflect.get(src, key);
      const valueType = toType(value);
      const variableName =
        parentType === "array_group" && props.index_offset
          ? parseInt(key, 10) + props.index_offset
          : key;
      const childProps = {
        theme,
        iconStyle,
        ...rest,
        depth: depth + 1,
        name: variableName,
        src: value,
        namespace: namespace.concat(variableName),
        parent_type: objectType,
        isLast: index === keys.length - 1,
      };
      if (valueType === "window") {
        return null;
      }
      if (ancestors.some((ancestor) => ancestor === value)) {
        return (
          <JsonCircularReference
            key={variableName}
            {...childProps}
            singleIndent={SINGLE_INDENT}
          />
        );
      }
      if (
        typeof value === "object" &&
        value !== null &&
        (valueType === "object" || valueType === "array")
      ) {
        const ObjectComponent =
          Array.isArray(value) &&
          props.groupArraysAfterLength &&
          value.length > props.groupArraysAfterLength
            ? ArrayGroup
            : RjvObject;
        return (
          <ObjectComponent
            key={variableName}
            {...childProps}
            src={value}
            type={Array.isArray(value) ? "array" : "object"}
            listOfAncestors={ancestors}
          />
        );
      }
      return (
        <VariableEditor
          key={variableName + "_" + namespace}
          {...childProps}
          variable={{
            name: variableName,
            value,
            type: valueType,
          }}
          singleIndent={SINGLE_INDENT}
          namespace={namespace}
          type={type}
        />
      );
    });
  }
  const styles: React.CSSProperties = {};
  if (!jsvRoot && parentType !== "array_group") {
    styles.paddingLeft = (props.indentWidth ?? 4) * SINGLE_INDENT;
  } else if (parentType === "array_group") {
    styles.borderLeft = 0;
    styles.display = "inline";
  }
  const IconComponent = expanded ? ExpandedIcon : CollapsedIcon;
  return (
    <div
      className="object-key-val"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...Theme(theme, jsvRoot ? "jsv-root" : "objectKeyVal", styles)}
    >
      {parentType === "array_group" ? (
        <span>
          <span {...Theme(theme, "brace")}>
            {objectType === "array" ? "[" : "{"}
          </span>
        </span>
      ) : (
        <span>
          <button
            type="button"
            onClick={toggleCollapsed}
            {...Theme(theme, "brace-row")}
            style={{
              border: 0,
              padding: 0,
              background: "none",
              color: "inherit",
              ...Theme(theme, "brace-row").style,
            }}
          >
            <span
              className="icon-container"
              {...Theme(theme, "icon-container")}
            >
              <IconComponent
                {...{
                  theme,
                  iconStyle,
                }}
              />
            </span>
            <ObjectName {...props} />
            <span {...Theme(theme, "brace")}>
              {objectType === "array" ? "[" : "{"}
            </span>
          </button>
        </span>
      )}
      {expanded ? (
        <div className="pushed-content object-container">
          <div className="object-content" {...Theme(theme, "pushed-content")}>
            {renderContents()}
          </div>
        </div>
      ) : (
        size !== 0 && (
          <button
            type="button"
            {...Theme(theme, "ellipsis")}
            className="node-ellipsis"
            onClick={toggleCollapsed}
            style={{
              border: 0,
              padding: 0,
              background: "none",
              ...Theme(theme, "ellipsis").style,
            }}
          >
            ...
          </button>
        )
      )}
      <span className="brace-row">
        <span
          style={{
            ...Theme(theme, "brace").style,
            paddingLeft: expanded ? "3px" : "0px",
          }}
        >
          {objectType === "array" ? "]" : "}"}
        </span>
      </span>
      {!isLast && !jsvRoot && <span {...Theme(theme, "comma")}>,</span>}
      <VariableMeta rowHovered={hovered} size={size} {...props} />
    </div>
  );
}
