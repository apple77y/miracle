import { render, screen, waitFor } from '@testing-library/react'
import BackgroundCarousel from '../../ui/BackgroundCarousel'

jest.mock('swiper/css', () => ({}))
jest.mock('swiper/css/effect-fade', () => ({}))

jest.mock('swiper/react', () => ({
  Swiper: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper">{children}</div>,
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper-slide">{children}</div>,
}))

jest.mock('swiper/modules', () => ({
  Autoplay: {},
  EffectFade: {},
}))

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

describe('BackgroundCarousel', () => {
  it('renders carousel section container', () => {
    const { container } = render(<BackgroundCarousel />)

    expect(container.querySelector('section')).toBeInTheDocument()
  })

  it('renders swiper slides after client hydration effect', async () => {
    render(<BackgroundCarousel />)

    await waitFor(() => {
      expect(screen.getByTestId('swiper')).toBeInTheDocument()
    })

    const slides = screen.getAllByTestId('swiper-slide')
    expect(slides.length).toBe(6)
    expect(screen.getByAltText('Background image 1')).toBeInTheDocument()
  })
})
