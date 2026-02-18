import axios from 'axios';
import { prisma } from './db';

export async function sendNotification(phone: string, message: string, channels: ('SMS' | 'WHATSAPP' | 'VIBER')[]) {
    // Fetch settings from DB
    const companyInfo = await prisma.companyInfo.findFirst();

    const settings = {
        apiKey: companyInfo?.infobipApiKey || process.env.INFOBIP_API_KEY,
        baseUrl: companyInfo?.infobipBaseUrl || process.env.INFOBIP_BASE_URL,
        sender: companyInfo?.infobipSender || process.env.INFOBIP_SENDER || 'Info',
    };

    if (!settings.apiKey || !settings.baseUrl) {
        console.warn('Infobip API Key or Base URL missing in Settings. Notification skipped.');
        return { success: false, error: 'Configuration missing' };
    }

    try {
        const results = [];

        // Simple SMS implementation for MVP
        if (channels.includes('SMS')) {
            const response = await axios.post(
                `${settings.baseUrl}/sms/2/text/advanced`,
                {
                    messages: [
                        {
                            destinations: [{ to: phone }],
                            from: settings.sender,
                            text: message,
                        },
                    ],
                },
                {
                    headers: {
                        Authorization: `App ${settings.apiKey}`,
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                }
            );
            results.push({ channel: 'SMS', data: response.data });
        }

        // Placeholder for WhatsApp/Viber (requires verified sender)

        return { success: true, results };
    } catch (error: any) {
        console.error('Infobip Error:', error.response?.data || error.message);
        return { success: false, error: error.message };
    }
}
