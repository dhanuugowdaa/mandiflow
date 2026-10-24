import dotenv from 'dotenv';
dotenv.config();

export interface ServerConfig {
  port: number;
  dataGovInApiKey: string;
  smsProvider: 'mock' | 'fast2sms' | 'twilio' | 'msg91';
  fast2SmsApiKey: string;
  twilioAccountSid: string;
  twilioAuthToken: string;
  twilioPhoneNumber: string;
  openWeatherApiKey: string;
  openRouteServiceApiKey: string;
  jwtSecret: string;
}

export const config: ServerConfig = {
  port: parseInt(process.env.PORT || '5000', 10),
  dataGovInApiKey: process.env.DATA_GOV_IN_API_KEY || '',
  smsProvider: (process.env.SMS_PROVIDER as any) || 'mock',
  fast2SmsApiKey: process.env.FAST2SMS_API_KEY || '',
  twilioAccountSid: process.env.TWILIO_ACCOUNT_SID || '',
  twilioAuthToken: process.env.TWILIO_AUTH_TOKEN || '',
  twilioPhoneNumber: process.env.TWILIO_PHONE_NUMBER || '',
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || '',
  openRouteServiceApiKey: process.env.OPENROUTESERVICE_API_KEY || '',
  jwtSecret: process.env.JWT_SECRET || 'mandiflow_dpdp_act_2023_secret_salt_hash',
};
