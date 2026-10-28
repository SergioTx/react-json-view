import type { Namespace, NodeProps } from '../types';
import ArrayGroup from './ArrayGroup';
import JsonObject from './DataTypes/Object';
type JsonViewerProps = Omit<NodeProps, 'name'> & { name?: string | null };
export default function JsonViewer(props: JsonViewerProps) {
  let namespace: Namespace = [props.name ?? null];
  let ObjectComponent = JsonObject;
  namespace = namespace.concat(props.navigationPath ?? []);
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
