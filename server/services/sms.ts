import { config } from '../config';

export interface SendOtpResult {
  success: boolean;
  provider: string;
  message: string;
  otpCode: string;
}

export async function sendKisanOtpSms(phoneNumber: string, otpCode: string): Promise<SendOtpResult> {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '').slice(-10);

  // 1. Fast2SMS Indian SMS Gateway
  if (config.smsProvider === 'fast2sms' && config.fast2SmsApiKey) {
    try {
      console.log(`[SMS: Fast2SMS] Sending real OTP ${otpCode} to +91 ${cleanPhone}`);
      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: config.fast2SmsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'otp',
          variables_values: otpCode,
          numbers: cleanPhone,
        }),
      });
      const data = await res.json();
      if (data.return) {
        return {
          success: true,
          provider: 'Fast2SMS',
          message: `Real SMS OTP dispatched to ${cleanPhone} via Fast2SMS Indian Gateway.`,
          otpCode,
        };
      }
      console.error('[SMS: Fast2SMS] Error response:', data);
    } catch (err) {
      console.error('[SMS: Fast2SMS] Network exception:', err);
    }
  }

  // 2. Twilio Global SMS
  if (config.smsProvider === 'twilio' && config.twilioAccountSid && config.twilioAuthToken && config.twilioPhoneNumber) {
    try {
      console.log(`[SMS: Twilio] Sending real OTP ${otpCode} to +91${cleanPhone}`);
      const auth = Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString('base64');
      const params = new URLSearchParams({
        To: `+91${cleanPhone}`,
        From: config.twilioPhoneNumber,
        Body: `[MandiFlow] Your Kisan Verification OTP is ${otpCode}. Valid for 10 minutes. Do not share with anyone.`,
      });

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
      const data = await res.json();
      if (data.sid) {
        return {
          success: true,
          provider: 'Twilio',
          message: `Real SMS OTP dispatched to +91${cleanPhone} via Twilio SID: ${data.sid}`,
          otpCode,
        };
      }
      console.error('[SMS: Twilio] Error response:', data);
    } catch (err) {
      console.error('[SMS: Twilio] Network exception:', err);
    }
  }

  // 3. Fallback / Mock delivery with terminal broadcast
  console.log(`[SMS: Mock / Sandbox] Generated Kisan OTP for +91 ${cleanPhone}: 👉 [ ${otpCode} ] 👈`);
  return {
    success: true,
    provider: 'Simulated Kisan Gateway (Sandbox)',
    message: `Kisan OTP generated for ${cleanPhone}. Demo Code: ${otpCode}`,
    otpCode,
  };
}

export interface SendSmsAlertResult {
  success: boolean;
  provider: string;
  messageText: string;
  phoneNumber: string;
}

export async function sendReadyToSellSms(
  farmerName: string,
  phoneNumber: string,
  quantityQ: number,
  commodity: string,
  expectedPricePerQ: number,
  hubVillage: string
): Promise<SendSmsAlertResult> {
  const cleanPhone = phoneNumber.replace(/[^0-9]/g, '').slice(-10);
  const messageBody = `[MandiFlow / e-NAM Alert] Dear ${farmerName}, your reported quantity of ${quantityQ} Quintals of ${commodity} is now READY TO SELL! Expected clearing price: ₹${expectedPricePerQ.toLocaleString()}/Q. Reefer collection truck assigned at ${hubVillage} Hub.`;

  // 1. Fast2SMS Indian SMS Gateway
  if (config.smsProvider === 'fast2sms' && config.fast2SmsApiKey) {
    try {
      console.log(`[SMS: Fast2SMS] Dispatching Ready-to-Sell Alert to +91 ${cleanPhone}: "${messageBody}"`);
      const res = await fetch('https://www.fast2sms.com/dev/bulkV2', {
        method: 'POST',
        headers: {
          authorization: config.fast2SmsApiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          route: 'q',
          message: messageBody,
          numbers: cleanPhone,
        }),
      });
      const data = await res.json();
      if (data.return) {
        return {
          success: true,
          provider: 'Fast2SMS Indian Gateway',
          messageText: messageBody,
          phoneNumber: cleanPhone,
        };
      }
      console.error('[SMS: Fast2SMS] Error:', data);
    } catch (err) {
      console.error('[SMS: Fast2SMS] Exception:', err);
    }
  }

  // 2. Twilio Global SMS
  if (config.smsProvider === 'twilio' && config.twilioAccountSid && config.twilioAuthToken && config.twilioPhoneNumber) {
    try {
      console.log(`[SMS: Twilio] Dispatching Ready-to-Sell Alert to +91${cleanPhone}: "${messageBody}"`);
      const auth = Buffer.from(`${config.twilioAccountSid}:${config.twilioAuthToken}`).toString('base64');
      const params = new URLSearchParams({
        To: `+91${cleanPhone}`,
        From: config.twilioPhoneNumber,
        Body: messageBody,
      });

      const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${config.twilioAccountSid}/Messages.json`, {
        method: 'POST',
        headers: {
          Authorization: `Basic ${auth}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: params.toString(),
      });
      const data = await res.json();
      if (data.sid) {
        return {
          success: true,
          provider: 'Twilio Gateway',
          messageText: messageBody,
          phoneNumber: cleanPhone,
        };
      }
      console.error('[SMS: Twilio] Error:', data);
    } catch (err) {
      console.error('[SMS: Twilio] Exception:', err);
    }
  }

  // 3. Fallback / Mock delivery with terminal broadcast
  console.log(`\n=================================================================`);
  console.log(`📱 [SMS NOTIFICATION DISPATCHED: READY TO SELL]`);
  console.log(`   To: +91 ${cleanPhone} (${farmerName})`);
  console.log(`   Message: "${messageBody}"`);
  console.log(`   Status: DELIVERED (Simulated Kisan Gateway Sandbox)`);
  console.log(`=================================================================\n`);

  return {
    success: true,
    provider: 'Simulated Kisan Gateway (Sandbox)',
    messageText: messageBody,
    phoneNumber: cleanPhone,
  };
}

