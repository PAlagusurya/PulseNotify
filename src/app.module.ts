import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes config available everywhere without re-importing
      envFilePath: '.env',
    })
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule { }
