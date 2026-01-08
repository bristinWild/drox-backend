import { ConfigService } from '@nestjs/config';
import { Twilio } from 'twilio';

export const TwilioProvider = {
    provide: 'TWILIO',
    inject: [ConfigService],
    useFactory: (config: ConfigService) => {
        return new Twilio(
            config.get('TWILIO_ACCOUNT_SID'),
            config.get('TWILIO_AUTH_TOKEN'),
        );
    },
};
