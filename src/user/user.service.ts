import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto } from './dto';
import { DatabaseService } from 'src/database/database.service';

@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getAllUsers() {
    const query = 'SELECT id, name, email FROM user ORDER BY createdAt';
    return this.databaseService.query(query);
  }

  async getOneUser(id: string) {
    const query = 'SELECT id, name, email FROM user WHERE id = ?';
    return this.databaseService.query(query, [id]);
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

    if (dto.name) {
      fieldsToUpdate.push('name = ?');
      values.push(dto.name);
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
    const deleteCartProductsQuery =
      'DELETE FROM cart_has_product WHERE cart_id IN (SELECT id FROM cart WHERE user_id = ?)';
    const deleteCartQuery = 'DELETE FROM cart WHERE user_id = ?';
    const deleteUserQuery = 'DELETE FROM user WHERE id = ?';

    // Vérifier si l'utilisateur existe
    const existingUser = await this.databaseService.query(existingUserQuery, [
      id,
    ]);
    if (!existingUser) {
      throw new ForbiddenException("User doesn't exist");
    }

    // Supprimer les produits dans le panier
    const deletedCartProducts = await this.databaseService.query(
      deleteCartProductsQuery,
      [id],
    );

    // Supprimer le panier
    const deletedCart = await this.databaseService.query(deleteCartQuery, [id]);

    // Supprimer l'utilisateur
    const deletedUser = await this.databaseService.query(deleteUserQuery, [id]);

    return {
      message: 'User deleted!',
      deletedUser: deletedUser,
      deletedCartProducts: deletedCartProducts,
      deletedCart: deletedCart,
    };
  }
}
