import dotenv from 'dotenv';

dotenv.config();

const constants = {
    PORT: process.env.PORT || 3030,
}

export default constants;
