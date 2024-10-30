import * as mysql from 'mysql2/promise';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class DatabaseService {
  private connection: mysql.Connection;

  constructor(private readonly config: ConfigService) {
    this.init();
  }
  // On initialise la connexion de manière sécurisée
  // avec config pour les variables d'environnement
  async init() {
    this.connection = await mysql.createConnection({
      host: this.config.get<string>('DB_HOST') || 'localhost',
      user: this.config.get<string>('DB_USER') || 'root',
      port: this.config.get<number>('DB_PORT') || 3306,
      password: this.config.get<string>('DB_PASSWORD') || '',
      database: this.config.get<string>('DB_NAME') || 'brief8',
    });
    console.log('Connected to MySQL database');
  }

  // Une fonction query pour nos requêtes
  async query(query: string, params?: any[]) {
    const [results] = await this.connection.execute(query, params);
    return results;
  }

  // une fonction pour fermer la connexion
  async close() {
    await this.connection.end();
  }
}
