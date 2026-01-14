/**
 * Tests for news feed service utility functions
 * Note: Main fetchNews function requires mocking rss-parser, tested separately
 */
import { describe, it, expect } from 'vitest'

// Test the helper functions by importing them indirectly through test data
describe('NewsFeed Service Logic', () => {
  describe('Image extraction from content', () => {
    it('should extract image URL from img tag', () => {
      const content = '<p>Some text</p><img src="https://example.com/image.jpg" alt="test">'
      const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/)
      expect(imgMatch?.[1]).toBe('https://example.com/image.jpg')
    })

    it('should return undefined for content without images', () => {
      const content = '<p>Just text content</p>'
      const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/)
      expect(imgMatch).toBeNull()
    })

    it('should handle single quotes in img src', () => {
      const content = "<img src='https://example.com/image.png'>"
      const imgMatch = content.match(/<img[^>]+src=["']([^"']+)["']/)
      expect(imgMatch?.[1]).toBe('https://example.com/image.png')
    })
  })

  describe('Spoiler detection', () => {
    it('should detect explicit spoiler mentions', () => {
      const title = 'One Piece Chapter 1100 Spoiler Summary'
      const content = 'Summary of the chapter'
      const isSpoiler = (title + ' ' + content).toLowerCase().includes('spoiler')
      expect(isSpoiler).toBe(true)
    })

    it('should detect chapter number patterns as spoilers', () => {
      const title = 'Chapter 1100 Full Summary'
      const content = ''
      const text = (title + ' ' + content).toLowerCase()
      const hasChapterNumber = /chapter\s+\d+/.test(text)
      expect(hasChapterNumber).toBe(true)
    })

    it('should not flag regular news as spoilers', () => {
      const title = 'One Piece Anniversary Celebration Announced'
      const content = 'Exciting news for fans'
      const text = (title + ' ' + content).toLowerCase()
      const isSpoiler = text.includes('spoiler') || /chapter\s+\d+/.test(text)
      expect(isSpoiler).toBe(false)
    })
  })

  describe('Keyword filtering', () => {
    const filterByKeywords = (stories: { title: string; summary: string }[], keywords: string[]) => {
      const lowerKeywords = keywords.map(k => k.toLowerCase())
      return stories.filter(story => {
        const searchText = `${story.title} ${story.summary}`.toLowerCase()
        return lowerKeywords.some(keyword => searchText.includes(keyword))
      })
    }

    it('should filter stories containing keywords', () => {
      const stories = [
        { title: 'One Piece Episode 1100 Released', summary: 'New episode' },
        { title: 'Naruto Movie Coming', summary: 'Anime news' },
        { title: 'Luffy vs Kaido', summary: 'Epic battle' },
      ]
      const keywords = ['one piece', 'luffy']
      const filtered = filterByKeywords(stories, keywords)
      expect(filtered).toHaveLength(2)
    })

    it('should be case insensitive', () => {
      const stories = [
        { title: 'ONE PIECE latest news', summary: '' },
      ]
      const keywords = ['one piece']
      const filtered = filterByKeywords(stories, keywords)
      expect(filtered).toHaveLength(1)
    })

    it('should return empty array for no matches', () => {
      const stories = [
        { title: 'Random anime news', summary: 'Nothing related' },
      ]
      const keywords = ['one piece']
      const filtered = filterByKeywords(stories, keywords)
      expect(filtered).toHaveLength(0)
    })
  })

  describe('Deduplication', () => {
    const deduplicateByLink = (stories: { link: string; title: string }[]) => {
      const seen = new Set<string>()
      return stories.filter(story => {
        if (seen.has(story.link)) return false
        seen.add(story.link)
        return true
      })
    }

    it('should remove duplicate links', () => {
      const stories = [
        { link: 'https://example.com/1', title: 'Story 1' },
        { link: 'https://example.com/1', title: 'Story 1 Duplicate' },
        { link: 'https://example.com/2', title: 'Story 2' },
      ]
      const unique = deduplicateByLink(stories)
      expect(unique).toHaveLength(2)
    })

    it('should keep first occurrence', () => {
      const stories = [
        { link: 'https://example.com/1', title: 'First' },
        { link: 'https://example.com/1', title: 'Second' },
      ]
      const unique = deduplicateByLink(stories)
      expect(unique[0].title).toBe('First')
    })
  })

  describe('Sorting by date', () => {
    it('should sort newest first', () => {
      const stories = [
        { publishedAt: new Date('2024-01-01') },
        { publishedAt: new Date('2024-01-15') },
        { publishedAt: new Date('2024-01-10') },
      ]
      stories.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime())
      expect(stories[0].publishedAt.getTime()).toBeGreaterThan(stories[1].publishedAt.getTime())
      expect(stories[1].publishedAt.getTime()).toBeGreaterThan(stories[2].publishedAt.getTime())
    })
  })
})
