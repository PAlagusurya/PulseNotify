import { MigrationInterface, QueryRunner } from 'typeorm';


// RESTRICT = protect the data, force explicit cleanup
// CASCADE = delete everything together
// For financial/audit data → always RESTRICT
// For truly dependent data (e.g. cart items when cart is deleted) → CASCADE is fine

export class CreateInitialSchema implements MigrationInterface {
    name = 'CreateInitialSchema';

    public async up(queryRunner: QueryRunner): Promise<void> {
        // 1. Create tenants table
        await queryRunner.query(`
      CREATE TABLE "tenants" (
        "id"         UUID NOT NULL DEFAULT gen_random_uuid(),
        "name"       VARCHAR(255) NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tenants_id" PRIMARY KEY ("id")
      )
    `);

        // 2. Create notifications table
        await queryRunner.query(`
      CREATE TYPE "notification_channel_enum" AS ENUM ('email', 'sms', 'push')
    `);

        await queryRunner.query(`
      CREATE TYPE "notification_status_enum" AS ENUM ('pending', 'sent', 'failed', 'scheduled')
    `);

        await queryRunner.query(`
      CREATE TABLE "notifications" (
        "id"               UUID NOT NULL DEFAULT gen_random_uuid(),
        "tenant_id"        UUID NOT NULL,
        "recipient"        VARCHAR(255) NOT NULL,
        "channel"          "notification_channel_enum" NOT NULL,
        "status"           "notification_status_enum" NOT NULL DEFAULT 'pending',
        "idempotency_key"  VARCHAR(255) NOT NULL,
        "scheduled_at"     TIMESTAMPTZ,
        "created_at"       TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at"       TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_notifications_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_notifications_tenant_idempotency"
          UNIQUE ("tenant_id", "idempotency_key"),
        CONSTRAINT "FK_notifications_tenant"
          FOREIGN KEY ("tenant_id")
          REFERENCES "tenants" ("id")
          ON DELETE RESTRICT
      )
    `);

        // 3. Create tenant_notification_credentials table
        await queryRunner.query(`
      CREATE TABLE "tenant_notification_credentials" (
        "tenant_id"  UUID NOT NULL,
        "channel"    VARCHAR(50) NOT NULL,
        "credential" JSONB NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_tenant_notification_credentials"
          PRIMARY KEY ("tenant_id", "channel"),
        CONSTRAINT "FK_tenant_notification_credentials_tenant"
          FOREIGN KEY ("tenant_id")
          REFERENCES "tenants" ("id")
          ON DELETE RESTRICT
      )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tenant_notification_credentials"`);
        await queryRunner.query(`DROP TABLE "notifications"`);
        await queryRunner.query(`DROP TYPE "notification_status_enum"`);
        await queryRunner.query(`DROP TYPE "notification_channel_enum"`);
        await queryRunner.query(`DROP TABLE "tenants"`);
    }
}