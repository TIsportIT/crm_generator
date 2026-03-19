import { Body, Controller, Delete, Get, Patch, Param, Post, Query } from '@nestjs/common';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PrismaService } from '../prisma/prisma.service';

class OrganizationCreateDto {
  @IsString()
  @IsNotEmpty()
  name!: string;
}

class OrganizationUpdateDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;
}

@Controller('organizations')
export class OrganizationsController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  getOrganizations() {
    return this.prisma.organization.findMany({
      include: {
        _count: { select: { clients: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Get(':id')
  getOrganization(@Param('id') id: string) {
    return this.prisma.organization.findUnique({
      where: { id },
      include: {
        clients: true,
        _count: { select: { clients: true } },
      },
    });
  }

  @Post()
  createOrganization(@Body() dto: OrganizationCreateDto) {
    return this.prisma.organization.create({
      data: { name: dto.name },
    });
  }

  @Patch(':id')
  updateOrganization(@Param('id') id: string, @Body() dto: OrganizationUpdateDto) {
    return this.prisma.organization.update({
      where: { id },
      data: dto,
    });
  }

  @Delete(':id')
  deleteOrganization(@Param('id') id: string) {
    return this.prisma.organization.delete({ where: { id } });
  }
}

