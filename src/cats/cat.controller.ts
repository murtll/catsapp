import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Query,
  UploadedFile,
  UseInterceptors,
  Optional,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Cat } from './cat.entity'
import { CatService } from './cat.service'
import { BufferedFile } from '../minio-client/file.interface'

@Controller('cats')
export class CatsController {
  constructor(private readonly catService: CatService) {}

  @Get()
  async getCats(
    @Optional()
    @Query('take')
    take: number,
    @Optional()
    @Query('skip')
    skip: number,
    @Optional()
    @Query('booked')
    booked: boolean,
    @Optional()
    @Query('id')
    id: number
  ) {
    if (!id) return this.catService.getCats(take, skip, booked)
    const result = await this.catService.getOne(id)
    if (!result)
      throw new HttpException(
        `Cat with id ${id} doesn't exist`,
        HttpStatus.BAD_REQUEST
      )
    return result
  }

  @Post()
  async addCat(@Body() cat: Cat) {
    if (cat.id)
      throw new HttpException('Must not contain id!', HttpStatus.BAD_REQUEST)
    if (cat.booked != undefined)
      throw new HttpException(
        'Must not contain booked!',
        HttpStatus.BAD_REQUEST
      )
    if (!(cat.age && cat.cost && cat.color && cat.breed && cat.name))
      throw new HttpException(
        'Must contain age, cost, color, breed and name',
        HttpStatus.BAD_REQUEST
      )

    return await this.catService.addCat(cat)
  }

  @Delete()
  async removeCat(@Query('id') id: number) {
    const result = await this.catService.removeCat(id)
    if (result.affected == 0)
      throw new HttpException(
        `Cat with id ${id} doesn't exist`,
        HttpStatus.BAD_REQUEST
      )
    return result
  }

  @Post('/photo/:id')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPhoto(
    @UploadedFile() file: BufferedFile,
    @Param('id') id: number
  ) {
    return await this.catService.addPhoto(file, id)
  }

  @Patch()
  async updateCat(@Body() cat: Cat) {
    if (cat.booked != undefined)
      throw new HttpException(
        'Must not contain booked, you need to book cat through different route',
        HttpStatus.BAD_REQUEST
      )

    if (!cat.id)
      throw new HttpException('Must contain id', HttpStatus.BAD_REQUEST)

    const result = await this.catService.updateCat(cat)
    if (result.affected == 0)
      throw new HttpException(
        `Cat with id ${cat.id} doesn't exist`,
        HttpStatus.BAD_REQUEST
      )
    return result
  }

  @Get('/book')
  async bookCat(@Query('id') id: number) {
    const result = await this.catService.bookCat(id)

    if (result.affected == 0)
      throw new HttpException(
        `Cat with id ${id} is already booked or doesn't exist`,
        HttpStatus.BAD_REQUEST
      )
    return result
  }

  @Get('/unbook')
  async unbookCat(@Query('id') id: number) {
    const result = await this.catService.unbookCat(id)

    if (result.affected == 0)
      throw new HttpException(
        `Cat with id ${id} is not booked yet or doesn't exist`,
        HttpStatus.BAD_REQUEST
      )
    return result
  }
}
