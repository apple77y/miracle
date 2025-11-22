import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { IntlProvider } from 'react-intl'
import FloatingConsultButton from '../../ui/FloatingConsultButton'
import enMessages from '../../../../messages/en.json'

const renderFloatingConsultButton = () => {
  return render(
    <IntlProvider messages={enMessages} locale="en">
      <FloatingConsultButton />
    </IntlProvider>
  )
}

describe('FloatingConsultButton', () => {
  // Mock window.open
  const mockOpen = jest.fn()
  
  beforeEach(() => {
    jest.clearAllMocks()
    global.window.open = mockOpen
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  it('should render consultation button', () => {
    renderFloatingConsultButton()
    
    const button = screen.getByRole('button')
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('aria-label', 'Consultation')
  })

  it('should have correct styling classes', () => {
    renderFloatingConsultButton()
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass(
      'fixed',
      'bottom-6',
      'right-6',
      'bg-amber-400',
      'hover:bg-amber-500',
      'text-white',
      'rounded-full',
      'p-3',
      'md:p-4',
      'shadow-lg',
      'hover:shadow-xl',
      'transition-all',
      'duration-300',
      'z-50',
      'group'
    )
  })

  it('should display chat icon', () => {
    renderFloatingConsultButton()
    
    const chatIcon = document.querySelector('svg path[d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"]')
    expect(chatIcon).toBeInTheDocument()
  })

  it('should open Naver Talk when clicked', async () => {
    const user = userEvent.setup()
    renderFloatingConsultButton()
    
    const button = screen.getByRole('button')
    await user.click(button)
    
    expect(mockOpen).toHaveBeenCalledWith('https://www.instagram.com/direct/t/100858424646856/', '_blank')
  })

  it('should display tooltip on hover', async () => {
    const user = userEvent.setup()
    renderFloatingConsultButton()
    
    const button = screen.getByRole('button')
    await user.hover(button)
    
    const tooltip = screen.getByText('Consultation')
    expect(tooltip).toBeInTheDocument()
    expect(tooltip).toHaveClass(
      'absolute',
      'right-16',
      'bg-gray-800',
      'text-white',
      'px-2',
      'py-1',
      'rounded',
      'text-sm',
      'opacity-0',
      'group-hover:opacity-100',
      'transition-opacity',
      'duration-300',
      'whitespace-nowrap'
    )
  })

  it('should have correct positioning', () => {
    renderFloatingConsultButton()
    
    const button = screen.getByRole('button')
    expect(button).toHaveClass('fixed', 'bottom-6', 'right-6', 'z-50')
  })

  it('should have proper accessibility attributes', () => {
    renderFloatingConsultButton()
    
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Consultation')
  })

  it('should use intl for localized text', () => {
    renderFloatingConsultButton()
    
    // The aria-label and tooltip text should come from intl
    const button = screen.getByRole('button')
    expect(button).toHaveAttribute('aria-label', 'Consultation')
    
    const tooltip = screen.getByText('Consultation')
    expect(tooltip).toBeInTheDocument()
  })

  it('should have correct icon size classes', () => {
    renderFloatingConsultButton()
    
    const iconContainer = document.querySelector('.flex.items-center.justify-center')
    expect(iconContainer).toHaveClass('w-5', 'h-5', 'md:w-6', 'md:h-6')
    
    const svg = document.querySelector('svg')
    expect(svg).toHaveClass('w-5', 'h-5', 'md:w-6', 'md:h-6')
  })

  it('should handle multiple clicks correctly', async () => {
    const user = userEvent.setup()
    renderFloatingConsultButton()
    
    const button = screen.getByRole('button')
    
    // Click multiple times
    await user.click(button)
    await user.click(button)
    await user.click(button)
    
    expect(mockOpen).toHaveBeenCalledTimes(3)
    expect(mockOpen).toHaveBeenCalledWith('https://www.instagram.com/direct/t/100858424646856/', '_blank')
  })
})