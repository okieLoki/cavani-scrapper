import dotenv from 'dotenv';

dotenv.config();

const constants = {
    PORT: process.env.PORT || 3002,
}

export default constants;
