import { IsString } from 'class-validator';

export class FindUserByQueryDto {
  @IsString()
  query: string;
}
