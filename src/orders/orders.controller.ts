import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiRequestTimeoutResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Order } from './entities/order.entity.js';
import { OrdersService } from './orders.service.js';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar pedidos',
    description:
      'Devuelve todos los pedidos con los datos sensibles ocultos o enmascarados.',
  })
  @ApiOkResponse({ type: [Order] })
  @ApiOkResponse({ description: 'Lista de pedidos', type: [Order] })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('reports/heavy-process')
  @ApiOperation({
    summary: 'Generar reporte pesado',
    description:
      'Simula un proceso lento (~4.5 s). Se corta con 408 al pasar los 3 s.',
  })
  @ApiRequestTimeoutResponse({
    description:
      'El reporte tardó más de 3 s y fue cortado por ell TimeoutInterceptor',
  })
  generateHeavyReport() {
    return this.ordersService.generateHeavyReport();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Obtener pedido por ID',
    description: 'Devuelve un pedido. Responde 404 si no existe.',
  })
  @ApiParam({ name: 'id', description: 'ID del pedido', example: 1 })
  @ApiOkResponse({ type: Order })
  @ApiOkResponse({ description: 'Pedido encontrado', type: Order })
  @ApiBadRequestResponse({ description: 'El id debe ser un número' })
  @ApiNotFoundResponse({ description: 'No existe un pedido con ese id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear pedido',
    description:
      'Registra un pedido nuevo y calcula su total. Responde 400 si el body es inválido.',
  })
  @ApiCreatedResponse({ description: 'Pedido creado', type: Order })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no pasan la validación',
  })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}
