import { Connection, createConnection, getConnection, getConnectionOptions } from 'typeorm';

//(async () => await createConnection())();

export default async (): Promise<Connection> => {
    const defaultOptions = await getConnectionOptions();

    Object.assign(defaultOptions, {
        database: process.env.NODE_ENV === 'test' ? 'fin_api_test' : defaultOptions.database
    });

    return createConnection(defaultOptions);
}


