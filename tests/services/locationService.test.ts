import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { prisma } from '@/lib/db/prisma';
import fs from 'fs';

vi.mock('@/lib/db/prisma', () => ({
  prisma: {
    location: {
      findMany: vi.fn(),
      findUnique: vi.fn(),
    }
  }
}));

vi.mock('fs', () => ({
  default: {
    readFileSync: vi.fn(),
    readdirSync: vi.fn(),
  }
}));

describe('locationService', () => {
  afterEach(() => {
    vi.clearAllMocks();
    vi.unstubAllEnvs();
  });

  describe('Database Mode', () => {
    beforeEach(() => {
      vi.stubEnv('DATA_SOURCE', 'database');
      vi.resetModules();
    });

    it('getAllLocations returns mapped locations from prisma', async () => {
      const { getAllLocations } = await import('@/lib/data/locationService');
      const mockLocations = [
        {
          id: '1',
          slug: 'test-island',
          name: 'Test Island',
          region: 'East Blue',
          videos: [{ featured: true, url: 'test.mp4' }],
        }
      ];
      vi.mocked(prisma.location.findMany).mockResolvedValue(mockLocations as any);

      const result = await getAllLocations();
      expect(prisma.location.findMany).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('test-island');
      expect(result[0].featuredVideo).toEqual({ featured: true, url: 'test.mp4' });
    });

    it('getLocationBySlug returns location from prisma', async () => {
      const { getLocationBySlug } = await import('@/lib/data/locationService');
      const mockLocation = { slug: 'test-island', name: 'Test Island' };
      vi.mocked(prisma.location.findUnique).mockResolvedValue(mockLocation as any);

      const result = await getLocationBySlug('test-island');
      expect(prisma.location.findUnique).toHaveBeenCalledWith({
        where: { slug: 'test-island' },
        include: { videos: { orderBy: { order: 'asc' } } }
      });
      expect(result).toEqual(mockLocation);
    });
  });

  describe('Local Mode', () => {
    beforeEach(() => {
      vi.stubEnv('DATA_SOURCE', 'local');
      vi.resetModules();
    });

    it('getAllLocations returns mapped locations from file system', async () => {
      const { getAllLocations } = await import('@/lib/data/locationService');
      vi.mocked(fs.readdirSync).mockReturnValue(['test-island.json'] as any);
      const mockJsonData = JSON.stringify({
        slug: 'test-island',
        name: 'Test Island',
        region: 'East Blue',
        videos: [{ featured: true, url: 'test.mp4' }]
      });
      vi.mocked(fs.readFileSync).mockReturnValue(mockJsonData);

      const result = await getAllLocations();
      expect(fs.readdirSync).toHaveBeenCalled();
      expect(fs.readFileSync).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0].slug).toBe('test-island');
      expect(result[0].featuredVideo).toEqual({ featured: true, url: 'test.mp4' });
    });

    it('getAllLocations returns empty array on error', async () => {
      const { getAllLocations } = await import('@/lib/data/locationService');
      vi.mocked(fs.readdirSync).mockImplementation(() => { throw new Error('File read error'); });
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = await getAllLocations();
      expect(result).toEqual([]);
      consoleError.mockRestore();
    });

    it('getLocationBySlug returns parsed location from file system', async () => {
      const { getLocationBySlug } = await import('@/lib/data/locationService');
      const mockJsonData = JSON.stringify({
        slug: 'test-island',
        name: 'Test Island'
      });
      vi.mocked(fs.readFileSync).mockReturnValue(mockJsonData);

      const result = await getLocationBySlug('test-island');
      expect(result?.slug).toBe('test-island');
      expect(result?.name).toBe('Test Island');
    });

    it('getLocationBySlug returns null on error', async () => {
      const { getLocationBySlug } = await import('@/lib/data/locationService');
      vi.mocked(fs.readFileSync).mockImplementation(() => { throw new Error('File read error'); });
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      const result = await getLocationBySlug('invalid');
      expect(result).toBeNull();
      consoleError.mockRestore();
    });
  });
});
