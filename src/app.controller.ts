import { Controller, Get, Post, UseGuards, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth/auth.service';
import { VoteService } from './vote/vote.service';
import { AccessKeyDto } from './auth/accessKey.dto';
import { VoteDto } from './vote/vote.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
    private readonly voteService: VoteService,
  ) { }

  @Post('get-token')
  getToken(@Body() accessKey: AccessKeyDto) {
    return this.authService.login(accessKey);
  }

  @Get()
  ping(): string {
    return this.appService.ping();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('results')
  getResult() {
    return this.voteService.getResults();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('vote')
  addVote(@Body() vote: VoteDto) {
    return this.voteService.addVote(vote.voteFor);
  }
}
