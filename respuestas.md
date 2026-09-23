1. **Orden:** ¿qué pasaría si `SanitizeInterceptor` se registrara **antes** que `TransformInterceptor`? ¿Seguiría limpiando los datos?
   Seguiría limpiando, pero solo porque sanitize() es recursivo.

2. **Timeout:** cuando se dispara el 408, ¿el `setTimeout` de 4.5 s del servicio se cancela de verdad, o solo dejamos de esperarlo? ¿Qué implicaría eso con una consulta real a una base de datos?
   No, solo dejamos de esperarlo. Con una base de datos real, eso implica el consumo seguido de CPU y una conexion pool, además si el cliente en caso de hacer una pago, recibiria 408, y si lo vuelve a intentar se crearía un duplicado.

3. **Logging:** ¿por qué con `tap(() => ...)` las peticiones que fallan no se loguean? ¿Qué alternativa ofrece `tap({ next, error })` o `finalize()`?
   tap(fn) solo reacciona a la notificación next. tap({ next, error }): tiene un callback para cada caso, así que puedes loguear el éxito con log y el fallo con error y su mensaje, finalize(() => ...): se ejecuta siempre (al completar, al fallar o al cancelarse). Es ideal para medir el tiempo, pero no sabe si hubo error.

4. **Sanitize vs. DTOs de salida:** ocultar datos con un interceptor es una red de seguridad. ¿Qué otra estrategia existe (pista: `class-transformer` con `@Exclude()` y `ClassSerializerInterceptor`)? ¿Cuál preferirían en producción y por qué?
   La otra estrategia es serializar con class-transformer: una clase de respuesta con @Exclude() en passwordHash y @Transform() para enmascarar la tarjeta, más ClassSerializerInterceptor, que llama a instanceToPlain(). En producción conviene usar DTOs de salida explícitos como mecanismo principal con @Expose() y excludeExtraneousValues: true

5. **Swagger:** la documentación dice que `GET /orders/1` devuelve un `Order`, pero en realidad el cliente recibe `{ statusCode, timestamp, path, data: Order }`. ¿Cómo lo documentarían bien?
   Se documenta con ApiExtraModels + getSchemaPath, dentro de un decorador reutilizable.
