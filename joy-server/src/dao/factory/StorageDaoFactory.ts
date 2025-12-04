import { S3StorageDao } from "../aws/S3StorageDao";

export class StorageDaoFactory {
  public static getStorageDao() {
    return new S3StorageDao()
  }
}