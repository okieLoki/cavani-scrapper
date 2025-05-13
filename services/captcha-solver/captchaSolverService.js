import Tesseract from 'tesseract.js';
import logger from '../../util/logger/logger.js';
import sharp from 'sharp';

class CaptchaSolverService {

    async preprocessCaptcha(inputPath, outputPath){
        await sharp(inputPath)
            .grayscale()
            .threshold(150)
            .toFile(outputPath);
    }

    async solveCaptcha(imagePath){
        try {
            const { data : {text}} = await Tesseract.recognize(imagePath, 'eng', {
                logger: (m) => logger.info(m.status, m.progress),
            });
            return text.replace(/\s/g, '').trim();
        } catch (error) {
            logger.error('Error during OCR:', error);
            throw error;
        }
    }
}

export default new CaptchaSolverService();