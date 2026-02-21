import { NotFoundException } from '@nestjs/common';
import { StudentService } from './student.service';
import { StudentEntity } from './student.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
jest.mock('crypto', () => ({
  randomUUID: jest.fn(() => 'uuid-1'),
}));
describe('StudentService', () => {
  let service: StudentService;
  let repo: jest.Mocked<Partial<Repository<StudentEntity>>>;
  beforeEach(async () => {
    repo = {
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
      findOneBy: jest.fn(),
      delete: jest.fn(),
    };
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StudentService,
        {
          provide: getRepositoryToken(StudentEntity),
          useValue: repo,
        },
      ],
    }).compile();
    service = module.get<StudentService>(StudentService);
  });

  it('should create a student', async () => {
    const dto = { name: 'Peter', email: 'peter@example.com' };
    const created = { id: 'uuid-1', ...dto } as StudentEntity;
    (repo.create as jest.Mock).mockReturnValue(created);
    (repo.save as jest.Mock).mockResolvedValue(created);
    const result = await service.create(dto as any);
    expect(repo.create).toHaveBeenCalledWith({
      id: 'uuid-1',
      name: 'Peter',
      email: 'peter@example.com',
    });
    expect(repo.save).toHaveBeenCalledWith(created);
    expect(result).toEqual(created);
  });

  it('should update existing student', async () => {
    const existing = {
      id: 'uuid-1',
      name: 'OldPeter',
      email: 'oldpeter@example.com',
    } as StudentEntity;
    const saved = {
      id: 'uuid-1',
      name: 'NewPeter',
      email: 'oldpeter@example.com',
    } as StudentEntity;
    (repo.findOneBy as jest.Mock).mockResolvedValue(existing);
    (repo.save as jest.Mock).mockResolvedValue(saved);
    const result = await service.update('uuid-1', { name: 'NewPeter' } as any);
    expect(repo.findOneBy).toHaveBeenCalledWith({ id: 'uuid-1' });
    expect(repo.save).toHaveBeenCalledWith(existing);
    expect(result).toEqual(saved);
  });

  it('should throw if updating non-existing student', async () => {
    (repo.delete as jest.Mock).mockResolvedValue({ affected: 0 });
    await expect(service.remove('missing-id')).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should delete student', async () => {
    (repo.delete as jest.Mock).mockResolvedValue({ affected: 1 });
    await expect(service.remove('uuid-1')).resolves.toBeUndefined();
    expect(repo.delete).toHaveBeenCalledWith('uuid-1');
  });
});
