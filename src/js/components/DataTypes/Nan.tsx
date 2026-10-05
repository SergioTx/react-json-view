import type { ValueProps } from "../../types";
import React from "react";

// theme
import Theme from "./../../themes/getStyle";
export default function Nan(props: ValueProps) {
  return <div {...Theme(props.theme, "nan")}>NaN</div>;
}
