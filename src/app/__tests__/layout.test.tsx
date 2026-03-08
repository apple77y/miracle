import { render, screen } from '@testing-library/react'
import RootLayout, { metadata, viewport } from '../layout'

jest.mock('next/script', () => ({
  __esModule: true,
  default: ({ children, id }: { children: React.ReactNode; id?: string }) => (
    <script data-testid="next-script" data-script-id={id}>{children}</script>
  ),
}))

jest.mock('@vercel/analytics/react', () => ({
  Analytics: () => <div data-testid="analytics" />,
}))

jest.mock('@vercel/speed-insights/next', () => ({
  SpeedInsights: () => <div data-testid="speed-insights" />,
}))

jest.mock('../../components/ui/FloatingConsultButton', () => ({
  __esModule: true,
  default: () => <div data-testid="floating-consult" />,
}))

jest.mock('../../components/ui/BackgroundMusic', () => ({
  __esModule: true,
  default: () => <div data-testid="background-music" />,
}))

jest.mock('../../components/DynamicLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="dynamic-layout">{children}</div>,
}))

jest.mock('../../components/ErrorBoundary', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="error-boundary">{children}</div>,
}))

jest.mock('../../components/ResourceHints', () => ({
  __esModule: true,
  default: () => <meta data-testid="resource-hints" />,
}))

jest.mock('../../components/I18nProvider', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div data-testid="i18n-provider">{children}</div>,
}))

jest.mock('../../utils/metadata', () => ({
  getMetadata: () => ({ title: 'mock-metadata' }),
  getViewport: () => ({ width: 'device-width' }),
  getJsonLd: () => [{ '@context': 'https://schema.org', '@type': 'LocalBusiness' }],
}))

describe('RootLayout', () => {
  it('renders children and global wrappers', () => {
    render(
      <RootLayout>
        <main data-testid="child">content</main>
      </RootLayout>,
    )

    expect(screen.getByTestId('error-boundary')).toBeInTheDocument()
    expect(screen.getByTestId('i18n-provider')).toBeInTheDocument()
    expect(screen.getByTestId('dynamic-layout')).toBeInTheDocument()
    expect(screen.getByTestId('child')).toBeInTheDocument()
    expect(screen.getByTestId('background-music')).toBeInTheDocument()
    expect(screen.getByTestId('floating-consult')).toBeInTheDocument()
    expect(screen.getByTestId('analytics')).toBeInTheDocument()
    expect(screen.getByTestId('speed-insights')).toBeInTheDocument()
  })

  it('exports metadata and viewport', () => {
    expect(metadata).toEqual({ title: 'mock-metadata' })
    expect(viewport).toEqual({ width: 'device-width' })
  })
})
