import { Request } from 'express';
import * as core from 'express-serve-static-core'


export interface TokenPayload {
  id: string;
  userId: string;
  userName: string;
}

export interface JwtRequest extends Request {
  decoded?: TokenPayload;
}

export interface UploadS3Request extends JwtRequest {
  file?: Express.MulterS3.File;
  files?: Express.MulterS3.File[];
}


export interface KeyCallback {
  (error: any, key?: string):void
}


export interface GetUserPostsRequest extends Request<core.ParamsDictionary, any, any, {id: string}> {}