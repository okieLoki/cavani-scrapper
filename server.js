import express from 'express';
import constants from './util/constants/constants.js';
import logger from './util/logger/logger.js';
import errorHandler from './util/error-handler/errorHandler.js';
import scrapperRoutes from './routes/scrapperRoutes.js';

const app = express();

app.use(express.json());

app.use(scrapperRoutes);

app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
    });
});

// Error handler should be the last middleware
app.use(errorHandler);

app.listen(constants.PORT, () => {
    logger.info(`Server is running on port ${constants.PORT}`);
});