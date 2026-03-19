import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HealthController } from './health/health.controller';
import { PrismaModule } from './prisma/prisma.module';
import { OrganizationsController } from './organizations/organizations.controller';
import { ClientsController } from './clients/clients.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['../../.env', '.env'],
    }),
    PrismaModule,
  ],
  controllers: [HealthController, OrganizationsController, ClientsController],
  providers: [],
})
export class AppModule {}
