var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
let CloudinaryService = class CloudinaryService {
    constructor() {
        this.configureCloudinary();
    }
    configureCloudinary() {
        const config = {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        };
        cloudinary.config(config);
    }
    async uploadImage(base64Image, publicId) {
        try {
            const result = await cloudinary.uploader.upload(base64Image, {
                public_id: publicId,
                resource_type: 'image',
            });
            if (!result.secure_url) {
                throw new Error('Image upload successful, but no secure URL was returned.');
            }
            return result;
        }
        catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`);
        }
    }
    async uploadFile(base64File, publicId) {
        try {
            const result = await cloudinary.uploader.upload(base64File, {
                public_id: publicId,
                resource_type: 'auto',
            });
            if (!result.secure_url) {
                throw new Error('File upload successful, but no secure URL was returned.');
            }
            return result;
        }
        catch (error) {
            console.error('Cloudinary file upload error:', error);
            throw new Error(`Cloudinary file upload failed: ${error.message || 'Unknown error'}`);
        }
    }
    getOptimizedUrl(publicId) {
        return cloudinary.url(publicId, {
            fetch_format: 'auto',
            quality: 'auto',
        });
    }
    getTransformedUrl(publicId) {
        return cloudinary.url(publicId, {
            crop: 'fill',
            gravity: 'face',
            width: 500,
            height: 500,
        });
    }
};
CloudinaryService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [])
], CloudinaryService);
export { CloudinaryService };
//# sourceMappingURL=cloudinary.service.js.map