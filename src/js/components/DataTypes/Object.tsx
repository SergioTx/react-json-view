import React from 'react';

import type { NodeProps } from '../../types';
import { normalizeNamespace } from '../../types';
import { getFlashClass, toType } from './../../helpers/util';
import AttributeStore from './../../stores/ObjectAttributes';
import ArrayGroup from './../ArrayGroup';
import ObjectName from './../ObjectName';
import { PathPinButton } from './../PathNavigation';
import { CollapsedIcon, ExpandedIcon } from './../ToggleIcons';
import VariableEditor from './../VariableEditor';
import VariableMeta from './../VariableMeta';
import { JsonCircularReference } from './DataTypes';
function getExpanded(props: NodeProps) {
  if (props.enableCollapse === false) {
    return false;
  }
  const expanded =
    (props.collapsed === false ||
      (typeof props.collapsed === 'number' &&
        props.collapsed > (props.depth ?? 0))) &&
    (!props.shouldCollapse ||
      props.shouldCollapse({
        name: props.name,
        src: props.src,
        type: Array.isArray(props.src) ? 'array' : 'object',
        namespace: normalizeNamespace(props.namespace),
      }) === false) &&
    Object.keys(props.src).length !== 0;
  return AttributeStore.get(props.rjvId, props.namespace, 'expanded', expanded);
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
    flashOnMount,
    ...rest
  } = props;
  const namespace = normalizeNamespace(namespaceProp);
  const contentId = React.useId();
  const [state, setState] = React.useState(() => ({
    expanded: getExpanded(props),
    prevProps: props,
  }));
  const [keyState, setKeyState] = React.useState(() => ({
    src,
    added: new Set<string>(),
  }));
  if (keyState.src !== src) {
    setKeyState({
      src,
      added: new Set(
        props.flashingUpdates
          ? Object.keys(src).filter((key) => !Object.hasOwn(keyState.src, key))
          : []
      ),
    });
  }
  const [flashClass] = React.useState(() =>
    getFlashClass(props.flashingUpdates, flashOnMount ? 1 : 0)
  );
  const previous = state.prevProps;
  if (
    src !== previous.src ||
    props.collapsed !== previous.collapsed ||
    props.enableCollapse !== previous.enableCollapse ||
    name !== previous.name ||
    props.namespace !== previous.namespace ||
    props.rjvId !== previous.rjvId
  ) {
    setState({
      expanded: getExpanded(props),
      prevProps: props,
    });
  }
  const collapseEnabled = props.enableCollapse !== false;
  const objectType: 'array' | 'object' = type === 'array' ? 'array' : 'object';
  const size = Object.keys(src).length;
  const isGroup = parentType === 'array_group';
  const expanded = size > 0 && (!collapseEnabled || isGroup || state.expanded);
  const canCollapse = collapseEnabled && size > 0 && !isGroup;
  const ancestors = [...(props.listOfAncestors || []), src];
  function toggleCollapsed() {
    const nextExpanded = !expanded;
    AttributeStore.set(props.rjvId, namespace, 'expanded', nextExpanded);
    setState({
      expanded: nextExpanded,
      prevProps: props,
    });
  }
  function renderContents() {
    let keys = Object.keys(src);
    if (props.sortKeys && objectType !== 'array') {
      keys = keys.sort();
    }
    return keys.map((key, index) => {
      const value: unknown = Reflect.get(src, key);
      const valueType = toType(value);
      const variableName =
        parentType === 'array_group' && props.index_offset
          ? parseInt(key, 10) + props.index_offset
          : key;
      const navigationSegment =
        objectType === 'array' ? Number(variableName) : variableName;
      const childProps = {
        theme,
        iconStyle,
        ...rest,
        depth: depth + 1,
        name: variableName,
        src: value,
        namespace: namespace.concat(variableName),
        navigationPath: (props.navigationPath ?? []).concat(navigationSegment),
        parent_type: objectType,
        isLast: index === keys.length - 1,
        flashOnMount: keyState.added.has(key),
      };
      if (valueType === 'window') {
        return null;
      }
      if (ancestors.some((ancestor) => ancestor === value)) {
        return <JsonCircularReference key={variableName} {...childProps} />;
      }
      if (
        typeof value === 'object' &&
        value !== null &&
        (valueType === 'object' || valueType === 'array')
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
            type={Array.isArray(value) ? 'array' : 'object'}
            listOfAncestors={ancestors}
          />
        );
      }
      return (
        <VariableEditor
          key={variableName + '_' + namespace}
          {...childProps}
          variable={{
            name: variableName,
            value,
            type: valueType,
          }}
          namespace={namespace}
          type={type}
        />
      );
    });
  }
  const IconComponent = expanded ? ExpandedIcon : CollapsedIcon;
  const nodeLabel = String(name ?? 'object');
  const disclosureProps = canCollapse
    ? {
        type: 'button' as const,
        onClick: toggleCollapsed,
        'aria-label': `${expanded ? 'Collapse' : 'Expand'} ${nodeLabel}`,
        'aria-expanded': expanded,
        'aria-controls': contentId,
      }
    : undefined;
  const showNodeName =
    !(jsvRoot && (name === false || name === null)) &&
    (parentType !== 'array' || props.displayArrayKey !== false);
  const pathPin =
    props.enablePathNavigation && props.onNavigate && !jsvRoot ? (
      <PathPinButton
        path={props.navigationPath ?? []}
        onNavigate={props.onNavigate}
      />
    ) : null;
  const isArrayGroupRoot = parentType === 'array_group';
  return (
    <div
      className={flashClass ? `object-key-val ${flashClass}` : 'object-key-val'}
      data-root={jsvRoot || undefined}
      data-group-content={isArrayGroupRoot || undefined}
      data-expanded={expanded || undefined}
    >
      {expanded &&
        !isArrayGroupRoot &&
        size > 0 &&
        !props.hideVerticalLines && (
          <span aria-hidden="true" className="object-guide" />
        )}
      {parentType === 'array_group' ? (
        <span>
          <span className="rjv-brace">
            {objectType === 'array' ? '[' : '{'}
          </span>
        </span>
      ) : (
        <span className="object-name-row">
          {canCollapse && (
            <button {...disclosureProps} className="rjv-disclosure">
              <span className="icon-container">
                <IconComponent theme={theme} iconStyle={iconStyle} />
              </span>
            </button>
          )}
          {showNodeName && <ObjectName {...props} displayColon={false} />}
          {pathPin}
          {showNodeName && <span className="rjv-colon">:</span>}
          <span className="rjv-brace">
            {objectType === 'array' ? '[' : '{'}
          </span>
        </span>
      )}
      <div
        id={contentId}
        hidden={!expanded}
        className={expanded ? 'pushed-content object-container' : undefined}
      >
        <div className="object-content">{expanded && renderContents()}</div>
      </div>
      {!expanded && size !== 0 && <span className="node-ellipsis">...</span>}
      <span className="brace-row">
        <span className="rjv-brace">{objectType === 'array' ? ']' : '}'}</span>
      </span>
      {!isLast && !jsvRoot && <span className="rjv-comma">,</span>}
      <VariableMeta size={size} {...props} />
    </div>
  );
}
