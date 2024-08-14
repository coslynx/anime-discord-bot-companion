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
  UsePipes,
  ValidationPipe,
  ParseIntPipe,
  NotFoundException,
  BadRequestException,
  UseInterceptors,
  UploadedFile,
  SetMetadata,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ListService } from './list.service';
import { CreateListDto } from './dto/create-list.dto';
import { UpdateListDto } from './dto/update-list.dto';
import { ApiTags, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiForbiddenResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';
import { ParseArrayPipe } from '../../utils/parse-array.pipe';
import { PaginationQueryDto } from '../../utils/pagination-query.dto';

@ApiTags('Lists')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('list')
export class ListController {
  constructor(private readonly listService: ListService) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The list has been successfully created.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid list data provided.',
  })
  async create(@Body() createListDto: CreateListDto) {
    return this.listService.create(createListDto);
  }

  @Get()
  @ApiOkResponse({
    description: 'Returns a list of lists.',
  })
  @ApiForbiddenResponse({
    description: 'Forbidden access',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(@Query() paginationQuery: PaginationQueryDto, @Query('type', new ParseArrayPipe()) type: string[]) {
    return this.listService.findAll(paginationQuery, type);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Returns the list with the given ID.',
  })
  @ApiNotFoundResponse({
    description: 'List with the given ID was not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const list = await this.listService.findOne(id);
    if (!list) {
      throw new NotFoundException(`List with ID ${id} not found.`);
    }
    return list;
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'The list has been successfully updated.',
  })
  @ApiNotFoundResponse({
    description: 'List with the given ID was not found.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data provided.',
  })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateListDto: UpdateListDto) {
    const list = await this.listService.update(id, updateListDto);
    if (!list) {
      throw new NotFoundException(`List with ID ${id} not found.`);
    }
    return list;
  }

  @Delete(':id')
  @ApiOkResponse({
    description: 'The list has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'List with the given ID was not found.',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const list = await this.listService.remove(id);
    if (!list) {
      throw new NotFoundException(`List with ID ${id} not found.`);
    }
    return list;
  }
}