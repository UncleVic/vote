import { IsNotEmpty, IsString, IsDefined } from 'class-validator';

export class AccessKeyDto {
  @IsNotEmpty()
  @IsString()
  @IsDefined()
  accessKey: string;
}
