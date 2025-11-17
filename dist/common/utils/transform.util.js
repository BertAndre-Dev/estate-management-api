"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toResponseObject = toResponseObject;
const mongoose_1 = require("mongoose");
function toResponseObject(doc) {
    if (Array.isArray(doc)) {
        return doc.map(toResponseObject);
    }
    if (doc && typeof doc === 'object') {
        if (doc instanceof Date) {
            return doc.toISOString();
        }
        if (mongoose_1.Types.ObjectId.isValid(doc) && doc.constructor.name === 'ObjectId') {
            return doc.toString();
        }
        if (Buffer.isBuffer(doc)) {
            return doc.toString('utf-8');
        }
        if (doc instanceof Map) {
            const obj = {};
            for (const [key, value] of doc.entries()) {
                obj[key] = toResponseObject(value);
            }
            return obj;
        }
        const obj = doc._doc ? doc._doc : doc;
        const transformed = {};
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                const value = obj[key];
                if (key === '_id') {
                    transformed['id'] = value.toString();
                }
                else {
                    transformed[key] = toResponseObject(value);
                }
            }
        }
        return transformed;
    }
    return doc;
}
//# sourceMappingURL=transform.util.js.map