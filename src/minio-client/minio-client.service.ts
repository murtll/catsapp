import { Injectable, HttpException, HttpStatus } from '@nestjs/common'
import { MinioService } from 'nestjs-minio-client'
import { BufferedFile } from './file.interface'
import * as crypto from 'crypto'

@Injectable()
export class MinioClientService {
  private readonly baseBucket = 'cats-test'

  public get client() {
    return this.minio.client
  }

  constructor(private readonly minio: MinioService) {}

  public async upload(
    file: BufferedFile,
    baseBucket: string = this.baseBucket
  ) {
    if (!(file.mimetype.includes('jpeg') || file.mimetype.includes('png'))) {
      throw new HttpException('Error uploading file', HttpStatus.BAD_REQUEST)
    }
    const temp_filename = Date.now().toString()
    const hashedFileName = crypto
      .createHash('md5')
      .update(temp_filename)
      .digest('hex')
    const ext = file.originalname.substring(
      file.originalname.lastIndexOf('.'),
      file.originalname.length
    )

    const filename = hashedFileName + ext
    const fileName = `${filename}`
    const fileBuffer = file.buffer
    this.client.putObject(
      baseBucket,
      fileName,
      fileBuffer,
      function (err, res) {
        if (err)
          throw new HttpException(
            'Error uploading file',
            HttpStatus.BAD_REQUEST
          )
      }
    )

    return `192.168.0.190:9000/${baseBucket}/${filename}`
  }
}
