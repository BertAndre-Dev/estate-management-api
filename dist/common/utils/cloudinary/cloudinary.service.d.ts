import { UploadApiResponse } from 'cloudinary';
export declare class CloudinaryService {
    constructor();
    private configureCloudinary;
    uploadImage(base64Image: string, publicId?: string): Promise<UploadApiResponse>;
    uploadFile(base64File: string, publicId?: string): Promise<UploadApiResponse>;
    getOptimizedUrl(publicId: string): string;
    getTransformedUrl(publicId: string): string;
}
