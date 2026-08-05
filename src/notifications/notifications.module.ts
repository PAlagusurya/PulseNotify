import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { NotificationsController } from "./notifications.controller";
import { NotificationService } from "./notifications.service";

@Module({
    imports: [TypeOrmModule.forFeature([Notification])],
    providers: [NotificationService],
    controllers: [NotificationsController],
})
export class NotificationsModule { }