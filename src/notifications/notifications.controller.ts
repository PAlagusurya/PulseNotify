import { Notification } from './entities/notification.entity';
import { Body, Controller, HttpStatus, Post, Res } from "@nestjs/common";
import { NotificationService } from './notifications.service';
import { CreateNotificationDto } from './dto/create-notification.dto';

@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationService: NotificationService) { }


    @Post()

    async create(
        @Body() dto: CreateNotificationDto,
        @Res() res: Response,
    ): Promise<void> {
        const { isNew, notification } = await this.notificationService.createOrFindDuplicate(dto)

        const statusCode = isNew ? HttpStatus.CREATED : HttpStatus.OK;

        res.status(statusCode).json({
            message: isNew ? 'Notification created successfully' : 'Duplicate notification found',
            data: {
                id: notification.id,
                channel: notification.channel,
                templateId: notification.templateId,
                status: notification.status,
            }
        })
    }
}