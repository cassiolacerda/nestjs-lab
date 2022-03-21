import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export default class UpdatePostDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  title: string;
}
