import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { abortOnError: false });
  app.useGlobalPipes(
    new ValidationPipe({
      // If we want to remove unwanted values other than which are present in dto from payload,
      whitelist: true,
      // if you need to disable error msg
      // disableErrorMessages: true,
    }),
  );
  await app.listen(3333);
}
bootstrap();
