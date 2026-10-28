import React from 'react';

import type { NodeProps } from '../../types';
import { normalizeNamespace } from '../../types';
import { getFlashClass, toType } from './../../helpers/util';
import AttributeStore from './../../stores/ObjectAttributes';
import Theme from './../../themes/getStyle';
import constants from './../../themes/styleConstants';
import ArrayGroup from './../ArrayGroup';
import ObjectName from './../ObjectName';
import { PathPinButton } from './../PathNavigation';
import { CollapsedIcon, ExpandedIcon } from './../ToggleIcons';
import VariableEditor from './../VariableEditor';
import VariableMeta from './../VariableMeta';
import { JsonCircularReference } from './DataTypes';
const SINGLE_INDENT = 5;
const ROOT_ICON_CENTER = Number.parseFloat(constants.iconContainerWidth) / 2;
const ROOT_ICON_GUTTER =
  Number.parseFloat(constants.iconContainerWidth) -
  Number.parseFloat(constants.pushedContentMarginLeft);
const GUIDE_BORDER_WIDTH = Number.parseFloat(constants.keyValBorderLeft);
function getExpanded(props: NodeProps) {
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
  const [state, setState] = React.useState(() => ({
    expanded: getExpanded(props),
    prevProps: props,
  }));
  const [hovered, setHovered] = React.useState(false);
  const [keyState, setKeyState] = React.useState(() => ({
    src,
    added: [] as string[],
  }));
  if (keyState.src !== src) {
    const previousKeys = Object.keys(keyState.src);
    setKeyState({
      src,
      added: props.flashingUpdates
        ? Object.keys(src).filter((key) => !previousKeys.includes(key))
        : [],
    });
  }
  const [flashClass] = React.useState(() =>
    getFlashClass(props.flashingUpdates, flashOnMount ? 1 : 0)
  );
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
  const objectType: 'array' | 'object' = type === 'array' ? 'array' : 'object';
  const size = Object.keys(src).length;
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
        flashOnMount: keyState.added.includes(key),
      };
      if (valueType === 'window') {
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
          singleIndent={SINGLE_INDENT}
          namespace={namespace}
          type={type}
        />
      );
    });
  }
  const styles: React.CSSProperties = {};
  if (!jsvRoot && parentType !== 'array_group') {
    styles.paddingLeft = (props.indentWidth ?? 4) * SINGLE_INDENT;
  } else if (parentType === 'array_group') {
    styles.borderLeft = 0;
    styles.display = 'inline';
  }
  const IconComponent = expanded ? ExpandedIcon : CollapsedIcon;
  const nodeLabel = String(name ?? 'object');
  const showNodeName =
    !(jsvRoot && (name === false || name === null)) &&
    (parentType !== 'array' || props.displayArrayKey !== false);
  const pathPin =
    props.enablePathNavigation && props.onNavigate && !jsvRoot ? (
      <PathPinButton
        path={props.navigationPath ?? []}
        visible={hovered}
        onNavigate={props.onNavigate}
      />
    ) : null;
  const isArrayGroupRoot = parentType === 'array_group';
  const rowIndent = jsvRoot
    ? ROOT_ICON_GUTTER
    : (props.indentWidth ?? 4) * SINGLE_INDENT;
  const rowBorderWidth = jsvRoot || isArrayGroupRoot ? 0 : GUIDE_BORDER_WIDTH;
  const iconGuideCenter = jsvRoot
    ? ROOT_ICON_CENTER
    : rowBorderWidth + rowIndent - ROOT_ICON_CENTER;
  const iconGuideStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${iconGuideCenter - rowBorderWidth - GUIDE_BORDER_WIDTH / 2}px`,
    top: jsvRoot ? 0 : constants.keyValPaddingTop,
    bottom: jsvRoot ? 0 : constants.keyValPaddingBottom,
    borderLeft: Theme(theme, 'objectKeyVal').style?.borderLeft,
    pointerEvents: 'none',
    zIndex: 0,
  };
  const nestedIconStyle: React.CSSProperties = jsvRoot
    ? { marginLeft: -ROOT_ICON_GUTTER }
    : {
        position: 'absolute',
        left: `-${constants.iconContainerWidth}`,
        top: 0,
      };
  const rowTheme = Theme(theme, jsvRoot ? 'jsv-root' : 'objectKeyVal', styles);
  const rowStyle: React.CSSProperties = {
    ...rowTheme.style,
    ...(jsvRoot ? { paddingLeft: ROOT_ICON_GUTTER } : {}),
    ...(parentType !== 'array_group' ? { position: 'relative' } : {}),
  };
  const pushedContentTheme = Theme(theme, 'pushed-content');
  const pushedContentMarginLeft = isArrayGroupRoot
    ? Number.parseFloat(constants.pushedContentMarginLeft)
    : iconGuideCenter - rowBorderWidth - rowIndent - GUIDE_BORDER_WIDTH / 2;
  const pushedContentStyle = {
    ...pushedContentTheme.style,
    marginLeft: pushedContentMarginLeft,
  };
  return (
    <div
      className={['object-key-val', flashClass].filter(Boolean).join(' ')}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      {...rowTheme}
      style={rowStyle}
    >
      {expanded && !isArrayGroupRoot && size > 0 && (
        <span
          aria-hidden="true"
          className="object-guide"
          style={iconGuideStyle}
        />
      )}
      {parentType === 'array_group' ? (
        <span>
          <span {...Theme(theme, 'brace')}>
            {objectType === 'array' ? '[' : '{'}
          </span>
        </span>
      ) : (
        <span
          className="object-name-row"
          style={{ display: 'inline-block', position: 'relative' }}
        >
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={`${expanded ? 'Collapse' : 'Expand'} ${nodeLabel}`}
            {...Theme(theme, 'brace-row')}
            style={{
              border: 0,
              padding: 0,
              background: 'none',
              font: 'inherit',
              color: 'inherit',
              ...Theme(theme, 'brace-row').style,
              ...nestedIconStyle,
              position: jsvRoot ? 'relative' : 'absolute',
              zIndex: 1,
            }}
          >
            <span
              className="icon-container"
              {...Theme(theme, 'icon-container')}
            >
              <IconComponent
                {...{
                  theme,
                  iconStyle,
                }}
              />
            </span>
          </button>
          {showNodeName && (
            <button
              type="button"
              onClick={toggleCollapsed}
              aria-label={`${expanded ? 'Collapse' : 'Expand'} ${nodeLabel}`}
              {...Theme(theme, 'brace-row')}
              style={{
                border: 0,
                padding: 0,
                background: 'none',
                font: 'inherit',
                color: 'inherit',
                ...Theme(theme, 'brace-row').style,
              }}
            >
              <ObjectName {...props} displayColon={false} />
            </button>
          )}
          {pathPin}
          {showNodeName && <span {...Theme(theme, 'colon')}>:</span>}
          <button
            type="button"
            onClick={toggleCollapsed}
            aria-label={`${expanded ? 'Collapse' : 'Expand'} ${nodeLabel}`}
            {...Theme(theme, 'brace-row')}
            style={{
              border: 0,
              padding: 0,
              background: 'none',
              font: 'inherit',
              color: 'inherit',
              ...Theme(theme, 'brace-row').style,
            }}
          >
            <span {...Theme(theme, 'brace')}>
              {objectType === 'array' ? '[' : '{'}
            </span>
          </button>
        </span>
      )}
      {expanded ? (
        <div className="pushed-content object-container">
          <div
            className="object-content"
            {...pushedContentTheme}
            style={pushedContentStyle}
          >
            {renderContents()}
          </div>
        </div>
      ) : (
        size !== 0 && (
          <button
            type="button"
            {...Theme(theme, 'ellipsis')}
            className="node-ellipsis"
            onClick={toggleCollapsed}
            style={{
              border: 0,
              padding: 0,
              background: 'none',
              ...Theme(theme, 'ellipsis').style,
            }}
          >
            ...
          </button>
        )
      )}
      <span className="brace-row">
        <span
          style={{
            ...Theme(theme, 'brace').style,
            paddingLeft: expanded ? '3px' : '0px',
          }}
        >
          {objectType === 'array' ? ']' : '}'}
        </span>
      </span>
      {!isLast && !jsvRoot && <span {...Theme(theme, 'comma')}>,</span>}
      <VariableMeta rowHovered={hovered} size={size} {...props} />
    </div>
  );
}
