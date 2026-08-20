import { NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindOptionsWhere,
  ObjectLiteral,
  Repository,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

type UserOwnedEntity = ObjectLiteral & {
  id: number;
  user?: User;
};

export class UserScopedRepository<T extends UserOwnedEntity> {
  constructor(
    private readonly repository: Repository<T>,
    private readonly entityName: string,
  ) {}

  create(data: DeepPartial<T>, userId: number) {
    const entity = this.repository.create({
      ...data,
      user: { id: userId },
    } as DeepPartial<T>);

    return this.repository.save(entity);
  }

  findAll(userId: number) {
    return this.repository.find({
      where: {
        user: { id: userId },
      } as FindOptionsWhere<T>,
    });
  }

  async findOne(id: number, userId: number) {
    const entity = await this.repository.findOne({
      where: {
        id,
        user: { id: userId },
      } as FindOptionsWhere<T>,
    });

    if (!entity) {
      throw new NotFoundException(`${this.entityName} with ID ${id} not found`);
    }

    return entity;
  }

  async update(id: number, data: DeepPartial<T>, userId: number) {
    const entity = await this.findOne(id, userId);

    this.repository.merge(entity, data);

    return this.repository.save(entity);
  }

  async remove(id: number, userId: number) {
    const entity = await this.findOne(id, userId);

    return this.repository.remove(entity);
  }
}
