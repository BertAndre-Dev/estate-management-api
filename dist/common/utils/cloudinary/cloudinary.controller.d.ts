import { CloudinaryService } from './cloudinary.service';
export declare class CloudinaryController {
    private readonly cloudinaryService;
    constructor(cloudinaryService: CloudinaryService);
    uploadImage(base64File: string): Promise<{
        message: string;
        uploadResult: import("cloudinary").UploadApiResponse;
        optimizedUrl: string;
        transformedUrl: string;
    }>;
}
