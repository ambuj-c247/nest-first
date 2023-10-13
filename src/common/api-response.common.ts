export class ApiResponseWithData<T> {
  constructor(
    public statusCode: number,
    public message: string,
    public data: T,
  ) {}
}

export class ApiResponseWithoutData {
  constructor(
    public statusCode: number,
    public message: string,
  ) {}
}
