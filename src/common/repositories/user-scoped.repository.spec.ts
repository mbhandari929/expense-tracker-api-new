import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Income } from '../../income/entities/income.entity';
import { UserScopedRepository } from './user-scoped.repository';

describe('UserScopedRepository', () => {
  const repositoryMock = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    merge: jest.fn(),
    remove: jest.fn(),
  };

  let repository: UserScopedRepository<Income>;

  const income = {
    id: 1,
    text: 'Salary',
    amount: 200000,
    date: '2026-08-13',
    user: { id: 7 },
  } as Income;

  beforeEach(() => {
    jest.clearAllMocks();

    repository = new UserScopedRepository(
      repositoryMock as unknown as Repository<Income>,
      'Income',
    );
  });

  it('creates data for the current user', async () => {
    const data = {
      text: 'Salary',
      amount: 200000,
      date: '2026-08-13',
    };

    repositoryMock.create.mockReturnValue(income);
    repositoryMock.save.mockResolvedValue(income);

    const result = await repository.create(data, 7);

    expect(repositoryMock.create).toHaveBeenCalledWith({
      ...data,
      user: { id: 7 },
    });

    expect(result).toEqual(income);
  });

  it('finds data only for the current user', async () => {
    repositoryMock.find.mockResolvedValue([income]);

    await repository.findAll(7);

    expect(repositoryMock.find).toHaveBeenCalledWith({
      where: {
        user: { id: 7 },
      },
    });
  });

  it('throws NotFoundException when data is not found', async () => {
    repositoryMock.findOne.mockResolvedValue(null);

    await expect(repository.findOne(1, 7)).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('updates data for the current user', async () => {
    repositoryMock.findOne.mockResolvedValue(income);
    repositoryMock.save.mockResolvedValue(income);

    await repository.update(1, { amount: 250000 }, 7);

    expect(repositoryMock.merge).toHaveBeenCalledWith(income, {
      amount: 250000,
    });

    expect(repositoryMock.save).toHaveBeenCalledWith(income);
  });

  it('removes data for the current user', async () => {
    repositoryMock.findOne.mockResolvedValue(income);
    repositoryMock.remove.mockResolvedValue(income);

    await repository.remove(1, 7);

    expect(repositoryMock.remove).toHaveBeenCalledWith(income);
  });
});
