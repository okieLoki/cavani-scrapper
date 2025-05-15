import Tesseract from 'tesseract.js';
import sharp from 'sharp';
import logger from '../../util/logger/logger.js';

class CaptchaSolverService {
    // async preprocessCaptcha(inputPath, outputPath) {
    //     try {
    //         await sharp(inputPath)
    //             .grayscale()
    //             .resize(300, 100, { fit: 'fill' })
    //             .normalize()
    //             .sharpen()
    //             .threshold(150)
    //             .toFile(outputPath);
    //     } catch (error) {
    //         logger.error('Error preprocessing captcha:', error);
    //         throw error;
    //     }
    // }

    async preprocessCaptcha(inputPath, outputPath) {
        try {
            const imageBuffer = await sharp(inputPath)
                .grayscale()
                .negate() // Invert like ImageOps.invert
                .threshold(150)
                .toBuffer();

            await sharp(imageBuffer).toFile(outputPath);
        } catch (error) {
            logger.error('Error during preprocessing:', error);
            throw error;
        }
    }

    async solveCaptcha(imagePath) {
        try {
            const { data: { text } } = await Tesseract.recognize(imagePath, 'eng', {
                logger: m => logger.info(`OCR ${m.status}: ${Math.round(m.progress * 100)}%`),
                tessedit_char_whitelist: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
                tessedit_pageseg_mode: Tesseract.PSM.SINGLE_LINE,
                tessedit_ocr_engine_mode: Tesseract.OEM.LSTM_ONLY
            });

            const cleaned = text.replace(/[^a-zA-Z0-9]/g, '').trim();
            console.log(cleaned)
            logger.info('Cleaned OCR Text:', cleaned);

            return cleaned;
        } catch (error) {
            logger.error('Error during OCR:', error);
            throw error;
        }
    }

}

export default new CaptchaSolverService();
