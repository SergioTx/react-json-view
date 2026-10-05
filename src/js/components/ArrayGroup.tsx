import React from 'react';

import type { NodeProps } from '../types';
import Theme from './../themes/getStyle';
import ObjectComponent from './DataTypes/Object';
import ObjectName from './ObjectName';
// icons
import { CollapsedIcon, ExpandedIcon } from './ToggleIcons';
import VariableMeta from './VariableMeta';

// single indent is 5px
const SINGLE_INDENT = 5;
export default function ArrayGroup(props: NodeProps): React.JSX.Element {
  const [expanded, setExpanded] = React.useState<boolean[]>([]);
  const toggleCollapsed = (index: number) => {
    const newExpanded: boolean[] = [];
    const maxLength = Math.max(expanded.length || 0, index + 1);
    for (let groupIndex = 0; groupIndex < maxLength; groupIndex++) {
      newExpanded[groupIndex] = expanded[groupIndex] === true;
    }
    newExpanded[index] = !newExpanded[index];
    setExpanded(newExpanded);
  };
  function getExpandedIcon(index: number) {
    const { theme, iconStyle } = props;
    if (expanded[index]) {
      return (
        <ExpandedIcon
          {...{
            theme,
            iconStyle,
          }}
        />
      );
    }
    return (
      <CollapsedIcon
        {...{
          theme,
          iconStyle,
        }}
      />
    );
  }
  const {
    src: source,
    groupArraysAfterLength = 100,
    name,
    theme,
    jsvRoot,
    namespace,
    ...rest
  } = props;
  const src: unknown[] = Array.isArray(source) ? source : [];
  let objectPaddingLeft = 0;
  const arrayGroupPaddingLeft = (props.indentWidth ?? 4) * SINGLE_INDENT;
  if (!jsvRoot) {
    objectPaddingLeft = (props.indentWidth ?? 4) * SINGLE_INDENT;
  }
  const size = groupArraysAfterLength;
  const groups = Math.ceil(src.length / size);
  return (
    <div
      className="object-key-val"
      {...Theme(theme, jsvRoot ? 'jsv-root' : 'objectKeyVal', {
        paddingLeft: objectPaddingLeft,
      })}
    >
      <ObjectName {...props} />

      <span>
        <VariableMeta size={src.length} {...props} />
      </span>
      {Array.from({ length: groups }, (_, index) => (
        <div
          key={index}
          className="object-key-val array-group"
          {...Theme(theme, 'objectKeyVal', {
            marginLeft: 6,
            paddingLeft: arrayGroupPaddingLeft,
          })}
        >
          <span {...Theme(theme, 'brace-row')}>
            <button
              type="button"
              className="icon-container"
              {...Theme(theme, 'icon-container')}
              style={{
                border: 0,
                padding: 0,
                background: 'none',
                color: 'inherit',
                ...Theme(theme, 'icon-container').style,
              }}
              onClick={() => {
                toggleCollapsed(index);
              }}
            >
              {getExpandedIcon(index)}
            </button>
            {expanded[index] ? (
              <ObjectComponent
                {...rest}
                key={String(name) + index}
                depth={0}
                name={false}
                collapsed={false}
                groupArraysAfterLength={size}
                index_offset={index * size}
                src={src.slice(index * size, index * size + size)}
                namespace={namespace}
                type="array"
                parent_type="array_group"
                theme={theme}
                isLast={index === groups - 1 && (jsvRoot || props.isLast)}
                listOfAncestors={[...(props.listOfAncestors || []), src]}
              />
            ) : (
              <button
                type="button"
                {...Theme(theme, 'brace')}
                onClick={() => {
                  toggleCollapsed(index);
                }}
                className="array-group-brace"
              >
                [
                <span
                  {...Theme(theme, 'array-group-meta-data')}
                  className="array-group-meta-data"
                >
                  <span
                    className="object-size"
                    {...Theme(theme, 'object-size')}
                  >
                    {index * size}
                    {' - '}
                    {index * size + size - 1 > src.length
                      ? src.length - 1
                      : index * size + size - 1}
                  </span>
                </span>
                ]
              </button>
            )}
            {!expanded[index] &&
              (index !== groups - 1 || (!jsvRoot && !props.isLast)) && (
                <span {...Theme(theme, 'comma')}>,</span>
              )}
          </span>
        </div>
      ))}
    </div>
  );
}
