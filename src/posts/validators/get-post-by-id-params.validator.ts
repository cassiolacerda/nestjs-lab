import { IsNumberString } from 'class-validator';

export default class GetPostByIdParamsValidator {
  @IsNumberString()
  id: string;
}
