import { Strategy } from 'passport-saml';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigService } from '@nestjs/config';
import fs = require('fs');

@Injectable()
export class SamlStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService
  ) {
    super({
      callbackUrl: configService.get<string>('SAML_CALLBACK_URL'),
      entryPoint: configService.get<string>('SAML_IDP_URL'),
      issuer: configService.get<string>('SAML_ENTITY_ID'),
      identifierFormat: null,
      privateCert: !!configService.get<string>('SAML_LOCAL_KEY_PATH')
        ? fs.readFileSync(
            configService.get<string>('SAML_LOCAL_KEY_PATH'),
            'utf8'
          )
        : configService.get<string>('SAML_LOCAL_KEY_ONELINE'),
      cert: !!configService.get<string>('SAML_IDP_CERT_PATH')
        ? fs.readFileSync(
            configService.get<string>('SAML_IDP_CERT_PATH'),
            'utf8'
          )
        : configService.get<string>('SAML_IDP_CERT_ONELINE'),
      validateInResponseTo: true,
      disableRequestedAuthnContext: true,
      signatureAlgorithm: 'sha256',
    });
  }

  async validate(samlUser: any): Promise<any> {
    const user = await this.authService.validateSAMLUser(samlUser);
    return user;
  }
}
