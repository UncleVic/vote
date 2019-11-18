import { IsNotEmpty, IsString, IsDefined } from 'class-validator';

export class VotesResultsDto {
  @IsDefined()
  name: string;
  @IsDefined()
  votes: number;
  @IsDefined()
  position: number;
}
