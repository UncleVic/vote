import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';
import { VotesResultsDto } from './votesResults.dto';

@Injectable()
export class VoteService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepository: Repository<Vote>,
  ) { }

  async getResults(): Promise<VotesResultsDto[]> {
    const votes = await this.voteRepository
      .createQueryBuilder('vote')
      .orderBy('votes', 'DESC')
      .getMany();

    const results: VotesResultsDto[] = votes.reduce((acc, cur, idx) => {
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

  async addVote(name: string): Promise<{ success: boolean; }> {
    const vote = await this.voteRepository
      .createQueryBuilder('vote')
      .where('vote.name = :name', { name })
      .getOne();

    if (vote) {
      const result = await this.voteRepository
        .createQueryBuilder()
        .update(Vote)
        .set({ votes: ++vote.votes })
        .where('vote.name = :name', { name })
        .execute();
      return { success: (result.raw !== undefined && result.generatedMaps !== undefined) };
    } else {
      const result = await this.voteRepository
        .createQueryBuilder()
        .insert()
        .into(Vote)
        .values({ name, votes: 1 })
        .execute();
      return { success: result.raw > 0 };
    }
  }
}
