import mongoose from 'mongoose';
import { Types } from 'mongoose';

export function toResponseObject(doc: any): any {
  if (Array.isArray(doc)) {
    return doc.map(toResponseObject);
  }

  if (doc && typeof doc === 'object') {
    // Handle Date
    if (doc instanceof Date) {
      return doc.toISOString();
    }

    // Handle Mongoose ObjectId
    if (Types.ObjectId.isValid(doc) && doc.constructor.name === 'ObjectId') {
      return doc.toString();
    }

    // Handle Buffer
    if (Buffer.isBuffer(doc)) {
      return doc.toString('utf-8'); // or 'base64' if binary
    }

    // Handle Map
    if (doc instanceof Map) {
      const obj: any = {};
      for (const [key, value] of doc.entries()) {
        obj[key] = toResponseObject(value);
      }
      return obj;
    }

    // Handle Mongoose Document
    const obj = doc._doc ? doc._doc : doc;
    const transformed: any = {};

    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        const value = obj[key];

        if (key === '_id') {
          transformed['id'] = value.toString();
        } else {
          transformed[key] = toResponseObject(value);
        }
      }
    }

    return transformed;
  }

  return doc;
}