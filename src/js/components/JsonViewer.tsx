import React from "react";

import type { Namespace, NodeProps } from "../types";
import ArrayGroup from "./ArrayGroup";
import JsonObject from "./DataTypes/Object";
export default function JsonViewer(props: NodeProps) {
  let namespace: Namespace = [
    typeof props.name === "string" ||
    typeof props.name === "number" ||
    props.name === false
      ? props.name
      : null,
  ];
  let ObjectComponent = JsonObject;
  if (typeof props.name === "object" && !Array.isArray(props.name)) {
    // Support Classes and Functional Components
    const component: unknown = props.name?.type;
    const componentName =
      typeof component === "function"
        ? component.name
        : typeof component === "object" &&
            component !== null &&
            "displayName" in component &&
            typeof component.displayName === "string"
          ? component.displayName
          : "Anonymous";
    namespace = [componentName];
  }
  if (
    Array.isArray(props.src) &&
    props.groupArraysAfterLength &&
    props.src.length > props.groupArraysAfterLength
  ) {
    ObjectComponent = ArrayGroup;
  }
  return (
    <div className="pretty-json-container object-container">
      <div className="object-content">
        <ObjectComponent namespace={namespace} depth={0} jsvRoot {...props} />
      </div>
    </div>
  );
}
