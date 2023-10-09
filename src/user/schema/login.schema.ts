import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

@Schema({
  timestamps: true,
})
export class Login {
  @Prop({ required: true })
  userId: mongoose.Schema.Types.ObjectId;

  @Prop({ default: Date.now })
  loginDate: Date;

  @Prop({ default: 0 })
  loginCount: number;
}

export const LoginSchema = SchemaFactory.createForClass(Login);
