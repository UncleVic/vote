import { IsNotEmpty, IsString, IsDefined } from 'class-validator';

export class VoteDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  voteFor: string;
}
