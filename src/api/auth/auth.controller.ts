import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-user.dto';
import { ApiTags, ApiBody, ApiOkResponse, ApiUnauthorizedResponse, ApiOperation } from '@nestjs/swagger';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from './decorators/public.decorator';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
  ) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'Log in a user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'Login successful' })
  @ApiUnauthorizedResponse({ description: 'Invalid credentials' })
  async login(@Body() loginDto: LoginDto, @Res() res: any) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    const payload = { email: user.email, sub: user.id };
    const token = this.jwtService.sign(payload);
    res.setHeader('Authorization', `Bearer ${token}`);
    res.status(HttpStatus.OK).send({ message: 'Login successful', token });
  }

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: LoginDto })
  @ApiOkResponse({ description: 'User registered successfully' })
  async register(@Body() loginDto: LoginDto, @Res() res: any) {
    try {
      const user = await this.authService.register(loginDto.email, loginDto.password);
      if (!user) {
        throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
      }
      const payload = { email: user.email, sub: user.id };
      const token = this.jwtService.sign(payload);
      res.setHeader('Authorization', `Bearer ${token}`);
      res.status(HttpStatus.CREATED).send({ message: 'User registered successfully', token });
    } catch (error) {
      throw new HttpException('Registration failed', HttpStatus.BAD_REQUEST);
    }
  }
}