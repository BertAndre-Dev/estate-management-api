import { Injectable } from '@nestjs/common';
import { v2 as cloudinary, ConfigOptions, UploadApiResponse } from 'cloudinary';

@Injectable()
export class CloudinaryService {
    constructor() {
        this.configureCloudinary();
    }

    private configureCloudinary() {
        const config: ConfigOptions = {
            cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
            api_key: process.env.CLOUDINARY_API_KEY,
            api_secret: process.env.CLOUDINARY_API_SECRET,
        };
        cloudinary.config(config);
    }

    // Function to upload images
    async uploadImage(base64Image: string, publicId?: string): Promise<UploadApiResponse> {
        try {
            const result = await cloudinary.uploader.upload(base64Image, {
                public_id: publicId,
                resource_type: 'image',
            });
    
            if (!result.secure_url) {
                throw new Error('Image upload successful, but no secure URL was returned.');
            }
    
            return result;
        } catch (error) {
            console.error('Cloudinary upload error:', error);
            throw new Error(`Cloudinary upload failed: ${error.message || 'Unknown error'}`);
        }
    }

    // Function to upload generic files (PDF, Excel, Documents)
    async uploadFile(base64File: string, publicId?: string): Promise<UploadApiResponse> {
        try {
            const result = await cloudinary.uploader.upload(base64File, {
                public_id: publicId,
                resource_type: 'auto',  // Automatically detects file type
            });
    
            if (!result.secure_url) {
                throw new Error('File upload successful, but no secure URL was returned.');
            }
    
            return result;
        } catch (error) {
            console.error('Cloudinary file upload error:', error);
            throw new Error(`Cloudinary file upload failed: ${error.message || 'Unknown error'}`);
        }
    }

    getOptimizedUrl(publicId: string): string {
        return cloudinary.url(publicId, {
            fetch_format: 'auto',
            quality: 'auto',
        });
    }

    getTransformedUrl(publicId: string): string {
        return cloudinary.url(publicId, {
            crop: 'fill',
            gravity: 'face',
            width: 500,
            height: 500,
        });
    }
}
