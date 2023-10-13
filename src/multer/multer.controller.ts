import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express/multer";
import { diskStorage } from "multer";

@Controller("uploads")
export class MulterController {
  @Post("upload")
  @UseInterceptors(
    FileInterceptor("file", {
      storage: diskStorage({
        destination: function (req, file, cb) {
          return cb(null, "./public/images");
        }, // Set your upload directory
        filename: function (req, file, cb) {
          return cb(
            null,
            ` ${file.fieldname}-${Date.now()}-${file.originalname}`,
          );
        },
      }),
      limits: {
        fileSize: 1024 * 1024, // 1MB (adjust as needed)
      },
      fileFilter: (req, file, cb) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          cb(null, true);
        } else {
          cb(
            new HttpException(
              "Invalid file type, Only .png, .jpg and .jpeg format allowed!",
              HttpStatus.BAD_REQUEST,
            ),
            false,
          );
        }
      },
    }),
  )
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    // Check if a file was uploaded
    if (!file) {
      throw new HttpException("No file uploaded", HttpStatus.BAD_REQUEST);
    }

    // Process the uploaded file here
    return "File uploaded successfully";
  }
}
