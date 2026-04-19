import { uuidv4, formatDate, formatRelativeDate, isOverdue, getInitials } from '@/lib/utils';

describe('Utils', () => {
  describe('uuidv4', () => {
    it('should generate a valid UUID v4', () => {
      const uuid = uuidv4();
      expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);
    });

    it('should generate unique UUIDs', () => {
      const uuid1 = uuidv4();
      const uuid2 = uuidv4();
      expect(uuid1).not.toBe(uuid2);
    });
  });

  describe('formatDate', () => {
    it('should format a date string to Dutch locale', () => {
      const date = '2025-01-15';
      const formatted = formatDate(date, { day: 'numeric', month: 'long', year: 'numeric' });
      expect(formatted).toContain('2025');
    });

    it('should format a Date object', () => {
      const date = new Date('2025-01-15');
      const formatted = formatDate(date, { day: 'numeric', month: 'long' });
      expect(formatted).toContain('januari');
    });
  });

  describe('formatRelativeDate', () => {
    it('should return "Vandaag" for today', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(formatRelativeDate(today)).toBe('Vandaag');
    });

    it('should return "Morgen" for tomorrow', () => {
      const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      expect(formatRelativeDate(tomorrow)).toBe('Morgen');
    });

    it('should return "Gisteren" for yesterday', () => {
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      expect(formatRelativeDate(yesterday)).toBe('Gisteren');
    });
  });

  describe('isOverdue', () => {
    it('should return true for past dates', () => {
      const pastDate = '2020-01-01';
      expect(isOverdue(pastDate)).toBe(true);
    });

    it('should return false for future dates', () => {
      const futureDate = '2030-01-01';
      expect(isOverdue(futureDate)).toBe(false);
    });

    it('should return false for today', () => {
      const today = new Date().toISOString().split('T')[0];
      expect(isOverdue(today)).toBe(false);
    });
  });

  describe('getInitials', () => {
    it('should return initials from a single name', () => {
      expect(getInitials('Papa')).toBe('P');
    });

    it('should return initials from multiple names', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    it('should return uppercase initials', () => {
      expect(getInitials('john doe')).toBe('JD');
    });

    it('should handle more than two names', () => {
      expect(getInitials('John Jacob Jingleheimer')).toBe('JJ');
    });
  });
});
