import { supabase } from './supabase/config.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function createOrdersTable() {
  try {
    console.log('Creating orders table...');

    const sqlPath = path.join(__dirname, 'database', 'orders_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements
    const statements = sql.split(';').filter(stmt => stmt.trim().length > 0);

    for (const statement of statements) {
      if (statement.trim()) {
        console.log('Executing:', statement.trim().substring(0, 50) + '...');

        const { error } = await supabase.rpc('exec_sql', { sql: statement.trim() + ';' });

        if (error) {
          console.error('Error executing statement:', error);
          // Continue with other statements even if one fails
        }
      }
    }

    console.log('Orders table creation completed!');
  } catch (error) {
    console.error('Error creating orders table:', error);
  }
}

createOrdersTable();