import { 
    Injectable,
    BadRequestException,
    NotFoundException 
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { toResponseObject } from 'src/common/utils/transform.util';

@Injectable()
export class VisitorMgtService {}
