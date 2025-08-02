import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import BackgroundCarousel from '../../ui/BackgroundCarousel'

// Mock Next.js Image component
jest.mock('next/image', () => {
  const MockImage = ({ src, alt, fill, priority, quality, sizes, ...props }: { 
    src: string; 
    alt: string; 
    fill?: boolean;
    priority?: boolean;
    quality?: number;
    sizes?: string;
    [key: string]: unknown 
  }) => {
    const imgProps: Record<string, unknown> = { src, alt, ...props }
    
    // Handle Next.js specific props
    if (quality) imgProps.quality = quality.toString()
    if (sizes) imgProps.sizes = sizes
    if (priority) imgProps.priority = 'true'
    if (fill) imgProps['data-fill'] = 'true'
    
    return <img alt="" {...imgProps} />
  }
  MockImage.displayName = 'MockImage'
  return MockImage
})

// Mock Swiper components
jest.mock('swiper/react', () => ({
  Swiper: ({ children, loop, effect, autoplay, ...props }: { 
    children: React.ReactNode; 
    loop?: boolean;
    effect?: string;
    autoplay?: unknown;
    [key: string]: unknown 
  }) => (
    <div 
      data-testid="swiper" 
      data-loop={loop ? 'true' : 'false'}
      data-effect={effect}
      data-autoplay={autoplay ? 'enabled' : 'disabled'}
      {...props}
    >
      {children}
    </div>
  ),
  SwiperSlide: ({ children }: { children: React.ReactNode }) => <div data-testid="swiper-slide">{children}</div>
}))

jest.mock('swiper/modules', () => ({
  Autoplay: 'Autoplay',
  EffectFade: 'EffectFade'
}))

// Mock Swiper CSS imports
jest.mock('swiper/css', () => {})
jest.mock('swiper/css/effect-fade', () => {})

describe('BackgroundCarousel', () => {
  beforeEach(() => {
    // Reset isClient state by clearing module cache
    jest.resetModules()
  })

  it('should render fallback gradient when not on client', async () => {
    // Mock useEffect to not run (simulating server-side)
    const mockUseEffect = jest.fn()
    jest.doMock('react', () => ({
      ...jest.requireActual('react'),
      useEffect: mockUseEffect,
      useState: () => [false, jest.fn()] // isClient = false
    }))

    const { default: BackgroundCarouselComponent } = await import('../../ui/BackgroundCarousel')
    
    render(<BackgroundCarouselComponent />)
    
    const fallback = document.querySelector('.absolute.inset-0.bg-gradient-to-br')
    expect(fallback).toBeInTheDocument()
    expect(fallback).toHaveClass('from-rose-50', 'via-white', 'to-pink-50')
  })

  it('should render Swiper component when on client', async () => {
    render(<BackgroundCarousel />)
    
    await waitFor(() => {
      expect(screen.getByTestId('swiper')).toBeInTheDocument()
    })
  })

  it('should render all image slides', async () => {
    render(<BackgroundCarousel />)
    
    await waitFor(() => {
      const slides = screen.getAllByTestId('swiper-slide')
      expect(slides).toHaveLength(6) // Should have 6 images
    })
  })

  it('should render images with correct src attributes', async () => {
    render(<BackgroundCarousel />)
    
    await waitFor(() => {
      const images = screen.getAllByRole('img')
      expect(images).toHaveLength(6)
      
      const expectedImages = [
        '/images/seasonal-bouquet.jpg',
        '/images/rose-bouquet.jpg',
        '/images/vase-arrangement.jpg',
        '/images/flower-basket.jpg',
        '/images/event-decoration.jpg',
        '/images/flower-box.jpg'
      ]
      
      expectedImages.forEach((src, index) => {
        expect(images[index]).toHaveAttribute('src', src)
      })
    })
  })

  it('should have correct alt text for images', async () => {
    render(<BackgroundCarousel />)
    
    await waitFor(() => {
      const images = screen.getAllByRole('img')
      
      images.forEach((img, index) => {
        expect(img).toHaveAttribute('alt', `Background image ${index + 1}`)
      })
    })
  })

  it('should apply gradient overlay to each slide', async () => {
    render(<BackgroundCarousel />)
    
    await waitFor(() => {
      const overlays = document.querySelectorAll('.absolute.inset-0.bg-gradient-to-br')
      expect(overlays).toHaveLength(6) // One overlay per slide
      
      overlays.forEach(overlay => {
        expect(overlay).toHaveClass('from-rose-50/90', 'via-white/85', 'to-pink-50/90')
      })
    })
  })

  it('should have correct Swiper configuration props', async () => {
    render(<BackgroundCarousel />)
    
    await waitFor(() => {
      const swiper = screen.getByTestId('swiper')
      expect(swiper).toHaveAttribute('data-effect', 'fade')
      expect(swiper).toHaveAttribute('data-loop', 'true')
      expect(swiper).toHaveAttribute('data-autoplay', 'enabled')
    })
  })

  it('should have proper container styling', async () => {
    render(<BackgroundCarousel />)
    
    const container = document.querySelector('.absolute.inset-0.overflow-hidden')
    expect(container).toBeInTheDocument()
  })

  it('should set priority on first image only', async () => {
    render(<BackgroundCarousel />)
    
    await waitFor(() => {
      const images = screen.getAllByRole('img')
      // In the mock, priority is converted to string
      expect(images[0]).toHaveAttribute('priority', 'true')
      
      // Other images should not have priority attribute
      for (let i = 1; i < images.length; i++) {
        expect(images[i]).not.toHaveAttribute('priority')
      }
    })
  })

  it('should have correct image attributes', async () => {
    render(<BackgroundCarousel />)
    
    await waitFor(() => {
      const images = screen.getAllByRole('img')
      
      images.forEach(img => {
        expect(img).toHaveAttribute('sizes', '100vw')
        expect(img).toHaveAttribute('quality', '85')
        expect(img).toHaveAttribute('data-fill', 'true')
      })
    })
  })

  it('should initialize isClient state correctly', async () => {
    // Mock useState to control the initial state more precisely
    const mockSetIsClient = jest.fn()
    let isClientState = false

    jest.spyOn(React, 'useState').mockImplementation((initialState?: unknown) => {
      if (typeof initialState === 'boolean') {
        return [isClientState, mockSetIsClient]
      }
      return [initialState, jest.fn()]
    })
    
    const { rerender } = render(<BackgroundCarousel />)
    
    // Initial render should show fallback
    const fallback = document.querySelector('.from-rose-50')
    expect(fallback).toBeInTheDocument()
    
    // Simulate useEffect setting isClient to true
    isClientState = true
    rerender(<BackgroundCarousel />)
    
    await waitFor(() => {
      expect(screen.getByTestId('swiper')).toBeInTheDocument()
    })
    
    jest.restoreAllMocks()
  })
})