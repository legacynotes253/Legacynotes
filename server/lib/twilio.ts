import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhone = process.env.TWILIO_PHONE_NUMBER;

export const twilioClient = accountSid && authToken ? twilio(accountSid, authToken) : null;

export async function sendSms(to: string, message: string) {
  if (!twilioClient) {
    console.warn('Twilio client not initialized. Check your environment variables.');
    return;
  }

  try {
    await twilioClient.messages.create({
      body: message,
      from: fromPhone,
      to,
    });
    console.log(`SMS sent to ${to}`);
  } catch (error) {
    console.error(`Failed to send SMS to ${to}:`, error);
    throw error;
  }
}
