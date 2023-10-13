import { createParamDecorator, ExecutionContext } from "@nestjs/common";

// If we want a specific data from response we can pass that key in data and it will only return that value
export const GetUser = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();
    if (data) {
      return request.user[data];
    }
    return request.user;
  },
);
