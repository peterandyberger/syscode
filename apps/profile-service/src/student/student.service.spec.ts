import { NotFoundException } from '@nestjs/common';
import { StudentService } from './student.service';

describe('StudentService', () => {
  let service: StudentService;

  beforeEach(() => {
    service = new StudentService();
  });

  it('should create a student', () => {
    const student = service.create({
      name: 'Peter',
      email: 'peter@example.com',
    });

    expect(student.id).toBeDefined();
    expect(student.name).toBe('Peter');
    expect(student.email).toBe('peter@example.com');
  });

  it('should list students', () => {
    service.create({ name: 'A', email: 'a@test.com' });
    const list = service.list();

    expect(list.length).toBe(1);
  });

  it('should update existing student', () => {
    const student = service.create({
      name: 'Peter',
      email: 'peter@example.com',
    });

    const updated = service.update(student.id, {
      name: 'Peter Updated',
    });

    expect(updated.name).toBe('Peter Updated');
  });

  it('should throw if updating non-existing student', () => {
    expect(() => service.update('non-existing-id', { name: 'X' })).toThrow(
      NotFoundException,
    );
  });

  it('should delete student', () => {
    const student = service.create({
      name: 'Peter',
      email: 'peter@example.com',
    });

    service.remove(student.id);

    expect(service.list().length).toBe(0);
  });
});
