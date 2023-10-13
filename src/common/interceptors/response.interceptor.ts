// src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponseWithData } from "../api-response.common";

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponseWithData<T>>
{
  constructor(
    private readonly defaultStatusCode: number = 200,
    private readonly defaultMessage: string = "Success",
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponseWithData<T>> {
    return next.handle().pipe(
      map((data) => {
        return new ApiResponseWithData<T>(
          this.defaultStatusCode,
          this.defaultMessage,
          data,
        );
      }),
    );
  }
}
