import { IsString, IsNotEmpty } from 'class-validator';

export default class CreateCategoryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}
