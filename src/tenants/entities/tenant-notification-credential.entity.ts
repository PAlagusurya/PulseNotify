import {
    Entity,
    Column,
    CreateDateColumn,
    PrimaryColumn,
    UpdateDateColumn,
    JoinColumn,
    ManyToOne,
} from 'typeorm';
import { Tenant } from './tenant.entity';

@Entity('credentials')

export class TenantNotificationCredential {
    @PrimaryColumn({ name: 'tenant_id', type: 'uuid' })
    tenantId: string;

    @Column({ type: 'varchar', length: 50 })
    channel: string

    @Column({ type: 'jsonb' })
    credential: Record<string, unknown>;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @ManyToOne(() => Tenant, (tenant) => tenant.credentials)
    @JoinColumn({ name: 'tenant_id' })
    tenant: Tenant

}