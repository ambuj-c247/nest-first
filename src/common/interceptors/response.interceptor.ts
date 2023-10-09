// src/common/interceptors/response.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { ApiResponse } from "../api-response.common";

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  constructor(
    private readonly defaultStatusCode: number = 200,
    private readonly defaultMessage: string = "Success",
  ) {}

  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        return new ApiResponse<T>(
          this.defaultStatusCode,
          this.defaultMessage,
          data,
        );
      }),
    );
  }
}
