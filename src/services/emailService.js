import emailjs from '@emailjs/browser';

// Service configuration - ideally these should be environment variables
// For now, we'll keep them here or ask user to provide them
const SERVICE_ID = 'service_6m1qprb';
const TEMPLATE_ID = 'template_86280iu';
const PUBLIC_KEY = 'UMsS3cji8xELzbkNQ';

export const sendScreenshotEmail = async (screenshotDataUrl, userEmail) => {
    // Simple check for placeholders
    if (!SERVICE_ID || SERVICE_ID === 'YOUR_SERVICE_ID') {
        console.warn('EmailJS Service ID not configured');
        return { success: false, error: 'Service not configured' };
    }

    try {
        const templateParams = {
            to_email: userEmail,
            message: 'Here is the latest dashboard report.',
            screenshot: screenshotDataUrl,
            current_date: new Date().toLocaleString()
        };

        const response = await emailjs.send(SERVICE_ID, TEMPLATE_ID, templateParams, PUBLIC_KEY);
        return { success: true, response };
    } catch (error) {
        console.error('Error sending email:', error);
        return { success: false, error };
    }
};
