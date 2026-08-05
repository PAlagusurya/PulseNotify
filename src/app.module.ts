import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Tenant } from './tenants/entities/tenant.entity';
import { TenantNotificationCredential } from './tenants/entities/tenant-notification-credential.entity';
import { Notification } from './notifications/entities/notification.entity';
import { NotificationsModule } from './notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available everywhere without re-importing
      envFilePath: '.env',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Tenant, TenantNotificationCredential, Notification],
        synchronize: false,       // Never auto-sync — we use migrations
        migrations: ['dist/database/migrations/*.js'],
        logging: configService.get<string>('NODE_ENV') !== 'production',
      })
    }),
    NotificationsModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
