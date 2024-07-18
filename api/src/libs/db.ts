import { DataSource } from 'typeorm';
import User from '../entity/user';

export const AppDataSource = new DataSource({
  type: 'sqlite',
  database: 'db.sqlite',
  entities: [User],
  synchronize: true,
});
export const UserRepository = AppDataSource.getRepository(User);
