import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTemplateIdAndPayloadToNotifications1785954685747 implements MigrationInterface {
    name = 'AddTemplateIdAndPayloadToNotifications1785954685747'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_notifications_tenant"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "UQ_notifications_tenant_idempotency"`);
        await queryRunner.query(`CREATE TABLE "credentials" ("tenant_id" uuid NOT NULL, "channel" character varying(50) NOT NULL, "credential" jsonb NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_10b9205699c6941a3962f2d16e8" PRIMARY KEY ("tenant_id"))`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "template_id" character varying(255) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "payload" jsonb NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TYPE "public"."notification_channel_enum" RENAME TO "notification_channel_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_channel_enum" AS ENUM('email', 'sms', 'push')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "channel" TYPE "public"."notifications_channel_enum" USING "channel"::"text"::"public"."notifications_channel_enum"`);
        await queryRunner.query(`DROP TYPE "public"."notification_channel_enum_old"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_status_enum" RENAME TO "notification_status_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."notifications_status_enum" AS ENUM('pending', 'sent', 'failed', 'scheduled')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "status" TYPE "public"."notifications_status_enum" USING "status"::"text"::"public"."notifications_status_enum"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."notification_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "scheduled_at" SET DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "created_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "updated_at" TIMESTAMP NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "UQ_63344b906f8c893365fb4800a55" UNIQUE ("tenant_id", "idempotency_key")`);
        await queryRunner.query(`ALTER TABLE "credentials" ADD CONSTRAINT "FK_10b9205699c6941a3962f2d16e8" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_d93ddd7e1b890535ecafbb334ec" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "FK_d93ddd7e1b890535ecafbb334ec"`);
        await queryRunner.query(`ALTER TABLE "credentials" DROP CONSTRAINT "FK_10b9205699c6941a3962f2d16e8"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP CONSTRAINT "UQ_63344b906f8c893365fb4800a55"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "updated_at"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "scheduled_at" DROP DEFAULT`);
        await queryRunner.query(`CREATE TYPE "public"."notification_status_enum_old" AS ENUM('pending', 'sent', 'failed', 'scheduled')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "status" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "status" TYPE "public"."notification_status_enum_old" USING "status"::"text"::"public"."notification_status_enum_old"`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "status" SET DEFAULT 'pending'`);
        await queryRunner.query(`DROP TYPE "public"."notifications_status_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_status_enum_old" RENAME TO "notification_status_enum"`);
        await queryRunner.query(`CREATE TYPE "public"."notification_channel_enum_old" AS ENUM('email', 'sms', 'push')`);
        await queryRunner.query(`ALTER TABLE "notifications" ALTER COLUMN "channel" TYPE "public"."notification_channel_enum_old" USING "channel"::"text"::"public"."notification_channel_enum_old"`);
        await queryRunner.query(`DROP TYPE "public"."notifications_channel_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."notification_channel_enum_old" RENAME TO "notification_channel_enum"`);
        await queryRunner.query(`ALTER TABLE "tenants" DROP COLUMN "created_at"`);
        await queryRunner.query(`ALTER TABLE "tenants" ADD "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "payload"`);
        await queryRunner.query(`ALTER TABLE "notifications" DROP COLUMN "template_id"`);
        await queryRunner.query(`DROP TABLE "credentials"`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "UQ_notifications_tenant_idempotency" UNIQUE ("tenant_id", "idempotency_key")`);
        await queryRunner.query(`ALTER TABLE "notifications" ADD CONSTRAINT "FK_notifications_tenant" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE NO ACTION`);
    }

}
