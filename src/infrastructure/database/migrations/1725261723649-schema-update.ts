import { MigrationInterface, QueryRunner } from 'typeorm';

export class SchemaUpdate1725261723649 implements MigrationInterface {
  name = 'SchemaUpdate1725261723649';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "profiles" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "profession" character varying NOT NULL, "balance" numeric, "role" character varying NOT NULL, CONSTRAINT "UQ_2c0c7196c89bdcc9b04f29f3fe6" UNIQUE ("uuid"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "contracts" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "terms" text NOT NULL, "status" character varying NOT NULL, "contractor_id" integer NOT NULL, "client_id" integer NOT NULL, CONSTRAINT "UQ_d47764660e5f64763194e3c66f1" UNIQUE ("uuid"), CONSTRAINT "PK_2c7b8f3a7b1acdd49497d83d0fb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "jobs" ("id" SERIAL NOT NULL, "uuid" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL, "updated_at" TIMESTAMP NOT NULL, "description" text NOT NULL, "price" numeric NOT NULL, "is_paid" boolean NOT NULL, "paid_date" date, "contract_id" integer NOT NULL, CONSTRAINT "UQ_2ad99c480880ac224b7e39338ba" UNIQUE ("uuid"), CONSTRAINT "PK_cf0a6c42b72fcc7f7c237def345" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" ADD CONSTRAINT "FK_e3653640e4f62aa511fe43b6f84" FOREIGN KEY ("contractor_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" ADD CONSTRAINT "FK_9945462ca96b2c7d0a97e012cdc" FOREIGN KEY ("client_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "jobs" ADD CONSTRAINT "FK_b5aab52eab9e5226c7873c987b9" FOREIGN KEY ("contract_id") REFERENCES "contracts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jobs" DROP CONSTRAINT "FK_b5aab52eab9e5226c7873c987b9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "FK_9945462ca96b2c7d0a97e012cdc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "contracts" DROP CONSTRAINT "FK_e3653640e4f62aa511fe43b6f84"`,
    );
    await queryRunner.query(`DROP TABLE "jobs"`);
    await queryRunner.query(`DROP TABLE "contracts"`);
    await queryRunner.query(`DROP TABLE "profiles"`);
  }
}
