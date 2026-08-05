import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedDefaultTenant1700000000001 implements MigrationInterface {
    name = 'SeedDefaultTenant1700000000001';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      INSERT INTO "tenants" ("id", "name", "created_at")
      VALUES (
        'a0000000-0000-0000-0000-000000000001',
        'PulseNotify Dev Tenant',
        NOW()
      )
    `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
      DELETE FROM "tenants" WHERE "id" = 'a0000000-0000-0000-0000-000000000001'
    `);
    }
}