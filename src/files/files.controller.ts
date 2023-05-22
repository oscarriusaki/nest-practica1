import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service'; 
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer  } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly configService: ConfigService,
    ) {}

  @Get('product/:imageName')
  findProductImage(
    @Res() res: Response,
    @Param('imageName') imageName: string
  ) {

    const path = this.filesService.getStaticProductImage(imageName)
    res.sendFile(path)

    return path;
  }

  @Post('product')
  @UseInterceptors( FileInterceptor('file',{
    fileFilter: fileFilter,
    // limits: { fileSize: 100 }
    storage: diskStorage({
      destination: './static/uploads',
      filename: fileNamer,

    })
  }))
  uploadFileImage( 
    @UploadedFile() file: Express.Multer.File
    ){
      
      if(!file)
        throw new BadRequestException('Make sure that file is an image')
      
      // const secureUrl = `${file.filename}`;
      const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;

    return {
      secureUrl
    }
  }

}


