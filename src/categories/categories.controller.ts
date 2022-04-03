import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  UseGuards,
  UseInterceptors,
  SerializeOptions,
  ClassSerializerInterceptor,
  Post,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import CategoriesService from './categories.service';
import CreateCategoryDto from './dto/createCategory.dto';
import UpdateCategoryDto from './dto/updateCategory.dto';
import FindOneParamsValidator from './validators/find-one-params.validator';

@UseGuards(AuthGuard('jwt'))
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({
  strategy: 'excludeAll',
})
@Controller('categories')
export default class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Get()
  getAllCategories() {
    return this.categoriesService.getAllCategories();
  }

  @Get(':id')
  getCategoryById(@Param() { id }: FindOneParamsValidator) {
    return this.categoriesService.getCategoryById(Number(id));
  }

  @Post()
  createCategory(@Body() category: CreateCategoryDto) {
    return this.categoriesService.createCategory(category);
  }

  @Patch(':id')
  updateCategory(
    @Param() { id }: FindOneParamsValidator,
    @Body() category: UpdateCategoryDto,
  ) {
    return this.categoriesService.updateCategory(Number(id), category);
  }

  @Delete(':id')
  deleteCategory(@Param() { id }: FindOneParamsValidator) {
    return this.categoriesService.deleteCategory(Number(id));
  }
}
