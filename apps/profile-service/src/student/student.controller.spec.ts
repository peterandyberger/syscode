import { StudentController } from './student.controller';

describe('StudentController', () => {
  const student = { id: 'id-1', name: 'Peter', email: 'peter@example.com' };

  it('returns student with address when address-service responds', async () => {
    const studentService = {
      getById: jest.fn().mockResolvedValue(student),
    };

    const addressClient = {
      get: jest.fn().mockResolvedValue({
        country: 'HU',
        city: 'Budapest',
        street: 'Main',
        zip: '1234',
      }),
    };

    const controller = new StudentController(
      studentService as any,
      addressClient as any,
    );

    const res = await controller.getWithAddress('id-1');

    expect(studentService.getById).toHaveBeenCalledWith('id-1');
    expect(res.address).toBeTruthy();
    expect(res.address?.city).toBe('Budapest');
  });

  it('returns address=null when address-service fails', async () => {
    const studentService = {
      getById: jest.fn().mockResolvedValue(student),
    };

    const addressClient = {
      get: jest.fn().mockRejectedValue(new Error('down')),
    };

    const controller = new StudentController(
      studentService as any,
      addressClient as any,
    );

    const res = await controller.getWithAddress('id-1');

    expect(res.id).toBe('id-1');
    expect(res.address).toBeNull();
  });
  it('calls service methods for basic crud routes', async () => {
    const studentService = {
      list: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({ id: '1' }),
      update: jest.fn().mockResolvedValue({ id: '1' }),
      remove: jest.fn().mockResolvedValue(undefined),
      getById: jest.fn(),
    };

    const addressClient = { get: jest.fn() };

    const controller = new StudentController(
      studentService as any,
      addressClient as any,
    );

    await controller.list();
    await controller.create({ name: 'A', email: 'a@b.com' } as any);
    await controller.update('1', { name: 'B' } as any);
    await controller.remove('1');

    expect(studentService.list).toHaveBeenCalled();
    expect(studentService.create).toHaveBeenCalled();
    expect(studentService.update).toHaveBeenCalledWith('1', expect.anything());
    expect(studentService.remove).toHaveBeenCalledWith('1');
  });
});
