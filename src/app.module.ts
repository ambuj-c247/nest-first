import { Module } from "@nestjs/common";
import { AuthModule } from "./auth/auth.module";
import { UserModule } from "./user/user.module";
import { AdminModule } from "./admin/admin.module";
// import { BookmarkModule } from "./bookmark/bookmark.module";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "./user/schema/user.schema";
import { MulterModule } from "./multer/multer.module";
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    MongooseModule.forFeature([{ name: "User", schema: UserSchema }]),
    AuthModule,
    UserModule,
    AdminModule,
    MulterModule,
  ],
})
export class AppModule {}
