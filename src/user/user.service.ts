import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllUsers() {
    const query =
      'SELECT id, firstName, lastName, email, password, roleId, isActive, createdAt, updatedAt FROM user ORDER BY createdAt';
    const fetchUsers = await this.databaseService.query(query);
    return {
      users: fetchUsers,
    };
  }

  async getOneUser(id: string) {
    const query = 'SELECT * FROM user WHERE id = ?';
    const user = await this.databaseService.query(query, [id]);
    if (!user) {
      throw new ForbiddenException("User doesn't exist");
    }
    return user;
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const existingUserQuery = 'SELECT id FROM user WHERE id = ?';

    // Vérifier si l'utilisateur existe
    const existingUser = await this.databaseService.query(existingUserQuery, [
      id,
    ]);
    if (!existingUser) {
      throw new ForbiddenException("User doesn't exist");
    }

    // Préparer la mise à jour
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

    // Vérifier s'il y a des champs à mettre à jour
    if (fieldsToUpdate.length === 0) {
      throw new ForbiddenException('No fields to update');
    }

    const updateUserQuery = `UPDATE user SET ${fieldsToUpdate.join(', ')} WHERE id = ?`;
    values.push(id); // Ajouter l'ID à la fin des valeurs

    // Mettre à jour l'utilisateur
    await this.databaseService.query(updateUserQuery, values);

    return {
      message: 'User updated!',
      updatedUser: { id, ...dto }, // Inclure les nouvelles données dans la réponse
    };
  }

  async deleteUser(id: string) {
    const existingUserQuery = 'SELECT id FROM user WHERE id = ?';
    const deleteAgendaEventsQuery =
      'DELETE FROM agenda_has_event WHERE agendaId IN (SELECT id FROM agenda WHERE userId = ?)';
    const deleteAgendaQuery = 'DELETE FROM agenda WHERE userId = ?';
    const deleteUserQuery = 'DELETE FROM user WHERE id = ?';

    // Vérifier si l'utilisateur existe
    const existingUser = await this.databaseService.query(existingUserQuery, [
      id,
    ]);
    if (!existingUser) {
      throw new ForbiddenException("User doesn't exist");
    }

    // Supprimer les produits dans le panier
    const deletedAgendaEvents = await this.databaseService.query(
      deleteAgendaEventsQuery,
      [id],
    );

    // Supprimer le panier
    const deletedAgenda = await this.databaseService.query(deleteAgendaQuery, [
      id,
    ]);

    // Supprimer l'utilisateur
    const deletedUser = await this.databaseService.query(deleteUserQuery, [id]);

    return {
      message: 'User deleted!',
      deletedUser: deletedUser,
      deletedAgendaEvents: deletedAgendaEvents,
      deletedAgenda: deletedAgenda,
    };
  }
}
