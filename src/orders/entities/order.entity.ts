// =============================================================================
// Entidad Order (en memoria)
// -----------------------------------------------------------------------------
// Se usan CLASES (no interfaces) a propósito: Swagger solo puede leer los
// decoradores @ApiProperty() de una clase; las interfaces desaparecen al
// compilar a JavaScript.
//
// ⚠️ Esta entidad contiene campos SENSIBLES (passwordHash, creditCard,
// clientSecret). El servicio los devuelve "tal cual" a propósito: es trabajo
// del SanitizeInterceptor limpiarlos antes de que lleguen al cliente.
//
// TODO [Estudiante 4 - Swagger]: documenta cada propiedad con @ApiProperty()
//   (description + example). Importa desde '@nestjs/swagger'.
//   - En `creditCard` usa como example el valor YA ENMASCARADO
//     ('**** **** **** 4242'), porque es lo que verá el cliente.
//   - NO documentes `passwordHash` ni `clientSecret`: el cliente nunca los
//     recibe, así que no deben aparecer en el contrato público. Puedes usar
//     @ApiHideProperty() para dejarlo explícito.
//   - En `status` usa `enum: OrderStatus`.
// =============================================================================
import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';

export enum OrderStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  SHIPPED = 'SHIPPED',
  CANCELLED = 'CANCELLED',
}

export class Customer {
  @ApiProperty({ description: 'Nombre del cliente', example: 'Ana Pérez' })
  name: string;

  @ApiProperty({
    description: 'Correo del cliente',
    example: 'ana.perez@example.com',
  })
  email: string;

  /** Hash de la contraseña del cliente. NUNCA debe salir de la API. */
  @ApiHideProperty()
  passwordHash: string;
}

export class OrderItem {
  @ApiProperty({ description: 'ID del producto', example: 101 })
  productId: number;

  @ApiProperty({
    description: 'Nombre del producto',
    example: 'Teclado mecánico',
  })
  productName: string;

  @ApiProperty({ description: 'Cantidad', example: 1 })
  quantity: number;

  @ApiProperty({ description: 'Precio unitario', example: 89.9 })
  unitPrice: number;
}

export class PaymentInfo {
  /** Número completo de tarjeta. Debe enmascararse: '**** **** **** 4242'. */
  @ApiProperty({
    description: 'Tarjeta enmascarada',
    example: '**** **** **** 4242',
  })
  creditCard: string;

  /** Secreto de la pasarela de pagos. NUNCA debe salir de la API. */
  @ApiHideProperty()
  clientSecret: string;
}

export class Order {
  @ApiProperty({ description: 'ID del pedido', example: 1 })
  id: number;

  @ApiProperty({ description: 'Datos del cliente', type: () => Customer })
  customer: Customer;

  @ApiProperty({ description: 'Productos del pedido', type: [OrderItem] })
  items: OrderItem[];

  @ApiProperty({ description: 'Total del pedido', example: 139.9 })
  total: number;

  @ApiProperty({
    description: 'Estado del pedido',
    enum: OrderStatus,
    example: OrderStatus.PAID,
  })
  status: OrderStatus;

  @ApiProperty({ description: 'Información de pago', type: () => PaymentInfo })
  payment: PaymentInfo;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2026-09-01T10:15:00.000Z',
  })
  createdAt: Date;
}
