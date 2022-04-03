import { IsString, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export default class UpdateCategoryDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name: string;
}
