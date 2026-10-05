const objects = new Map()

export default {
  set (rjvId, name, key, value) {
    if (!objects.has(rjvId)) objects.set(rjvId, new Map())
    const attributes = objects.get(rjvId)
    const path = JSON.stringify(name)
    if (!attributes.has(path)) attributes.set(path, new Map())
    attributes.get(path).set(key, value)
  },
  get (rjvId, name, key, defaultValue) {
    const value = objects.get(rjvId)?.get(JSON.stringify(name))?.get(key)
    return value === undefined ? defaultValue : value
  },
  clear (rjvId) {
    objects.delete(rjvId)
  }
}
