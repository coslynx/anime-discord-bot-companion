import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { AnimeService } from '../anime.service';
import { CreateAnimeDto } from '../dto/create-anime.dto';
import { UpdateAnimeDto } from '../dto/update-anime.dto';
import { ApiTags, ApiBearerAuth, ApiBody, ApiConsumes, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';
import { ParseArrayPipe } from '../../utils/parse-array.pipe';
import { PaginationQueryDto } from '../../utils/pagination-query.dto';

@ApiTags('Anime')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Post()
  @Roles(UserRole.ADMIN)
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: CreateAnimeDto,
  })
  @ApiCreatedResponse({
    description: 'The anime has been successfully created.',
  })
  @UseInterceptors(FileInterceptor('image'))
  async create(@Body() createAnimeDto: CreateAnimeDto, @UploadedFile() image: Express.Multer.File) {
    return this.animeService.create(createAnimeDto, image);
  }

  @Get()
  @ApiOkResponse({
    description: 'Returns a list of anime.',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() paginationQuery: PaginationQueryDto, @Query('genres', new ParseArrayPipe()) genres: string[], @Query('studios', new ParseArrayPipe()) studios: string[]) {
    return this.animeService.findAll(paginationQuery, genres, studios);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Returns the anime with the given ID.',
  })
  @ApiNotFoundResponse({
    description: 'Anime with the given ID was not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const anime = await this.animeService.findOne(id);
    if (!anime) {
      throw new NotFoundException(`Anime with ID ${id} not found.`);
    }
    return anime;
  }

  @Patch(':id')
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'The anime has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'Anime with the given ID was not found.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data provided.',
  })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateAnimeDto: UpdateAnimeDto) {
    const anime = await this.animeService.update(id, updateAnimeDto);
    if (!anime) {
      throw new NotFoundException(`Anime with ID ${id} not found.`);
    }
    return anime;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'The anime has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'Anime with the given ID was not found.',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const anime = await this.animeService.remove(id);
    if (!anime) {
      throw new NotFoundException(`Anime with ID ${id} not found.`);
    }
    return anime;
  }
}