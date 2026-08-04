import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { TenantNotificationCredential } from './tenant-notification-credential.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity('tenants')

export class Tenant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    name: string

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => Notification, (notification) => notification.tenant)
    notifications: Notification[];

    @OneToMany(() => TenantNotificationCredential, (credential) => credential.tenant)
    credentials: TenantNotificationCredential[];
}