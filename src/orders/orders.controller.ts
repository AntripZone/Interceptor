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
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { Order } from './entities/order.entity.js';
import { OrdersService } from './orders.service.js';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get()
  @ApiOkResponse({ description: 'Lista de pedidos', type: [Order] })
  findAll() {
    return this.ordersService.findAll();
  }

  @Get('reports/heavy-process')
  @ApiOkResponse({ description: 'Reporte generado a tiempo' })
  @ApiRequestTimeoutResponse({
    description:
      'El reporte tardó más de 3 s y fue cortado por ell TimeoutInterceptor',
  })
  generateHeavyReport() {
    return this.ordersService.generateHeavyReport();
  }

  @Get(':id')
  @ApiOkResponse({ description: 'Pedido encontrado', type: Order })
  @ApiBadRequestResponse({ description: 'El id debe ser un número' })
  @ApiNotFoundResponse({ description: 'No existe un pedido con ese id' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.ordersService.findOne(id);
  }

  @Post()
  @ApiCreatedResponse({ description: 'Pedido creado', type: Order })
  @ApiBadRequestResponse({
    description: 'Los datos enviados no pasan la validación',
  })
  create(@Body() dto: CreateOrderDto) {
    return this.ordersService.create(dto);
  }
}