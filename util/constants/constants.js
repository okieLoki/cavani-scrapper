import dotenv from 'dotenv';

dotenv.config();

const constants = {
    PORT: process.env.PORT || 3000,
}

export default constants;
