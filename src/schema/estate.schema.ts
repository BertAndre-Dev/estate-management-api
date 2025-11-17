import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type EstateDocument = Estate & Document;

@Schema({
  timestamps: true,
})
export class Estate {
  @Prop({
    required: true,
    trim: true,
    lowercase: true,
  })
  name: string;

  @Prop({ trim: true })
  address: string;

  @Prop({ trim: true })
  city: string;

  @Prop({ trim: true })
  state: string;

  @Prop({ trim: true })
  country: string;

  @Prop({ default: true })
  isActive: boolean;
}

export const EstateSchema = SchemaFactory.createForClass(Estate);

// 🔧 Middleware: ensure name and other text fields are trimmed/lowercased
EstateSchema.pre('save', function (next) {
  if (this.name) this.name = this.name.toLowerCase().trim();
  if (this.address) this.address = this.address.trim();
  if (this.city) this.city = this.city.trim();
  if (this.state) this.state = this.state.trim();
  if (this.country) this.country = this.country.trim();
  next();
});
