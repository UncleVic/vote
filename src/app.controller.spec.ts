import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote/vote.entity';
import { VoteService } from './vote/vote.service';
import { VoteModule } from './vote/vote.module';

describe('AppController', () => {
  let app: TestingModule;
  let serviceApp: AppService;
  let serviceVote: VoteService;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      imports: [
        AuthModule,
        VoteModule,
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'vote.db',
          entities: [Vote],
          synchronize: true,
        }),
      ],
      controllers: [AppController],
      providers: [AppService, VoteService],
    }).compile();

    serviceApp = app.get<AppService>(AppService);
    serviceVote = app.get<VoteService>(VoteService);
  });

  describe('ping', () => {
    it('should return "Vote Service is running"', () => {
      const appController = app.get<AppController>(AppController);
      expect(appController.ping()).toBe('Vote Service is running');
    });
  });

  describe('should be defined', () => {
    it('serviceApp', () => {
      expect(serviceApp).toBeDefined();
    });

    it('serviceVote', () => {
      expect(serviceVote).toBeDefined();
    });
  });

});
