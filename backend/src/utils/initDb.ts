import fs from 'fs';
import path from 'path';
import pool from './database';

async function initializeDatabase() {
    try {
        // @read the SQL file
        const sqlPath = path.join(__dirname, 'init.sql');
        const sqlContent = fs.readFileSync(sqlPath, 'utf8');

        // @execute the SQL commands
        await pool.query(sqlContent);
        
        console.log('Database initialized successfully!');
    } catch (error) {
        console.error('Error initializing database:', error);
        throw error;
    } finally {
        // @close the pool
        await pool.end();
    }
}

// @run the initialization if this file is run directly
if (require.main === module) {
    initializeDatabase()
        .then(() => process.exit(0))
        .catch(() => process.exit(1));
}

export default initializeDatabase;