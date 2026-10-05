import type { CacheNamespace, ViewerId } from '../types';
const objects = new Map<ViewerId, Map<string, Map<string, unknown>>>();
const pathKey = (name: CacheNamespace): string =>
  JSON.stringify(name) ?? 'undefined';
function get(
  rjvId: ViewerId,
  name: CacheNamespace,
  key: string,
  defaultValue: boolean
): boolean;
function get(
  rjvId: ViewerId,
  name: CacheNamespace,
  key: string,
  defaultValue?: unknown
): unknown;
function get(
  rjvId: ViewerId,
  name: CacheNamespace,
  key: string,
  defaultValue?: unknown
): unknown {
  const value = objects.get(rjvId)?.get(pathKey(name))?.get(key);
  if (typeof defaultValue === 'boolean') {
    return typeof value === 'boolean' ? value : defaultValue;
  }
  return value === undefined ? defaultValue : value;
}
export default {
  set(
    rjvId: ViewerId,
    name: CacheNamespace,
    key: string,
    value: unknown
  ): void {
    let attributes = objects.get(rjvId);
    if (!attributes) {
      attributes = new Map<string, Map<string, unknown>>();
      objects.set(rjvId, attributes);
    }
    const path = pathKey(name);
    let values = attributes.get(path);
    if (!values) {
      values = new Map<string, unknown>();
      attributes.set(path, values);
    }
    values.set(key, value);
  },
  get,
  clear(rjvId: ViewerId): void {
    objects.delete(rjvId);
  },
};
