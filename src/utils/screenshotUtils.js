import * as htmlToImage from 'html-to-image';

export const captureScreenshot = async (elementId) => {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error(`Element with id '${elementId}' not found`);
    return null;
  }

  try {
    console.log('Starting screenshot capture with html-to-image for:', elementId);

    // Using toPng from html-to-image
    const dataUrl = await htmlToImage.toPng(element, {
      quality: 0.95,
      backgroundColor: '#f8fafc', // Match bg-slate-50
      filter: (node) => {
        // Exclude elements with the ignore class
        if (node.classList && node.classList.contains('no-print')) {
          return false;
        }
        return true;
      }
    });

    console.log('Screenshot captured successfully');
    return dataUrl;
  } catch (error) {
    console.error('FULL Error capturing screenshot:', error);
    if (error.message) console.error('Error Message:', error.message);
    return null;
  }
};
