import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from "./dto/register.dto";
import { LoginDto } from "./dto/login.dto";
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from './jwt-auth.guard';
import { CurrentUser } from './current_user';
@ApiTags('auth')
@ApiBearerAuth()
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiBody({type: RegisterDto})
  async register(@Body() registerDto: RegisterDto){
    return this.authService.register(registerDto);
  }

  @Post('login')
  @ApiBody({type: LoginDto})
    async login(@Body() loginDto: LoginDto){
      return this.authService.login(loginDto);
  }
  
  @Get('me')
  @UseGuards(JwtAuthGuard)
  getProfile(@CurrentUser() user: any) {
    // Devuelve solo los campos esenciales del usuario
    const { nombre, apellido, correo } = user;
    return { nombre, apellido, correo };
  }
 
}
