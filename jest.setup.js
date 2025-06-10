// jest.setup.js - Jest configuration for testing
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter() {
    return {
      route: '/',
      pathname: '/',
      query: {},
      asPath: '/',
      push: jest.fn(),
      replace: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn(),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
    };
  },
}));

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock NextAuth
jest.mock('next-auth/react', () => ({
  useSession: jest.fn(() => ({
    data: null,
    status: 'unauthenticated',
  })),
  signIn: jest.fn(),
  signOut: jest.fn(),
  getSession: jest.fn(),
  SessionProvider: ({ children }) => children,
}));

// Mock Prisma
jest.mock('./lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
      groupBy: jest.fn(),
    },
    account: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    session: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    roleAssignment: {
      findMany: jest.fn(),
      create: jest.fn(),
    },
    adminAction: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    loginLog: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
    notification: {
      findMany: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
  },
}));

// Mock environment variables
process.env = {
  ...process.env,
  NEXTAUTH_URL: 'http://localhost:3000',
  NEXTAUTH_SECRET: 'test-secret',
  SUPER_ADMIN_EMAILS: 'sanchai5651@gmail.com',
  SUPER_ADMIN_PASSWORD: 'Safety17',
  SUPER_ADMIN_NAME: 'System Administrator',
  SUPER_ADMIN_MODE: 'true',
  NEXT_PUBLIC_SUPER_ADMIN_ENABLED: 'true',
  DATABASE_URL: 'postgresql://test:test@localhost:5432/test_db',
  GOOGLE_CLIENT_ID: 'test_google_id',
  GOOGLE_CLIENT_SECRET: 'test_google_secret',
  FACEBOOK_CLIENT_ID: 'test_facebook_id',
  FACEBOOK_CLIENT_SECRET: 'test_facebook_secret',
  LINE_CLIENT_ID: 'test_line_id',
  LINE_CLIENT_SECRET: 'test_line_secret',
  SMTP_HOST: 'localhost',
  SMTP_PORT: '1025',
  SMTP_USER: 'test@example.com',
  SMTP_PASS: 'test_password',
};

// Mock fetch globally
global.fetch = jest.fn();

// Mock window.location
delete window.location;
window.location = {
  href: '',
  origin: 'http://localhost:3000',
  protocol: 'http:',
  host: 'localhost:3000',
  hostname: 'localhost',
  port: '3000',
  pathname: '/',
  search: '',
  hash: '',
  assign: jest.fn(),
  replace: jest.fn(),
  reload: jest.fn(),
};

// Mock window.alert
window.alert = jest.fn();

// Mock window.confirm
window.confirm = jest.fn();

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.sessionStorage = sessionStorageMock;

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  fetch.mockClear();
  localStorageMock.getItem.mockClear();
  localStorageMock.setItem.mockClear();
  localStorageMock.removeItem.mockClear();
  localStorageMock.clear.mockClear();
  sessionStorageMock.getItem.mockClear();
  sessionStorageMock.setItem.mockClear();
  sessionStorageMock.removeItem.mockClear();
  sessionStorageMock.clear.mockClear();
});

