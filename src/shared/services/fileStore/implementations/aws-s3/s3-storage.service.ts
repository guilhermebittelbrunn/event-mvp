import { S3Client, S3ClientConfig, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { Readable } from 'stream';

import { IFileStoreService, UploadFilePayload } from '@/shared/services/fileStore/fileStore.service.interface';

@Injectable()
export class S3StorageService implements OnModuleInit, OnModuleDestroy, IFileStoreService {
  private readonly logger = new Logger(S3StorageService.name);

  private client: S3Client;

  constructor(private readonly config: ConfigService) {}

  onModuleInit() {
    const config = {
      region: this.config.getOrThrow('s3.region'),
      credentials: {
        accessKeyId: this.config.getOrThrow('s3.accessKeyId'),
        secretAccessKey: this.config.getOrThrow('s3.secretAccessKey'),
      },
    } satisfies S3ClientConfig;

    this.client = new S3Client(config);

    this.logger.log('S3 Storage initialized!');
  }

  onModuleDestroy() {
    if (!this.config.get('isTest')) {
      this.logger.log(`Disconnecting from S3 Storage`);
    }

    this.client?.destroy();
  }

  async getFile(pathname: string): Promise<Readable | null> {
    try {
      const command = new GetObjectCommand({
        Bucket: this.config.getOrThrow('s3.assetsBucket'),
        Key: pathname,
      });

      const result = await this.client.send(command);

      if (!result.Body) {
        return null;
      }

      return result.Body as Readable;
    } catch (error) {
      this.logger.error(`Error getting file from S3: ${pathname}`, error);
      return null;
    }
  }

  async upload(input: UploadFilePayload) {
    const upload = new Upload({
      client: this.client,
      params: {
        Bucket: this.config.getOrThrow('s3.assetsBucket'),
        Key: input.path,
        Body: input.buffer,
        ContentType: input.mimetype,
        ACL: 'public-read',
        ContentDisposition: 'inline',
      },
    });

    const result = await upload.done();

    return result.Location;
  }

  async delete(pathname: string) {
    const command = new DeleteObjectCommand({
      Bucket: this.config.getOrThrow('s3.assetsBucket'),
      Key: pathname,
    });

    await this.client.send(command);
  }

  async deleteBulk(paths: string[]) {
    for (const path of paths) {
      await this.delete(path);
    }
  }
}
