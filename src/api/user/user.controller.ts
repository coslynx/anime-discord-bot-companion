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
  SetMetadata,
  UseInterceptors,
  UploadedFile,
  HttpStatus,
  HttpException,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiTags, ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOkResponse, ApiNotFoundResponse, ApiBadRequestResponse, ApiUnauthorizedResponse, ApiOperation, ApiForbiddenResponse, ApiHeader, ApiQuery, ApiProduces, ApiConsumes } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../auth/enums/user-role.enum';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { User } from './entities/user.entity';
import { RolesDecorator } from '../../auth/decorators/roles.decorator';
import { Auth } from '../../auth/decorators/auth.decorator';
import { PaginationQueryDto } from '../../utils/pagination-query.dto';
import { ParseArrayPipe } from '../../utils/parse-array.pipe';
import { RolesGuardDecorator } from '../../auth/guards/roles.guard';
import { LoginDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { plainToInstance } from 'class-transformer';
import { ConfigService } from '@nestjs/config';
import { ApiConstants } from '../../constants/api.constants';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post()
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'Invalid user data provided.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'Returns a list of users.',
    type: [User],
  })
  @ApiForbiddenResponse({
    description: 'Forbidden access',
  })
  @UsePipes(new ValidationPipe({ transform: true }))
  async findAll(
    @Query() paginationQuery: PaginationQueryDto,
    @Query('roles', new ParseArrayPipe()) roles: string[],
  ) {
    return this.userService.findAll(paginationQuery, roles);
  }

  @Get(':id')
  @ApiOkResponse({
    description: 'Returns the user with the given ID.',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'User with the given ID was not found.',
  })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  @Patch(':id')
  @ApiOkResponse({
    description: 'The user has been successfully updated.',
    type: User,
  })
  @ApiNotFoundResponse({
    description: 'User with the given ID was not found.',
  })
  @ApiBadRequestResponse({
    description: 'Invalid update data provided.',
  })
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  @ApiOkResponse({
    description: 'The user has been successfully deleted.',
  })
  @ApiNotFoundResponse({
    description: 'User with the given ID was not found.',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.remove(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found.`);
    }
    return user;
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: LoginDto })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
  })
  @ApiOkResponse({
    description: 'Login successful',
  })
  async login(@Body() loginDto: LoginDto, @Res() res: any) {
    const user = await this.userService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(HttpStatus.OK).send({ message: 'Login successful', token });
  }

  @Post('upload-profile-picture')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: './uploads/profile-pictures',
        filename: (req, file, cb) => {
          const randomName = Array(32)
            .fill(null)
            .map(() => Math.round(Math.random()  16).toString(16))
            .join('');
          cb(null, `${randomName}${extname(file.originalname)}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiHeader({
    name: 'Authorization',
    description: 'Bearer token',
  })
  @ApiOkResponse({
    description: 'Profile picture uploaded successfully',
  })
  @ApiBadRequestResponse({
    description: 'Invalid image file',
  })
  async uploadProfilePicture(@UploadedFile() file: Express.Multer.File) {
    const user = await this.userService.findCurrent();
    if (user) {
      try {
        await this.userService.updateProfilePicture(user.id, file.filename);
        return { message: 'Profile picture uploaded successfully' };
      } catch (error) {
        throw new HttpException('Invalid image file', HttpStatus.BAD_REQUEST);
      }
    }
    throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
  }

  @Get('profile-picture/:filename')
  @ApiProduces('image/jpeg', 'image/png')
  @ApiOkResponse({
    description: 'Profile picture retrieved successfully',
  })
  @ApiNotFoundResponse({
    description: 'Profile picture not found',
  })
  async getProfilePicture(@Param('filename') filename: string, @Res() res: any) {
    const imagePath = `${this.configService.get(ApiConstants.UPLOADS_DIR)}/profile-pictures/${filename}`;
    res.sendFile(imagePath);
  }

  @Get('current')
  @ApiOkResponse({
    description: 'Returns the current user',
    type: User,
  })
  async getCurrentUser() {
    const user = await this.userService.findCurrent();
    if (!user) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

  @Get('refresh')
  @ApiOperation({ summary: 'Refresh JWT token' })
  @ApiOkResponse({
    description: 'JWT token refreshed',
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid token',
  })
  async refresh(@Res() res: any) {
    const authorization = res.req.headers.authorization;
    if (!authorization) {
      throw new HttpException('Unauthorized', HttpStatus.UNAUTHORIZED);
    }
    const token = authorization.split(' ')[1];
    try {
      const payload = this.jwtService.verify(token);
      const { email } = payload;
      const user = await this.userService.findOneByEmail(email);
      if (!user) {
        throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
      }
      const newToken = this.jwtService.sign({ email: user.email, sub: user.id });
      res.setHeader('Authorization', `Bearer ${newToken}`);
      res.status(HttpStatus.OK).send({ message: 'Token refreshed', token: newToken });
    } catch (error) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
  }
}