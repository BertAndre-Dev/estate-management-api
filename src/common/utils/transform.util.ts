export function toResponseObject(doc: any): any {
  if (Array.isArray(doc)) {
    return doc.map(toResponseObject);
  }

  if (doc && typeof doc === 'object') {
    // Handle Date objects properly
    if (doc instanceof Date) {
      return doc.toISOString();
    }

    // Convert Mongoose Map to plain object
    if (doc instanceof Map) {
      const obj: any = {};
      for (const [key, value] of doc.entries()) {
        obj[key] = toResponseObject(value);
      }
      return obj;
    }

    const obj = doc._doc ? doc._doc : doc;
    const transformed: any = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        if (key === '_id') {
          transformed['id'] = value.toString();
        } else if (key === 'data') {
          // Map 'data' (the entry data) to 'data' in the response, as a plain object
          transformed['data'] = toResponseObject(value);
        } else {
          transformed[key] = toResponseObject(value);
        }
      }
    }

    return transformed;
  }

  return doc;
}