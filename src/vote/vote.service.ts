import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, InsertResult, UpdateResult } from 'typeorm';
import { Vote } from './vote.entity';
import { VotesResults } from './votesResults';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) { }

  async getResults(): Promise<VotesResults[]> {
    const votes = await this.voteRepository
      .createQueryBuilder('vote')
      .orderBy('votes', 'DESC')
      .getMany();

    const results: VotesResults[] = votes.reduce((acc, cur, idx) => {
      if (!idx) {
        acc.push({ name: cur.name, votes: cur.votes, position: 1 });
      } else if (acc[idx - 1].votes === cur.votes) {
        acc.push({ name: cur.name, votes: cur.votes, position: acc[idx - 1].position });
      } else {
        acc.push({ name: cur.name, votes: cur.votes, position: acc[idx - 1].position + 1 });
      }

      return acc;
    }, []);

    return results;
  }

  async addVote(name: string): Promise<InsertResult | UpdateResult> {
    const vote = await this.voteRepository
      .createQueryBuilder('vote')
      .where('vote.name = :name', { name })
      .getOne();

    if (vote) {
      return await this.voteRepository
        .createQueryBuilder()
        .update(Vote)
        .set({ votes: ++vote.votes })
        .where('vote.name = :name', { name })
        .execute();
    } else {
      return await this.voteRepository
        .createQueryBuilder()
        .insert()
        .into(Vote)
        .values({ name, votes: 1 })
        .execute();
    }
  }
}
