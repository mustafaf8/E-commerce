import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

const Slider = React.forwardRef(
  (
    {
      className,
      min = 0,
      max = 100,
      step = 1,
      value = [min, max],
      onValueChange,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [localValue, setLocalValue] = useState(value);
    const sliderRef = useRef(null);
    const isDragging = useRef(false);
    const activeThumb = useRef(null);

    useEffect(() => {
      setLocalValue(value);
    }, [value]);

    const getPercentage = (val) => ((val - min) / (max - min)) * 100;

    const getValueFromPercentage = (percentage) => {
      const val = min + (percentage / 100) * (max - min);
      return Math.round(val / step) * step;
    };

    const getClientPosition = (event) => {
      if (event.touches) {
        return event.touches[0].clientX;
      }
      return event.clientX;
    };

    const handleStart = (index) => (e) => {
      if (disabled) return;
      e.preventDefault();
      isDragging.current = true;
      activeThumb.current = index;
    };

    const handleMove = (e) => {
      if (!isDragging.current || activeThumb.current === null || disabled) return;

      const rect = sliderRef.current.getBoundingClientRect();
      const clientX = getClientPosition(e);
      const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const newValue = getValueFromPercentage(percentage);

      setLocalValue((prev) => {
        const newValues = [...prev];
        newValues[activeThumb.current] = newValue;

        // Ensure min <= max
        if (activeThumb.current === 0 && newValues[0] > newValues[1]) {
          newValues[0] = newValues[1];
        } else if (activeThumb.current === 1 && newValues[1] < newValues[0]) {
          newValues[1] = newValues[0];
        }

        // Clamp values
        newValues[0] = Math.max(min, Math.min(max, newValues[0]));
        newValues[1] = Math.max(min, Math.min(max, newValues[1]));

        if (onValueChange) {
          onValueChange(newValues);
        }

        return newValues;
      });
    };

    const handleEnd = () => {
      isDragging.current = false;
      activeThumb.current = null;
    };

    useEffect(() => {
      const moveEvents = ['mousemove', 'touchmove'];
      const endEvents = ['mouseup', 'touchend', 'touchcancel'];

      moveEvents.forEach(event => {
        document.addEventListener(event, handleMove, { passive: false });
      });

      endEvents.forEach(event => {
        document.addEventListener(event, handleEnd);
      });

      return () => {
        moveEvents.forEach(event => {
          document.removeEventListener(event, handleMove);
        });
        endEvents.forEach(event => {
          document.removeEventListener(event, handleEnd);
        });
      };
    }, []);

    const handleTrackClick = (e) => {
      if (disabled) return;
      const rect = sliderRef.current.getBoundingClientRect();
      const clientX = getClientPosition(e);
      const percentage = ((clientX - rect.left) / rect.width) * 100;
      const newValue = getValueFromPercentage(percentage);

      setLocalValue((prev) => {
        const newValues = [...prev];
        // Determine which thumb is closer
        const distanceToMin = Math.abs(newValue - prev[0]);
        const distanceToMax = Math.abs(newValue - prev[1]);
        
        if (distanceToMin < distanceToMax) {
          newValues[0] = Math.min(newValue, newValues[1]);
        } else {
          newValues[1] = Math.max(newValue, newValues[0]);
        }

        if (onValueChange) {
          onValueChange(newValues);
        }

        return newValues;
      });
    };

    return (
      <div
        ref={ref}
        className={cn(
          'relative flex w-full touch-none select-none items-center',
          className
        )}
        {...props}
      >
        <div
          ref={sliderRef}
          className="relative h-2 w-full grow overflow-hidden rounded-full bg-gray-300 cursor-pointer"
          onClick={handleTrackClick}
          onTouchStart={handleTrackClick}
        >
          {/* Track fill */}
          <div
            className="absolute h-full bg-red-500"
            style={{
              left: `${getPercentage(localValue[0])}%`,
              width: `${getPercentage(localValue[1]) - getPercentage(localValue[0])}%`,
            }}
          />
          
          {/* Min thumb */}
          <div
            className={cn(
              'absolute h-6 w-6 rounded-full border-4 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            style={{
              left: `calc(${getPercentage(localValue[0])}% - 12px)`,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            onMouseDown={handleStart(0)}
            onTouchStart={handleStart(0)}
          />
          
          {/* Max thumb */}
          <div
            className={cn(
              'absolute h-6 w-6 rounded-full border-4 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing',
              disabled && 'cursor-not-allowed opacity-50'
            )}
            style={{
              left: `calc(${getPercentage(localValue[1])}% - 12px)`,
              top: '50%',
              transform: 'translateY(-50%)',
            }}
            onMouseDown={handleStart(1)}
            onTouchStart={handleStart(1)}
          />
        </div>
      </div>
    );
  }
);

Slider.displayName = 'Slider';

export { Slider }; 