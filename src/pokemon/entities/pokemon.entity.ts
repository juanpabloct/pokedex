import { SchemaFactory, Schema, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';
@Schema()
export class Pokemon extends Document {
  @Prop({
    index: true,
    unique: true,
  })
  name: string;

  @Prop({
    unique: true,
    index: true,
  })
  number: number;
}
export const pokemonShema = SchemaFactory.createForClass(Pokemon);
