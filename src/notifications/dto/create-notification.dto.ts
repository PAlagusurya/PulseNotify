import { IsDateString, IsEnum, IsNotEmpty, IsObject, IsOptional, IsString } from "class-validator";
import { NotificationChannel } from "../entities/notification.entity";

export class CreateNotificationDto {
    @IsString()
    @IsNotEmpty()
    idempotencyKey: string;

    @IsEnum(NotificationChannel, { message: `channel must be one of the ${Object.values(NotificationChannel).join(',')} values }` })
    channel: NotificationChannel;

    @IsString()
    @IsNotEmpty()
    templateId: string;

    @IsObject()
    payload: Record<string, unknown>

    @IsOptional()
    @IsDateString()
    scheduledAt?: string;
}