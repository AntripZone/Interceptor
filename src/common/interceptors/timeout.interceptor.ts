import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  Observable,
  TimeoutError,
  catchError,
  throwError,
  timeout,
} from 'rxjs';


@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  
  constructor(private readonly timeoutMs = 3000) {}

   intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      timeout(this.timeoutMs),
      catchError((err: unknown) => {
        if (err instanceof TimeoutError) {
          return throwError(
            () =>
              new RequestTimeoutException(
                `La petición excedió el tiempo límite de ${this.timeoutMs} ms`,
              ),
          );
        }
        return throwError(() => err);
      }),
    );
  }  }
