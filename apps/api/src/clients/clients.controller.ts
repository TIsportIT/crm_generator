import { Body, Controller, Delete, Get, Patch, Post, Param, Query } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { PrismaService } from '../prisma/prisma.service';

class ClientCreateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  organizationId!: string;
}

class ClientUpdateDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}

@Controller('clients')
export class ClientsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getClients(@Query('organizationId') organizationId?: string) {
    const where = organizationId ? { organizationId } : undefined;
    return this.prisma.client.findMany({
      where,
      include: { organization: { select: { id: true, name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  getClient(@Param('id') id: string) {
    return this.prisma.client.findUnique({
      where: { id },
      include: { organization: true },
    });
  }

  @Post()
  createClient(@Body() dto: ClientCreateDto) {
    return this.prisma.client.create({
      data: { name: dto.name, organizationId: dto.organizationId },
    });
  }

  @Patch(':id')
  updateClient(@Param('id') id: string, @Body() dto: ClientUpdateDto) {
    return this.prisma.client.update({
      where: { id },
      data: dto,
    });
  }

  @Delete(':id')
  deleteClient(@Param('id') id: string) {
    return this.prisma.client.delete({ where: { id } });
  }
}

