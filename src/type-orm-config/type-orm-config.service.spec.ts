import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';

import { TypeOrmConfigService } from './type-orm-config.service';

describe('TypeOrmConfigService', () => {
  let service: TypeOrmConfigService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TypeOrmConfigService,
        { provide: ConfigService, useValue: { get: jest.fn() } },
      ],
    }).compile();

    service = module.get<TypeOrmConfigService>(TypeOrmConfigService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createTypeOrmOptions()', () => {
    it('should return typeorm options for production', () => {
      // given
      const nodeEnv = 'production';
      const host = 'localhost';
      const port = '1521';
      const username = 'system';
      const password = 'oracle';
      const database = 'kimchi-premium';
      const sid = 'orcl';
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        switch (key) {
          case 'NODE_ENV':
            return nodeEnv;
          case 'DB_HOST':
            return host;
          case 'DB_PORT':
            return port;
          case 'DB_USERNAME':
            return username;
          case 'DB_PASSWORD':
            return password;
          case 'DB_DATABASE':
            return database;
          case 'DB_SID':
            return sid;
          default:
            return null;
        }
      });

      // when
      const typeOrmOptions = service.createTypeOrmOptions();

      // then
      expect(typeOrmOptions).toEqual({
        type: 'oracle',
        host,
        port,
        username,
        password,
        database,
        sid,
        autoLoadEntities: true,
        // synchronize: true,
      });
    });

    it('should return typeorm options for development', () => {
      // given
      const nodeEnv = 'development';
      jest.spyOn(configService, 'get').mockImplementation((key: string) => {
        switch (key) {
          case 'NODE_ENV':
            return nodeEnv;
          default:
            return null;
        }
      });

      // when
      const typeOrmOptions = service.createTypeOrmOptions();

      // then
      expect(typeOrmOptions).toEqual({
        type: 'sqlite',
        database: 'dev.db',
        autoLoadEntities: true,
        logging: true,
        // synchronize: true,
        // dropSchema: true,
      });
    });
  });
});
