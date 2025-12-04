export interface StorageDao {
  storeImage(fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string>
}