import mongoose from 'mongoose';

export const dbConnect = async (DB_USER: string, DB_PASSWORD: string, DB_HOST: string, DB_PORT: string, DB_NAME: string) => {
    await mongoose.connect(`mongodb://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?authSource=admin`).then(
        () => { console.log('DB connected'); }
    ).catch(
        err => { console.log('DB connection error: ', err) }
    );
};