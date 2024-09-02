export class RespBase<T = void> {
  message: string;
  data: T;

  constructor(message: string, data?: T) {
    this.message = message;
    this.data = data ?? null;
  }
}

export function resolveSvcFn<T>(svcFn: Promise<T>, message: string) {
  return svcFn
    .then((data: T) => {
      if (data instanceof Error) {
        throw data;
      }

      return new RespBase(message, data);
    })
    .catch((error: Error) => {
      throw error;
    });
}
