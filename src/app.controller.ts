import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { VoteService } from './vote/vote.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly voteService: VoteService,
  ) { }

  @Post('get-token')
  getToken(@Body() accessKey) {
    return this.authService.login(accessKey);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('result')
  getResult() {
    return this.voteService.getResults();
  }

  @Post('vote')
  addVote(@Body() vote) {
    return this.voteService.addVote(vote.voteFor);
  }
}
