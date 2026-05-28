import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  waitForConnections : true,
  connectionLimit:10,
  queueLimit: 0
});

let connection;

try{
     connection = await pool.getConnection();
    console.log(`conneection reussie sur le port ${process.env.DB_PORT}`);
}
catch (error){

    console.error("echec de la connection ");
    console.error("erreur " ,error.message);
    
}
finally {

  if (connection) {
    connection.release();
    
  } 

  

}


export default pool;