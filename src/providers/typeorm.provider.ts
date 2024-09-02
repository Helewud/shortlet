import { FactoryProvider } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ProviderTokens } from '../common/enum';
import envVars from '../common/env/env.vars';

export const typeormProvider: FactoryProvider[] = [
  {
    provide: ProviderTokens.TYPEORM_DATA_SOURCE,
    useFactory: async (): Promise<DataSource> => {
      const dataSource = new DataSource({
        type: 'postgres',
        url: envVars.POSTGRES_URL,
        synchronize: false,
        entities: [`${__dirname}/../**/**.entity{.ts,.js}`],
        migrations: [`${__dirname}/../migrations/**/**.entity{.ts,.js}`],

        ...(envVars.isProd && {
          ssl: true,
          extra: {
            ssl: {
              rejectUnauthorized: false,
            },
          },
        }),
      });

      const ds = await dataSource.initialize();

      console.log('Database connected successfully');

      return ds;
    },
  },
];
