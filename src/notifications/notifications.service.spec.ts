
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotificationService } from './notifications.service';
import { Notification, NotificationChannel, NotificationStatus } from './entities/notification.entity';

const mockRepository = {
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
};

describe('NotificationsService', () => {
    let service: NotificationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                NotificationService,
                {
                    provide: getRepositoryToken(Notification),
                    useValue: mockRepository,
                },
            ],
        }).compile();

        service = module.get<NotificationService>(NotificationService);
        jest.clearAllMocks();
    });

    it('creates a new notification on first request', async () => {
        mockRepository.findOne.mockResolvedValue(null);
        mockRepository.create.mockReturnValue({ id: 'uuid-1', status: NotificationStatus.PENDING });
        mockRepository.save.mockResolvedValue({ id: 'uuid-1', status: NotificationStatus.PENDING });

        const result = await service.createOrFindDuplicate({
            idempotencyKey: 'key-1',
            channel: NotificationChannel.EMAIL,
            templateId: 'welcome',
            payload: { recipient: 'test@example.com' },
        });

        expect(result.isNew).toBe(true);
        expect(mockRepository.save).toHaveBeenCalledTimes(1);
    });

    it('returns existing notification for duplicate idempotency key', async () => {
        const existing = { id: 'uuid-1', status: NotificationStatus.PENDING };
        mockRepository.findOne.mockResolvedValue(existing);

        const result = await service.createOrFindDuplicate({
            idempotencyKey: 'key-1',
            channel: NotificationChannel.EMAIL,
            templateId: 'welcome',
            payload: { recipient: 'test@example.com' },
        });

        expect(result.isNew).toBe(false);
        expect(result.notification).toBe(existing);
        expect(mockRepository.save).not.toHaveBeenCalled();
    });
});