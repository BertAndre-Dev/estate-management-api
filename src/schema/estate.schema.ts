import { Prop, Schema, SchemaFactory} from '@nestjs/mongoose';
import { Document } from 'mongoose';


export class EstateDetails {
    @Prop({
        required: true,
        trim: true,
        lowercase: true
    })
    name: string;

    @Prop()
    address: string;

    @Prop()
    city: string;

    @Prop()
    state: string;

    @Prop()
    country: string;
}

const EstateDetailsSchema = SchemaFactory.createForClass(EstateDetails);

export type EstateDocument = Estate & Document;

@Schema({
    timestamps: true
})

export class Estate {
    @Prop({
        type: [EstateDetailsSchema], 
        required: true,
        default: []
    })
    estate: EstateDetails[];

    @Prop({
        default: true
    })
    isActive: boolean;
    
}

export const EstateSchema = SchemaFactory.createForClass(Estate);


// 🔧 Middleware to enforce lowercase and trim on name field
EstateSchema.pre("save", function (next) {
  if (Array.isArray(this.estate)) {
    this.estate.forEach((detail: any) => {
      if (detail.name) {
        detail.name = detail.name.toLowerCase().trim();
      }
    });
  }
  next();
});
