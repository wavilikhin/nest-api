import { CanActivate, Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TestEnvGuard implements CanActivate {
    constructor(
        @Inject(ConfigService) private readonly configService: ConfigService,
    ) {}
    canActivate() {
        return this.configService.get('NODE_ENV') === 'test' ? true : false;
    }
}
