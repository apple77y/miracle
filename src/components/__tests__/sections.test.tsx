import { fireEvent, render, screen } from '@testing-library/react'
import { IntlProvider } from 'react-intl'
import About from '../sections/About'
import Contact from '../sections/Contact'
import Gallery from '../sections/Gallery'
import Hero from '../sections/Hero'
import Services from '../sections/Services'
import Footer from '../layout/Footer'
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

const renderWithIntl = (ui: React.ReactElement) => {
  return render(
    <IntlProvider locale="ko" messages={koMessages}>
      {ui}
    </IntlProvider>,
  )
}

describe('Sections and Footer', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_NAVER_MAP_CLIENT_ID = 'test-client-id'
  })

  it('renders Hero with CTA links', () => {
    renderWithIntl(<Hero />)

    expect(screen.getByText(koMessages['hero.title'])).toBeInTheDocument()
    expect(screen.getByRole('link', { name: koMessages['hero.contactUs'] })).toHaveAttribute('href', '/#contact')
    expect(screen.getByRole('link', { name: koMessages['hero.viewPortfolio'] })).toHaveAttribute('href', '/#gallery')
  })

  it('renders Services cards', () => {
    renderWithIntl(<Services />)

    expect(screen.getByText(koMessages['services.title'])).toBeInTheDocument()
    expect(screen.getByText(koMessages['services.bouquet.title'])).toBeInTheDocument()
    expect(screen.getByText(koMessages['services.plants.title'])).toBeInTheDocument()
    expect(screen.getByText(koMessages['services.event.title'])).toBeInTheDocument()
  })

  it('renders Gallery content and social link', () => {
    renderWithIntl(<Gallery />)

    expect(screen.getByText(koMessages['gallery.title'])).toBeInTheDocument()
    expect(screen.getByText('Instagram')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Instagram' })).toHaveAttribute('href', 'https://www.instagram.com/miracle_flowerstudio/')
  })

  it('renders About content and blog link', () => {
    renderWithIntl(<About />)

    expect(screen.getByText(koMessages['about.title'])).toBeInTheDocument()
    expect(screen.getByRole('link', { name: koMessages['about.moreStory'] })).toHaveAttribute('href', 'https://blog.naver.com/miracle_flower')
  })

  it('renders Contact information, map links and map fallback on image error', () => {
    renderWithIntl(<Contact />)

    expect(screen.getByText(koMessages['contact.title'])).toBeInTheDocument()
    expect(screen.getByRole('link', { name: '0507-1456-0389' })).toHaveAttribute('href', 'tel:0507-1456-0389')
    expect(screen.getByRole('link', { name: 'rmr0322@hanmail.net' })).toHaveAttribute('href', 'mailto:rmr0322@hanmail.net')

    expect(screen.getByRole('link', { name: koMessages['contact.naverMap'] })).toHaveAttribute('href', 'https://naver.me/GTnuWfmH')
    expect(screen.getByRole('link', { name: koMessages['contact.kakaoMap'] })).toHaveAttribute('href', 'https://place.map.kakao.com/86003378')
    expect(screen.getByRole('link', { name: koMessages['contact.googleMap'] })).toHaveAttribute('href', 'https://maps.app.goo.gl/LBKyuJShj3owcW949')

    const mapImage = screen.getByAltText(koMessages['contact.mapAlt'])
    fireEvent.error(mapImage)

    expect(screen.getByText('미라클 플라워')).toBeInTheDocument()
  })

  it('renders Footer with dynamic year', () => {
    renderWithIntl(<Footer />)

    const year = new Date().getFullYear().toString()
    expect(screen.getByText((content) => content.includes('성남시 분당구에서 정성스럽게 만든'))).toBeInTheDocument()
    expect(screen.getByText(new RegExp(`© ${year} Miracle Flower\\.`))).toBeInTheDocument()
  })
})
