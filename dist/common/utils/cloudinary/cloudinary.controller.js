var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
let CloudinaryController = class CloudinaryController {
    cloudinaryService;
    constructor(cloudinaryService) {
        this.cloudinaryService = cloudinaryService;
    }
    async uploadImage(base64File) {
        if (!base64File || !base64File.startsWith('data:image/')) {
            throw new BadRequestException('Invalid image format. Please provide a base64-encoded image.');
        }
        try {
            const publicId = `user_profile/${Date.now()}`;
            const result = await this.cloudinaryService.uploadFile(base64File, publicId);
            const optimizedUrl = this.cloudinaryService.getOptimizedUrl(result.public_id);
            const transformedUrl = this.cloudinaryService.getTransformedUrl(result.public_id);
            return {
                message: 'Image upload successful.',
                uploadResult: result,
                optimizedUrl,
                transformedUrl,
            };
        }
        catch (error) {
            console.error('Error uploading image:', error);
            throw new BadRequestException('Failed to upload image to Cloudinary.');
        }
    }
};
__decorate([
    Post('upload'),
    __param(0, Body('base64File')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CloudinaryController.prototype, "uploadImage", null);
CloudinaryController = __decorate([
    Controller('api/v1/cloudinary'),
    __metadata("design:paramtypes", [CloudinaryService])
], CloudinaryController);
export { CloudinaryController };
//# sourceMappingURL=cloudinary.controller.js.map