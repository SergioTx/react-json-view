import React from 'react';

import type { NodeProps } from '../types';
import ObjectComponent from './DataTypes/Object';
import ObjectName from './ObjectName';
import { PathPinButton } from './PathNavigation';
// icons
import { CollapsedIcon, ExpandedIcon } from './ToggleIcons';
import VariableMeta from './VariableMeta';

// single indent is 5px
export default function ArrayGroup(props: NodeProps): React.JSX.Element {
  const [expanded, setExpanded] = React.useState<boolean[]>([]);
  const groupId = React.useId();
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
  const size = groupArraysAfterLength;
  const groups = Math.ceil(src.length / size);
  const collapseEnabled = props.enableCollapse !== false;
  return (
    <div
      className="object-key-val"
      data-group-list=""
      data-root={jsvRoot || undefined}
    >
      <ObjectName
        {...props}
        afterName={
          props.enablePathNavigation && props.onNavigate && !jsvRoot ? (
            <PathPinButton
              path={props.navigationPath ?? []}
              onNavigate={props.onNavigate}
            />
          ) : null
        }
      />

      <span>
        <VariableMeta size={src.length} {...props} />
      </span>
      {Array.from({ length: groups }, (_, index) => {
        const start = index * size;
        const end = Math.min(start + size, src.length);
        const contentId = `${groupId}-${index}`;
        const open = !collapseEnabled || expanded[index] === true;
        return (
          <div key={index} className="object-key-val array-group">
            <div className="rjv-group-row">
              {collapseEnabled && (
                <button
                  type="button"
                  aria-label={`Items ${start}–${end - 1}`}
                  aria-expanded={open}
                  aria-controls={contentId}
                  className="icon-container"
                  onClick={() => {
                    toggleCollapsed(index);
                  }}
                >
                  {getExpandedIcon(index)}
                </button>
              )}
              <div id={contentId} hidden={!open} className="rjv-group-content">
                {open && (
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
                    navigationPath={props.navigationPath}
                    onNavigate={props.onNavigate}
                    type="array"
                    parent_type="array_group"
                    theme={theme}
                    isLast={index === groups - 1 && (jsvRoot || props.isLast)}
                    listOfAncestors={[...(props.listOfAncestors || []), src]}
                  />
                )}
              </div>
              {!open && (
                <span className="array-group-brace">
                  [
                  <span className="array-group-meta-data">
                    <span className="object-size">
                      {index * size}
                      {' - '}
                      {index * size + size - 1 > src.length
                        ? src.length - 1
                        : index * size + size - 1}
                    </span>
                  </span>
                  ]
                </span>
              )}
              {!open &&
                (index !== groups - 1 || (!jsvRoot && !props.isLast)) && (
                  <span className="rjv-comma">,</span>
                )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
