import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    UpdateDateColumn,
    JoinColumn,
    Unique,
} from 'typeorm';
import { Tenant } from '../../tenants/entities/tenant.entity';

export enum NotificationChannel {
    EMAIL = 'email',
    SMS = 'sms',
    PUSH = 'push',
}

export enum NotificationStatus {
    PENDING = 'pending',
    SENT = 'sent',
    FAILED = 'failed',
    SCHEDULED = 'scheduled',
}


@Entity('notifications')
@Unique(['tenantId', 'idempotencyKey'])

export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'tenant_id', type: 'uuid' })
    tenantId: string

    @Column({ type: 'varchar', length: 255 })
    recipient: string

    @Column({ type: 'enum', enum: NotificationChannel })
    channel: NotificationChannel;

    @Column({ type: 'enum', enum: NotificationStatus, default: NotificationStatus.PENDING, })
    status: NotificationStatus

    @Column({ name: 'idempotency_key', type: 'varchar', length: 255 })
    idempotencyKey: string;

    @CreateDateColumn({ name: 'scheduled_at', type: 'timestamptz', nullable: true })
    scheduledAt: Date | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @Column({ name: 'template_id', type: 'varchar', length: 255 })
    templateId: string;

    @Column({ type: 'jsonb', default: {} })
    payload: Record<string, unknown>;

    @ManyToOne(() => Tenant, (tenant) => tenant.notifications)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant

}


