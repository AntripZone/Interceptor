import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import type { Request } from 'express';
import { Observable, tap } from 'rxjs';

// =============================================================================
// LoggingInterceptor  —  👤 Estudiante 2
// -----------------------------------------------------------------------------
// Objetivo: registrar en consola cada petición y cuánto tardó.
//
//   [Nest] 12345  - LOG [HTTP] GET /orders 3ms
//   [Nest] 12345  - LOG [HTTP] POST /orders 5ms
//   [Nest] 12345  - ERROR [HTTP] GET /orders/reports/heavy-process 3004ms - Request Timeout
//
// Operador RxJS: tap()  → ejecuta un efecto secundario (loguear) SIN
//                         modificar la respuesta.
// =============================================================================

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger('HTTP');

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    //obtiene la petición http actual
    const request = context.switchToHttp().getRequest<Request>();

    //obtiene el método HTTP: GET, POST, etc
    const method = request.method;

    //obtiene la url solicitada: /orders, /orders/1, etc
    const url = request.originalUrl;

    //guarda el momento en que comienza la petición
    const start = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          //calcula cuantos milisegundos tardó la petición
          const ms = Date.now() - start;

          //registra la petición exitosa
          this.logger.log(`${method} ${url} ${ms}ms`);
        },

        error: (err) => {
          //calcula cuántos milisegundos tardó la petición
          const ms = Date.now() - start;

          //registra el error ocurrido durante la petición
          this.logger.error(`${method} ${url} ${ms}ms - ${err.message}`);
        },
      }),
    );
  }
}
