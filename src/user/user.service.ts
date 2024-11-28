import { ForbiddenException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllUsers() {
    const query =
      'SELECT id, firstName, lastName, email, roleId, isActive, createdAt, updatedAt FROM user ORDER BY createdAt';
    const fetchUsers = await this.databaseService.query(query);
    return {
      users: fetchUsers,
    };
  }

  async getOneUser(id: string) {
    const query =
      'SELECT id, firstName, lastName, email, roleId, isActive, createdAt, updatedAt FROM user WHERE id = ?';
    const user = await this.databaseService.query(query, [id]);
    if (!user) {
      throw new ForbiddenException("User doesn't exist");
    }
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const existingUserQuery = 'SELECT id FROM user WHERE id = ?';
    const existingUser = await this.databaseService.query(existingUserQuery, [
      id,
    ]);
    if (!existingUser) {
      throw new ForbiddenException("User doesn't exist");
    }

    const fieldsToUpdate = [];
    const values = [];

    if (dto.firstName) {
      fieldsToUpdate.push('firstName = ?');
      values.push(dto.firstName);
    }
    if (dto.lastName) {
      fieldsToUpdate.push('lastName = ?');
      values.push(dto.lastName);
    }
    if (dto.email) {
      fieldsToUpdate.push('email = ?');
      values.push(dto.email);
    }
    if (dto.password) {
      fieldsToUpdate.push('password = ?');
      values.push(dto.password);
    }

    if (fieldsToUpdate.length === 0) {
      throw new ForbiddenException('No fields to update');
    }

    const updateUserQuery = `UPDATE user SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    values.push(id);

    await this.databaseService.query(updateUserQuery, values);

    return {
      message: 'User updated!',
      updatedUser: { id, ...dto },
    };
  }

  async deleteUser(id: string) {
    const existingUserQuery = 'SELECT id FROM user WHERE id = ?';
    const existingUser = await this.databaseService.query(existingUserQuery, [
      id,
    ]);
    if (!existingUser) {
      throw new ForbiddenException("User doesn't exist");
    }

    const deleteAgendaEventsQuery =
      'DELETE FROM agenda_has_event WHERE agendaId IN (SELECT id FROM agenda WHERE userId = ?)';
    await this.databaseService.query(deleteAgendaEventsQuery, [id]);

    const deleteAgendaQuery = 'DELETE FROM agenda WHERE userId = ?';
    await this.databaseService.query(deleteAgendaQuery, [id]);

    const deleteUserQuery = 'DELETE FROM user WHERE id = ?';
    await this.databaseService.query(deleteUserQuery, [id]);

    return {
      message: 'User deleted!',
    };
  }
}
