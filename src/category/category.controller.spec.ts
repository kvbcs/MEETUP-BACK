import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';
import { CategoryService } from './category.service';
import { InsertCategoryDto, UpdateCategoryDto } from './dto';

describe('CategoryService', () => {
  let service: CategoryService;
  let prisma: PrismaService;

  // On va mocker les fonctions natives de prisma
  const mockPrismaService = {
    category: {
      findMany: jest.fn(),
      create: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  // Comme pour le contrôleur, avant chaque modif on recrée le module
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoryService,
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('getAllCategories', () => {
    it('should return a list of categories', async () => {
      const expectedResult = [
        { id: 'categoryId', name: 'test', image: 'test' },
      ];

      // On va mocker la fonction findMany de prisma et s'assurer qu'elle est jouée
      mockPrismaService.category.findMany.mockImplementation(() =>
        Promise.resolve(expectedResult),
      );

      const result = await service.getAllCategories();
      expect(result).toEqual(expectedResult);
      // On vérifie que la fonction a été jouée et que les paramètres sont corrects
      expect(prisma.category.findMany).toHaveBeenCalledWith({
        orderBy: { name: 'asc' },
        select: { id: true, name: true, image: true },
      });
    });
  });

  describe('createCategory', () => {
    it('should create a new promo code', async () => {
      const dto: InsertCategoryDto = { name: 'test', image: 'test' };
      const expectedResult = { id: 'unIdSurprenant', ...dto };

      mockPrismaService.category.create.mockImplementation(() =>
        Promise.resolve(expectedResult),
      );

      const result = await service.addCategory(dto);
      expect(result).toEqual(expectedResult);
      expect(prisma.category.create).toHaveBeenCalledWith({
        data: { name: dto.name, image: dto.image },
      });
    });
  });

  describe('editCategoryById', () => {
    it('should update a promo code by ID', async () => {
      const dto: UpdateCategoryDto = { name: 'test', image: 'test' };
      const categoryId = 'categoryId';
      const expectedResult = { id: categoryId, ...dto };

      mockPrismaService.category.findUnique.mockImplementation(() =>
        Promise.resolve(expectedResult),
      );
      mockPrismaService.category.update.mockImplementation(() =>
        Promise.resolve(expectedResult),
      );

      const result = await service.updateCategory(categoryId, dto);
      expect(result).toEqual(expectedResult);
      expect(prisma.category.update).toHaveBeenCalledWith({
        where: { id: categoryId },
        data: { ...dto },
      });
    });

    it('should throw ForbiddenException if the promo code does not exist', async () => {
      const dto: InsertCategoryDto = { name: 'test', image: 'test' };
      const categoryId = 'invalidId';

      // Mock findUnique to resolve with null
      mockPrismaService.category.findUnique.mockImplementation(() =>
        Promise.resolve(null),
      );

      await expect(service.updateCategory(categoryId, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('deleteCategoryById', () => {
    it('should delete a promo code by ID', async () => {
      const categoryId = 'categoryId';

      // Mock findUnique and delete to resolve promises
      mockPrismaService.category.findUnique.mockImplementation(() =>
        Promise.resolve({ id: categoryId }),
      );
      mockPrismaService.category.delete.mockImplementation(() =>
        Promise.resolve(undefined),
      );

      const result = await service.deleteCategory(categoryId);
      expect(result).toBeUndefined();
      expect(prisma.category.delete).toHaveBeenCalledWith({
        where: { id: categoryId },
      });
    });

    it('should throw ForbiddenException if promo code cannot be deleted', async () => {
      const categoryId = 'invalidId';

      mockPrismaService.category.findUnique.mockImplementation(() =>
        Promise.resolve(null),
      );

      await expect(service.deleteCategory(categoryId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
