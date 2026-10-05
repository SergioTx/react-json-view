import { rjvDefault, rjvGrey } from "./base16/rjv-themes";
import constants from "./styleConstants";
import { createStyling } from "react-base16-styling";
import type {
  Base16Theme,
  StylingConfig,
  StylingFunction,
  Theme as LibraryTheme,
} from "react-base16-styling";
import type { CSSProperties } from "react";
import type { Theme, StyleProps } from "../types";
const colorMap = (theme: Base16Theme) => ({
  backgroundColor: theme.base00,
  ellipsisColor: theme.base09,
  braceColor: theme.base07,
  expandedIcon: theme.base0D,
  collapsedIcon: theme.base0E,
  keyColor: theme.base07,
  arrayKeyColor: theme.base0C,
  objectSize: theme.base04,
  copyToClipboard: theme.base0F,
  copyToClipboardCheck: theme.base0D,
  objectBorder: theme.base02,
  dataTypes: {
    boolean: theme.base0E,
    date: theme.base0D,
    float: theme.base0B,
    function: theme.base0D,
    integer: theme.base0F,
    string: theme.base09,
    nan: theme.base08,
    null: theme.base0A,
    undefined: theme.base05,
    regexp: theme.base0A,
    background: theme.base02,
  },
});
const getDefaultThemeStyling = (theme: Base16Theme): StylingConfig => {
  const colors = colorMap(theme);
  return {
    "app-container": {
      fontFamily: constants.globalFontFamily,
      cursor: constants.globalCursor,
      backgroundColor: colors.backgroundColor,
      position: "relative",
    },
    ellipsis: {
      display: "inline-block",
      color: colors.ellipsisColor,
      fontSize: constants.ellipsisFontSize,
      lineHeight: constants.ellipsisLineHeight,
      cursor: constants.ellipsisCursor,
    },
    "brace-row": {
      display: "inline-block",
      cursor: "pointer",
    },
    brace: {
      display: "inline-block",
      cursor: constants.braceCursor,
      fontWeight: constants.braceFontWeight,
      color: colors.braceColor,
    },
    "expanded-icon": {
      color: colors.expandedIcon,
    },
    "collapsed-icon": {
      color: colors.collapsedIcon,
    },
    colon: {
      display: "inline-block",
      margin: constants.keyMargin,
      color: colors.keyColor,
      verticalAlign: "top",
    },
    objectKeyVal: (component, ...[args]) => {
      const variableStyle = (args ?? {}) as CSSProperties;
      return {
        style: {
          paddingTop: constants.keyValPaddingTop,
          paddingRight: constants.keyValPaddingRight,
          paddingBottom: constants.keyValPaddingBottom,
          borderLeft: constants.keyValBorderLeft + " " + colors.objectBorder,
          ...variableStyle,
        },
      };
    },
    "pushed-content": {
      marginLeft: constants.pushedContentMarginLeft,
    },
    variableValue: (component, ...[args]) => {
      const variableStyle = (args ?? {}) as CSSProperties;
      return {
        style: {
          display: "inline-block",
          paddingRight: constants.variableValuePaddingRight,
          position: "relative",
          ...variableStyle,
        },
      };
    },
    "object-name": {
      display: "inline-block",
      color: colors.keyColor,
      letterSpacing: constants.keyLetterSpacing,
      fontStyle: constants.keyFontStyle,
      verticalAlign: constants.keyVerticalAlign,
      opacity: constants.keyOpacity,
    },
    "array-key": {
      display: "inline-block",
      color: colors.arrayKeyColor,
      letterSpacing: constants.keyLetterSpacing,
      fontStyle: constants.keyFontStyle,
      verticalAlign: constants.keyVerticalAlign,
      opacity: constants.keyOpacity,
    },
    "object-size": {
      color: colors.objectSize,
      borderRadius: constants.objectSizeBorderRadius,
      fontStyle: constants.objectSizeFontStyle,
      margin: constants.objectSizeMargin,
      cursor: "default",
    },
    "data-type-label": {
      fontSize: constants.dataTypeFontSize,
      marginRight: constants.dataTypeMarginRight,
      opacity: constants.datatypeOpacity,
    },
    boolean: {
      display: "inline-block",
      color: colors.dataTypes.boolean,
    },
    date: {
      display: "inline-block",
      color: colors.dataTypes.date,
    },
    "date-value": {
      marginLeft: constants.dateValueMarginLeft,
    },
    float: {
      display: "inline-block",
      color: colors.dataTypes.float,
    },
    function: {
      display: "inline-block",
      color: colors.dataTypes.function,
      cursor: "pointer",
      whiteSpace: "pre-line",
    },
    "function-value": {
      fontStyle: "italic",
    },
    integer: {
      display: "inline-block",
      color: colors.dataTypes.integer,
    },
    string: {
      display: "inline-block",
      color: colors.dataTypes.string,
    },
    nan: {
      display: "inline-block",
      color: colors.dataTypes.nan,
      fontSize: constants.nanFontSize,
      fontWeight: constants.nanFontWeight,
      backgroundColor: colors.dataTypes.background,
      padding: constants.nanPadding,
      borderRadius: constants.nanBorderRadius,
    },
    null: {
      display: "inline-block",
      color: colors.dataTypes.null,
      fontSize: constants.nullFontSize,
      fontWeight: constants.nullFontWeight,
      backgroundColor: colors.dataTypes.background,
      padding: constants.nullPadding,
      borderRadius: constants.nullBorderRadius,
    },
    undefined: {
      display: "inline-block",
      color: colors.dataTypes.undefined,
      fontSize: constants.undefinedFontSize,
      padding: constants.undefinedPadding,
      borderRadius: constants.undefinedBorderRadius,
      backgroundColor: colors.dataTypes.background,
    },
    circularReference: {
      display: "inline-block",
      color: colors.dataTypes.null,
      fontSize: constants.nullFontSize,
      fontWeight: constants.nullFontWeight,
      backgroundColor: colors.dataTypes.background,
      padding: constants.nullPadding,
      borderRadius: constants.nullBorderRadius,
    },
    regexp: {
      display: "inline-block",
      color: colors.dataTypes.regexp,
    },
    "copy-to-clipboard": {
      cursor: constants.clipboardCursor,
    },
    "copy-icon": {
      color: colors.copyToClipboard,
      fontSize: constants.iconFontSize,
      marginRight: constants.iconMarginRight,
      verticalAlign: "top",
    },
    "copy-icon-copied": {
      color: colors.copyToClipboardCheck,
      marginLeft: constants.clipboardCheckMarginLeft,
    },
    "array-group-meta-data": {
      display: "inline-block",
      padding: constants.arrayGroupMetaPadding,
    },
    "object-meta-data": {
      display: "inline-block",
      padding: constants.metaDataPadding,
    },
    "icon-container": {
      display: "inline-block",
      width: constants.iconContainerWidth,
    },
    tooltip: {
      padding: constants.tooltipPadding,
    },
    "function-ellipsis": {
      display: "inline-block",
      color: colors.ellipsisColor,
      fontSize: constants.ellipsisFontSize,
      lineHeight: constants.ellipsisLineHeight,
      cursor: constants.ellipsisCursor,
    },
    comma: {
      display: "inline-block",
      color: constants.commaColor,
      fontSize: constants.commaFontSize,
      marginRight: constants.commaMarginRight,
      cursor: "default",
    },
  };
};
const getStyle = (theme: Theme | undefined): StylingFunction => {
  let rjvTheme = rjvDefault;
  if (theme === false || theme === "none") {
    rjvTheme = rjvGrey;
  }
  const selected: LibraryTheme =
    typeof theme === "object"
      ? {
          ...theme,
          scheme: "custom",
          author: "custom",
        }
      : typeof theme === "string"
        ? theme
        : rjvTheme;
  return createStyling(
    getDefaultThemeStyling,
    {
      defaultBase16: rjvTheme,
    },
    selected
  );
};
export default function style(
  theme: Theme | undefined,
  component: string,
  args?: CSSProperties
): StyleProps {
  if (!theme) {
    console.error("theme has not been set");
  }
  return getStyle(theme)(component, args);
}
