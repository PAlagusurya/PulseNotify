import { Repository } from 'typeorm';
import { Notification, NotificationStatus } from './entities/notification.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateNotificationDto } from './dto/create-notification.dto';

const DEV_TENANT_ID = 'a0000000-0000-0000-0000-000000000001';

export interface NotificationResult {
    isNew: boolean;
    notification: Notification;
}


@Injectable()
export class NotificationService {
    constructor(
        @InjectRepository(Notification)
        private readonly notificationRepository: Repository<Notification>,
    ) { }

    async createOrFindDuplicate(dto: CreateNotificationDto,): Promise<NotificationResult> {
        const tenantId = DEV_TENANT_ID;

        const existing = await this.notificationRepository.findOne({
            where: {
                tenantId,
                idempotencyKey: dto.idempotencyKey,
            },
        });

        if (existing) {
            return { isNew: false, notification: existing };
        }

        const notification = this.notificationRepository.create({
            tenantId,
            idempotencyKey: dto.idempotencyKey,
            channel: dto.channel,
            templateId: dto.templateId,
            payload: dto.payload,
            scheduledAt: dto.scheduledAt ? new Date(dto.scheduledAt) : null,
            recipient: dto.payload['recipient'] as string ?? '',
            status: NotificationStatus.PENDING
        });

        const saved = await this.notificationRepository.save(notification);
        return { isNew: true, notification: saved };
    }

}