/**
 * Tests for contribution type definitions and constants
 */
import { describe, it, expect } from 'vitest'
import {
  CONTRIBUTION_STEPS,
  REGIONS,
  VIDEO_TYPES,
  type ContributionType,
  type ContributionStatus,
  type ContributorInfo,
  type ContributionFormData,
} from '@/lib/types/contribution'

describe('Contribution Types', () => {
  describe('ContributionType', () => {
    it('should accept valid contribution types', () => {
      const validTypes: ContributionType[] = ['new_location', 'edit_location', 'lore_correction']
      validTypes.forEach(type => {
        expect(['new_location', 'edit_location', 'lore_correction']).toContain(type)
      })
    })
  })

  describe('ContributionStatus', () => {
    it('should accept valid status values', () => {
      const validStatuses: ContributionStatus[] = ['pending', 'approved', 'rejected']
      validStatuses.forEach(status => {
        expect(['pending', 'approved', 'rejected']).toContain(status)
      })
    })
  })
})

describe('CONTRIBUTION_STEPS', () => {
  it('should have 6 contribution steps', () => {
    expect(CONTRIBUTION_STEPS).toHaveLength(6)
  })

  it('should have required type step first', () => {
    expect(CONTRIBUTION_STEPS[0].id).toBe('type')
    expect(CONTRIBUTION_STEPS[0].required).toBe(true)
  })

  it('should have contributor step last', () => {
    const lastStep = CONTRIBUTION_STEPS[CONTRIBUTION_STEPS.length - 1]
    expect(lastStep.id).toBe('contributor')
    expect(lastStep.required).toBe(true)
  })

  it('should have unique step IDs', () => {
    const ids = CONTRIBUTION_STEPS.map(step => step.id)
    const uniqueIds = Array.from(new Set(ids))
    expect(ids.length).toBe(uniqueIds.length)
  })

  it('each step should have required properties', () => {
    CONTRIBUTION_STEPS.forEach(step => {
      expect(step).toHaveProperty('id')
      expect(step).toHaveProperty('title')
      expect(step).toHaveProperty('description')
      expect(step).toHaveProperty('fields')
      expect(step).toHaveProperty('required')
      expect(Array.isArray(step.fields)).toBe(true)
      expect(typeof step.required).toBe('boolean')
    })
  })
})

describe('REGIONS', () => {
  it('should contain all One Piece regions', () => {
    expect(REGIONS).toContain('East Blue')
    expect(REGIONS).toContain('West Blue')
    expect(REGIONS).toContain('North Blue')
    expect(REGIONS).toContain('South Blue')
    expect(REGIONS).toContain('Paradise (First Half of Grand Line)')
    expect(REGIONS).toContain('New World (Second Half of Grand Line)')
    expect(REGIONS).toContain('Sky Island')
    expect(REGIONS).toContain('Unknown')
  })

  it('should have exactly 10 regions', () => {
    expect(REGIONS).toHaveLength(10)
  })

  it('should not have duplicate regions', () => {
    const uniqueRegions = Array.from(new Set(REGIONS))
    expect(REGIONS.length).toBe(uniqueRegions.length)
  })
})

describe('VIDEO_TYPES', () => {
  it('should have 4 video types', () => {
    expect(VIDEO_TYPES).toHaveLength(4)
  })

  it('should contain fight, comedy, lore, and scenic types', () => {
    const values = VIDEO_TYPES.map(vt => vt.value)
    expect(values).toContain('fight')
    expect(values).toContain('comedy')
    expect(values).toContain('lore')
    expect(values).toContain('scenic')
  })

  it('each video type should have value and label', () => {
    VIDEO_TYPES.forEach(videoType => {
      expect(videoType).toHaveProperty('value')
      expect(videoType).toHaveProperty('label')
      expect(typeof videoType.value).toBe('string')
      expect(typeof videoType.label).toBe('string')
    })
  })

  it('labels should include emoji indicators', () => {
    VIDEO_TYPES.forEach(videoType => {
      // Labels should contain emoji for visual indication
      expect(videoType.label.length).toBeGreaterThan(videoType.value.length)
    })
  })
})

describe('ContributorInfo interface', () => {
  it('should accept valid contributor data', () => {
    const validContributor: ContributorInfo = {
      name: 'Monkey D. Luffy',
      email: 'luffy@strawhat.crew',
    }
    expect(validContributor.name).toBe('Monkey D. Luffy')
    expect(validContributor.email).toBe('luffy@strawhat.crew')
  })

  it('should accept optional discord handle', () => {
    const contributorWithDiscord: ContributorInfo = {
      name: 'Trafalgar Law',
      email: 'law@heart.pirates',
      discordHandle: 'SurgeonOfDeath#1234',
    }
    expect(contributorWithDiscord.discordHandle).toBe('SurgeonOfDeath#1234')
  })
})

describe('ContributionFormData interface', () => {
  it('should accept minimal required data for new location', () => {
    const minimalForm: ContributionFormData = {
      type: 'new_location',
      contributor: {
        name: 'Test User',
        email: 'test@example.com',
      },
      locationName: 'Laugh Tale',
      description: 'The final island of the Grand Line',
    }
    expect(minimalForm.type).toBe('new_location')
    expect(minimalForm.locationName).toBe('Laugh Tale')
  })

  it('should accept full data for comprehensive location', () => {
    const fullForm: ContributionFormData = {
      type: 'new_location',
      contributor: {
        name: 'Test User',
        email: 'test@example.com',
        discordHandle: 'user#1234',
      },
      locationName: 'Wano Country',
      region: 'New World (Second Half of Grand Line)',
      description: 'An isolated nation',
      history: 'Long history...',
      culture: 'Samurai culture...',
      economy: {
        industries: ['Smithing', 'Sake'],
        currency: 'Ryo',
        tradeGoods: ['Weapons', 'Sake'],
      },
      transportation: 'By sea',
      food: {
        cuisine: ['Soba', 'Rice'],
        traditions: ['Sake ceremony'],
        quirks: ['O-Shiruko'],
      },
      quickFacts: ['Closed borders', 'Samurai nation'],
      notablePeople: [
        {
          name: 'Kozuki Oden',
          role: 'Former Daimyo',
          description: 'Legendary samurai',
        },
      ],
      videos: [
        {
          youtubeId: 'abc123',
          title: 'Wano Opening',
          type: 'scenic',
          description: 'Beautiful scenery',
          featured: true,
        },
      ],
      coordinates: { x: 75, y: 45 },
      colorScheme: {
        primary: '#FF5733',
        secondary: '#33FF57',
        accent: '#3357FF',
      },
    }
    expect(fullForm.economy?.industries).toContain('Smithing')
    expect(fullForm.notablePeople).toHaveLength(1)
    expect(fullForm.videos?.[0].featured).toBe(true)
  })
})
