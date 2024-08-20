import { ConfigService } from '@nestjs/config';

export default class AuthConfig {
  static getGoogleConfig(configService: ConfigService) {
    return {
      clientID: configService.get('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get('GOOGLE_CLIENT_SECRET'),
      callbackURL: configService.get('GOOGLE_CALLBACK_URL'),
      scope: ['profile', 'email'],
    };
  }
}
