import { NotFoundException } from '@nestjs/common';

export default class CategoryNotFoundException extends NotFoundException {
  constructor(categoryId: number) {
    super(`Category with id ${categoryId} not found`);
  }
}
