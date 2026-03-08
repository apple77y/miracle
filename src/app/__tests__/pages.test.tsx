import { render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import Home from '../page'
import GuidePage from '../guide/page'
import OccasionPage from '../occasion/page'
import OfflinePage, { metadata as offlineMetadata } from '../offline/page'
import koMessages from '../../../messages/ko.json'

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ priority, fill, quality, sizes, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & {
    priority?: boolean
    fill?: boolean
    quality?: number
    sizes?: string
  }) => {
    void priority
    void fill
    void quality
    void sizes
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt ?? ''} />
  },
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>{children}</a>
  ),
}))

jest.mock('@/components/layout/Header', () => ({
  __esModule: true,
  default: () => <header data-testid="header">Header</header>,
}))

jest.mock('@/components/layout/Footer', () => ({
  __esModule: true,
  default: () => <footer data-testid="footer">Footer</footer>,
}))

jest.mock('@/components/sections/Hero', () => ({
  __esModule: true,
  default: () => <section data-testid="hero">Hero</section>,
}))

jest.mock('@/components/sections/Services', () => ({
  __esModule: true,
  default: () => <section data-testid="services">Services</section>,
}))

jest.mock('@/components/sections/Gallery', () => ({
  __esModule: true,
  default: () => <section data-testid="gallery">Gallery</section>,
}))

jest.mock('@/components/sections/About', () => ({
  __esModule: true,
  default: () => <section data-testid="about">About</section>,
}))

jest.mock('@/components/sections/Contact', () => ({
  __esModule: true,
  default: () => <section data-testid="contact">Contact</section>,
}))

jest.mock('../../components/OfflineClient', () => ({
  __esModule: true,
  default: () => <div data-testid="offline-client">OfflineClient</div>,
}))

describe('App pages', () => {
  it('renders Home composition with all major sections', () => {
    render(<Home />)

    expect(screen.getByTestId('header')).toBeInTheDocument()
    expect(screen.getByTestId('hero')).toBeInTheDocument()
    expect(screen.getByTestId('services')).toBeInTheDocument()
    expect(screen.getByTestId('gallery')).toBeInTheDocument()
    expect(screen.getByTestId('about')).toBeInTheDocument()
    expect(screen.getByTestId('contact')).toBeInTheDocument()
    expect(screen.getByTestId('footer')).toBeInTheDocument()
  })

  it('renders GuidePage content and consultation links', () => {
    render(
      <IntlProvider locale="ko" messages={koMessages}>
        <GuidePage />
      </IntlProvider>,
    )

    expect(screen.getByText(koMessages['guide.title'])).toBeInTheDocument()
    expect(screen.getByText(koMessages['guide.subtitle'].split('\n')[0])).toBeInTheDocument()
    expect(screen.getByText(koMessages['guide.bouquet.title'])).toBeInTheDocument()
    expect(screen.getByRole('link', { name: koMessages['occasion.consultation.phone'] })).toHaveAttribute('href', 'tel:0507-1456-0389')
    expect(screen.getByRole('link', { name: koMessages['occasion.consultation.email'] })).toHaveAttribute('href', 'mailto:rmr0322@hanmail.net')
  })

  it('renders OccasionPage categories and contact links', () => {
    render(
      <IntlProvider locale="ko" messages={koMessages}>
        <OccasionPage />
      </IntlProvider>,
    )

    expect(screen.getByText(koMessages['occasion.title'])).toBeInTheDocument()
    expect(screen.getByText(koMessages['occasion.birthday.category'])).toBeInTheDocument()
    expect(screen.getByText(koMessages['occasion.consultation.title'])).toBeInTheDocument()
    expect(screen.getByRole('link', { name: koMessages['occasion.consultation.phone'] })).toHaveAttribute('href', 'tel:0507-1456-0389')
    expect(screen.getByRole('link', { name: koMessages['occasion.consultation.email'] })).toHaveAttribute('href', 'mailto:rmr0322@hanmail.net')
  })

  it('renders OfflinePage and exports metadata', () => {
    render(<OfflinePage />)

    expect(screen.getByTestId('offline-client')).toBeInTheDocument()
    expect(offlineMetadata.title).toBe('Offline - Miracle')
    expect(offlineMetadata.description).toBe('현재 인터넷에 연결되어 있지 않습니다.')
  })
})
