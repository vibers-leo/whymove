import { Pool } from 'pg';
import { readFileSync } from 'fs';
import { join } from 'path';

const pool = new Pool({
  connectionString: 'postgresql://vibers:vibers2026secure@49.50.138.93:5433/vibers_main',
});

async function init() {
  const sql = readFileSync(join(process.cwd(), 'lib/schema.sql'), 'utf-8');
  await pool.query(sql);
  console.log('✅ whymove schema created');
  await pool.end();
}

init().catch(console.error);
