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
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { AddCatDto, UpdateCatDto } from './cat.entity'
import { CatService } from './cat.service'
import { BufferedFile } from '../minio-client/file.interface'

@Controller('cats')
export class CatsController {
  constructor(private readonly catService: CatService) {}

  @Get()
  async getCats(@Query() query) {
    if (!query.id)
      return this.catService.getCats(query.take, query.skip, query.booked)
    const result = await this.catService.getOne(query.id)
    if (!result)
      throw new HttpException(
        `Cat with id ${query.id} doesn't exist`,
        HttpStatus.BAD_REQUEST
      )
    return result
  }

  @Post()
  async addCat(@Body() cat: AddCatDto) {
    console.log(cat)
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
  async updateCat(@Body() cat: UpdateCatDto) {
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
