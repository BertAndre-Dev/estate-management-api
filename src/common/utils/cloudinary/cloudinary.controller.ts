import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';

@Controller('api/v1/cloudinary')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) {}


    @Post('upload')
    async uploadImage(@Body('base64File') base64File: string) {
        if (!base64File || !base64File.startsWith('data:image/')) {
            throw new BadRequestException('Invalid image format. Please provide a base64-encoded image.');
        }

        try {
            const publicId = `user_profile/${Date.now()}`;
            const result = await this.cloudinaryService.uploadFile(base64File, publicId);

            const optimizedUrl = this.cloudinaryService.getOptimizedUrl(result.public_id)

            const transformedUrl = this.cloudinaryService.getTransformedUrl(result.public_id);

            return {
                message: 'Image upload successful.',
                uploadResult: result,
                optimizedUrl,
                transformedUrl,
            };
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new BadRequestException('Failed to upload image to Cloudinary.');
        }
    }
}
