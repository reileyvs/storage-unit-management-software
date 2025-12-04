import { StorageDao } from "../abstract/StorageDao";
import { S3Client } from "@aws-sdk/client-s3";
import { PutObjectCommand, ObjectCannedACL } from "@aws-sdk/client-s3";

const BUCKET = 'tweeter-vince-bucket'
const REGION = 'us-east-2'

export class S3StorageDao implements StorageDao {
  async storeImage(
    fileName: string,
    imageStringBase64Encoded: string
  ): Promise<string> {
    let decodedImageBuffer: Buffer = Buffer.from(
      imageStringBase64Encoded,
      "base64"
    );
    const s3Params = {
      Bucket: BUCKET,
      Key: "image/" + fileName,
      Body: decodedImageBuffer,
      ContentType: "image/jpeg",
      ACL: ObjectCannedACL.public_read,
    };
    const c = new PutObjectCommand(s3Params);
    const client = new S3Client({ region: REGION });
    try {
      await client.send(c);
      return `https://${BUCKET}.s3.${REGION}.amazonaws.com/image/${fileName}`;
    } catch (error) {
      throw Error("[Server Error] s3 put image failed with: " + error);
    }
  }
}