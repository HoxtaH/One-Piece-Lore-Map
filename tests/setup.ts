import { vi } from 'vitest'
import '@testing-library/jest-dom'

// Mock environment variables for tests
process.env.DATABASE_URL = 'mock://database'
process.env.DIRECT_URL = 'mock://direct'
