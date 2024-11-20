'use client'

import React, { useCallback, useEffect, useState, forwardRef, useImperativeHandle } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@nextui-org/react'
import { cn } from '@/lib/utils'

interface CarouselProps {
  children: React.ReactNode
  autoplay?: boolean
  className?: string
  showControls?: boolean
  showIndicators?: boolean
  loop?: boolean
  slideWidth?: string
  autoplayDelay?: number
  onSelect?: (index: number) => void
}

interface CarouselRef {
  scrollTo: (index: number) => void
}

const Carousel = forwardRef<CarouselRef, CarouselProps>(({ 
  children, 
  autoplay = false, 
  className = '',
  showControls = true,
  showIndicators = false,
  loop = false,
  slideWidth,
  autoplayDelay = 4000,
  onSelect
}, ref) => {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([])

  const autoplayOptions = autoplay ? [
    Autoplay({
      delay: autoplayDelay,
      stopOnInteraction: !loop,
      stopOnMouseEnter: !loop,
      rootNode: (emblaRoot) => emblaRoot.parentElement,
    })
  ] : []

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      align: 'start',
      skipSnaps: false,
      dragFree: !showIndicators,
      loop
    }, 
    autoplayOptions
  )

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const scrollTo = useCallback((index: number) => {
    if (emblaApi) emblaApi.scrollTo(index)
  }, [emblaApi])

  useImperativeHandle(ref, () => ({
    scrollTo
  }), [scrollTo])

  const onSelectCallback = useCallback(() => {
    if (!emblaApi) return
    const newIndex = emblaApi.selectedScrollSnap()
    setSelectedIndex(newIndex)
    onSelect?.(newIndex)
  }, [emblaApi, onSelect])

  useEffect(() => {
    if (!emblaApi) return
    onSelectCallback()
    setScrollSnaps(emblaApi.scrollSnapList())
    emblaApi.on('select', onSelectCallback)
    return () => {
      emblaApi.off('select', onSelectCallback)
    }
  }, [emblaApi, onSelectCallback])

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className={cn(
          'flex',
          slideWidth ? '' : 'gap-4',
          className
        )}>
          {children}
        </div>
      </div>
      
      {showControls && (
        <>
          <Button
            isIconOnly
            radius="full"
            variant="flat"
            className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={scrollPrev}
          >
            <ChevronLeft className="w-6 h-6" />
          </Button>
          
          <Button
            isIconOnly
            radius="full"
            variant="flat"
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity z-10"
            onClick={scrollNext}
          >
            <ChevronRight className="w-6 h-6" />
          </Button>
        </>
      )}

      {showIndicators && scrollSnaps.length > 0 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              className={cn(
                'w-2 h-2 rounded-full transition-all',
                index === selectedIndex 
                  ? 'bg-primary w-4' 
                  : 'bg-white hover:bg-primary/50'
              )}
              onClick={() => scrollTo(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  )
})

export default Carousel
