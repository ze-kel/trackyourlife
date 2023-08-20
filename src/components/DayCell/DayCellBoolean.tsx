import type { MouseEvent } from 'react';
import { useMemo, useRef, useState } from 'react';
import { useTrackableSafe } from '../../helpers/trackableContext';
import type { IDayProps } from './index';
import { computeDayCellHelpers } from './index';
import cls from 'clsx';
import { cva } from 'class-variance-authority';
import type { IColorOptions } from 'src/types/trackable';
import { AnimatePresence, motion } from 'framer-motion';
import DayNumber from '@components/DayCell/dayNumber';
import { clamp } from 'lodash';

export const ThemeList: Record<IColorOptions, ''> = {
  neutral: '',
  red: '',
  pink: '',
  green: '',
  blue: '',
  orange: '',
  purple: '',
  lime: '',
};

const activeGen: Record<IColorOptions, Record<'bg' | 'hover', string>> = {
  neutral: {
    bg: 'bg-neutral-200 dark:bg-neutral-700',
    hover: 'hover:border-neutral-700',
  },
  red: {
    bg: 'bg-red-500',
    hover: 'hover:border-red-500',
  },
  pink: {
    bg: 'bg-pink-500',
    hover: 'hover:border-pink-500',
  },
  green: {
    bg: 'bg-green-500',
    hover: 'hover:border-green-500',
  },
  blue: {
    bg: 'bg-blue-500',
    hover: 'hover:border-blue-500',
  },
  orange: {
    bg: 'bg-orange-500',
    hover: 'hover:border-orange-500',
  },
  purple: {
    bg: 'bg-purple-500',
    hover: 'hover:border-purple-500',
  },
  lime: {
    bg: 'bg-lime-500',
    hover: 'hover:border-lime-500',
  },
};

const BooleanClasses = cva(
  [
    'relative border-2 overflow-hidden border-transparent transition-all duration-400 ease-in-out select-none outline-none focus:outline-neutral-300 dark:focus:outline-neutral-600',
  ],
  {
    variants: {
      style: {
        default: 'h-16',
        mini: 'h-6 border',
      },
      inTrackRange: {
        true: 'cursor-pointer',
        false: 'cursor-default',
      },
      active: {
        true: '',
        false: '',
      },
    },
    compoundVariants: [
      {
        active: false,
        inTrackRange: true,
        className: '',
      },
      {
        active: false,
        inTrackRange: false,
        className: 'bg-neutral-100  dark:bg-neutral-900',
      },
    ],
    defaultVariants: {
      style: 'default',
    },
  }
);

const ANIMATION_TIME = 0.3;
const EASE = [0, 0.2, 0.5, 1];

export const DayCellBoolean = ({ day, month, year, style }: IDayProps) => {
  const { trackable, changeDay } = useTrackableSafe();

  if (trackable.type !== 'boolean') {
    throw new Error('Not boolena trackable passed to boolean dayCell');
  }

  const { dateKey, inTrackRange, isToday } = useMemo(
    () =>
      computeDayCellHelpers({
        day,
        month,
        year,
        startDate: trackable.settings.startDate,
      }),
    [day, month, year, trackable.settings.startDate]
  );

  const isActive = trackable.data[dateKey] === 'true';

  const mainRef = useRef<HTMLButtonElement>(null);
  // Point where click happened in % relative to button box. Used for animation
  const [clickPoint, setClickPoint] = useState([50, 50]);
  // Ration between width and height of the box.
  const [whRatio, setWhRatio] = useState(1);

  const handleClick = async (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (mainRef.current) {
      const t = mainRef.current;
      const rect = t.getBoundingClientRect();
      if (e.clientX === 0 && e.clientY === 0) {
        // keyboard click
        setClickPoint([50, 50]);
      } else {
        const x = clamp((e.clientX - rect.left) / rect.width, 0, 1);
        const y = clamp((e.clientY - rect.top) / rect.height, 0, 1);
        setClickPoint([x * 100, y * 100]);
      }
      setWhRatio(rect.height / rect.width);
    } else {
      console.warn('DayCellBoolean animation error');
    }

    if (!inTrackRange) return;

    console.log('click');

    await changeDay({
      id: trackable.id,
      day,
      month,
      year,
      value: isActive ? 'false' : 'true',
    });
  };

  const themeActive = trackable.settings.activeColor
    ? activeGen[trackable.settings.activeColor].bg
    : activeGen.lime.bg;

  const themeInactive = trackable.settings.inactiveColor
    ? activeGen[trackable.settings.inactiveColor].bg
    : activeGen.neutral.bg;

  const hoverActive = trackable.settings.activeColor
    ? activeGen[trackable.settings.activeColor].hover
    : activeGen.lime.hover;

  const hoverInactive = trackable.settings.inactiveColor
    ? activeGen[trackable.settings.inactiveColor].hover
    : activeGen.neutral.hover;

  const borderClass = isActive ? hoverInactive : hoverActive;

  return (
    <button
      ref={mainRef}
      tabIndex={inTrackRange ? 0 : -1}
      className={cls(
        BooleanClasses({
          inTrackRange,
          active: isActive,
          style,
        }),
        inTrackRange && borderClass
      )}
      key={day}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => void handleClick(e)}
    >
      {inTrackRange && (
        <>
          <AnimatePresence initial={false}>
            {isActive && (
              <>
                <div
                  className={cls(
                    'absolute left-0 top-0 h-full  w-full',
                    themeInactive
                  )}
                ></div>
                <motion.div
                  initial={{
                    scaleX: 0,
                    scaleY: 0,
                  }}
                  animate={{
                    scaleX: 1.2,
                    scaleY: 1.2,
                  }}
                  transition={{
                    duration: ANIMATION_TIME,
                    ease: EASE,
                    scaleY: {
                      duration: ANIMATION_TIME * whRatio,
                      ease: EASE,
                    },
                  }}
                  className={cls(
                    'absolute left-0 top-0 h-full  w-full',
                    themeActive
                  )}
                  style={{
                    transformOrigin: `
              ${clickPoint[0] || 50}% ${clickPoint[1] || 50}%`,
                  }}
                />
              </>
            )}
          </AnimatePresence>
          <AnimatePresence initial={false}>
            {!isActive && (
              <>
                <div
                  className={cls(
                    'absolute left-0 top-0 h-full  w-full',
                    themeActive
                  )}
                ></div>
                <motion.div
                  initial={{
                    scaleX: 0,
                    scaleY: 0,
                  }}
                  animate={{
                    scaleX: 1.2,
                    scaleY: 1.2,
                  }}
                  transition={{
                    duration: ANIMATION_TIME,
                    ease: EASE,
                    scaleY: {
                      duration: ANIMATION_TIME * whRatio,
                      ease: EASE,
                    },
                  }}
                  className={cls(
                    'absolute left-0 top-0 h-full  w-full',
                    themeInactive
                  )}
                  style={{
                    transformOrigin: `
              ${clickPoint[0] || 50}% ${clickPoint[1] || 50}%`,
                  }}
                />
              </>
            )}
          </AnimatePresence>
        </>
      )}

      <DayNumber style={style} day={day} isToday={isToday} />
    </button>
  );
};
