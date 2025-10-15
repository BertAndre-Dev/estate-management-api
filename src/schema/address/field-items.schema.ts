import { Prop, Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class FieldItem {
  @Prop({ required: true })
  label: string;

  @Prop({ required: true })
  key: string;

  @Prop({ required: true })
  type: string;
}
