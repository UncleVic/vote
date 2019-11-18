import { Test, TestingModule } from '@nestjs/testing';
import { VoteService } from './vote.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vote } from './vote.entity';

describe('VoteService', () => {
  let service: VoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: 'vote.db',
          entities: [Vote],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Vote]),
      ],
      exports: [TypeOrmModule],
      providers: [VoteService],
    }).compile();

    service = module.get<VoteService>(VoteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
