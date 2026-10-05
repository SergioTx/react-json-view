import type { CSSProperties, HTMLAttributes, ReactElement } from 'react';
import type { ReactJsonViewProps, ThemeKeys, ThemeObject } from '../../index';
export type Theme = ThemeKeys | ThemeObject | 'none' | false;
export type NodeName = string | number | false | null | ReactElement;
export type Namespace = (string | number | false | null)[];
export type CacheNamespace = Namespace | string | undefined;
export type ViewerId = string | number | undefined;
type Options = Omit<ReactJsonViewProps, 'src' | 'name' | 'theme'>;
export type DisplayProps = {
  [Key in keyof Options]?: Options[Key] | undefined;
} & {
  theme?: Theme | undefined;
  rjvId?: ViewerId;
};
export interface NodeProps extends DisplayProps {
  src: object;
  name?: NodeName | undefined;
  namespace?: CacheNamespace;
  depth?: number | undefined;
  type?: 'array' | 'object' | undefined;
  parent_type?: 'array' | 'object' | 'array_group' | undefined;
  jsvRoot?: boolean | undefined;
  isLast?: boolean | undefined;
  listOfAncestors?: object[] | undefined;
  index_offset?: number | undefined;
}
export interface ValueProps extends DisplayProps {
  value?: unknown;
  namespace?: CacheNamespace;
}
export interface VariableProps extends DisplayProps {
  variable: {
    name: string | number;
    value: unknown;
    type: string;
  };
  namespace?: CacheNamespace;
  singleIndent?: number | undefined;
  type?: 'array' | 'object' | undefined;
  isLast?: boolean | undefined;
}
export interface MetadataProps extends DisplayProps {
  src: unknown;
  size: number;
  namespace?: CacheNamespace;
  rowHovered?: boolean | undefined;
}
export interface ClipboardProps extends DisplayProps {
  src: unknown;
  namespace?: CacheNamespace;
  rowHovered?: boolean | undefined;
  clickCallback?: ReactJsonViewProps['enableClipboard'] | undefined;
}
export interface CircularProps extends DisplayProps {
  name?: NodeName | undefined;
  namespace?: CacheNamespace;
  indentWidth?: number | undefined;
  singleIndent?: number | undefined;
  isLast?: boolean | undefined;
  jsvRoot?: boolean | undefined;
}
export type IconProps = HTMLAttributes<HTMLSpanElement>;
export interface NameProps extends DisplayProps {
  name?: NodeName | undefined;
  namespace?: CacheNamespace;
  parent_type?: NodeProps['parent_type'];
  jsvRoot?: boolean | undefined;
}
export interface LabelProps extends DisplayProps {
  typeName: string;
}
export type StyleProps = {
  className?: string | undefined;
  style?: CSSProperties | undefined;
};
export function normalizeNamespace(namespace: CacheNamespace): Namespace {
  return typeof namespace === 'string' ? [namespace] : (namespace ?? []);
}
