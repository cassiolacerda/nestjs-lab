import { IsNumberString } from 'class-validator';

export default class FindOneParamsValidator {
  @IsNumberString()
  id: string;
}
