import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DeleteResult, Repository, UpdateResult } from 'typeorm'
import { Cat } from './cat.entity'
import { MinioClientService } from '../minio-client/minio-client.service'
import { BufferedFile } from '../minio-client/file.interface'

@Injectable()
export class CatService {
  constructor(
    private readonly minioClient: MinioClientService,
    @InjectRepository(Cat) private readonly catRepository: Repository<Cat>
  ) {}

  async addPhoto(file: BufferedFile, id: number): Promise<UpdateResult> {
    if (!(await this.catRepository.findOne(id)))
      throw new HttpException(
        `Cat with id ${id} doesn't exist`,
        HttpStatus.BAD_REQUEST
      )

    const url = await this.minioClient.upload(file)
    return await this.catRepository.update(id, { photo: url })
  }

  async getCats(take: number, skip: number, booked: boolean): Promise<Cat[]> {
    const options = {
      order: {
        id: 'ASC' as const,
      },
    }
    if (booked != null) options['where'] = { booked: booked }
    if (take && skip) {
      options['take'] = take
      options['skip'] = skip
    }

    return await this.catRepository.find(options)
  }

  async getOne(id: number): Promise<Cat> {
    return await this.catRepository.findOne(id)
  }

  async addCat(cat: Cat): Promise<Cat> {
    return await this.catRepository.save(cat)
  }

  async removeCat(id: number): Promise<DeleteResult> {
    return await this.catRepository.delete(id)
  }

  async bookCat(id: number): Promise<UpdateResult> {
    return await this.catRepository.update(
      { id: id, booked: false },
      { booked: true }
    )
  }

  async unbookCat(id: number): Promise<UpdateResult> {
    return await this.catRepository.update(
      { id: id, booked: true },
      { booked: false }
    )
  }

  async updateCat(cat: Cat): Promise<UpdateResult> {
    return await this.catRepository.update(cat.id, cat)
  }
}
