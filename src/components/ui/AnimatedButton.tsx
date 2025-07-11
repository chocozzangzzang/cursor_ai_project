"use client"

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, Zap, Star, Heart, Rocket, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link' | 'rainbow' | 'neon' | 'cosmic' | 'royal'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  animation?: 'pulse' | 'bounce' | 'shake' | 'glow' | 'ripple' | 'sparkle' | 'magnetic' | 'morphing'
  icon?: React.ReactNode
  children: React.ReactNode
}

const AnimatedButton = React.forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ className, variant = 'default', size = 'default', animation = 'glow', icon, children, ...props }, ref) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isClicked, setIsClicked] = useState(false)
    const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([])

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (animation === 'ripple') {
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const y = e.clientY - rect.top
        const newRipple = { id: Date.now(), x, y }
        setRipples(prev => [...prev, newRipple])
        setTimeout(() => {
          setRipples(prev => prev.filter(ripple => ripple.id !== newRipple.id))
        }, 600)
      }
      setIsClicked(true)
      setTimeout(() => setIsClicked(false), 200)
      props.onClick?.(e)
    }

    const baseClasses = cn(
      "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative overflow-hidden",
      {
        "h-10 px-4 py-2": size === "default",
        "h-9 rounded-md px-3": size === "sm",
        "h-11 rounded-md px-8": size === "lg",
        "h-10 w-10": size === "icon",
      },
      className
    )

    const variantClasses = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
      rainbow: "bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white",
      neon: "bg-black border-2 border-cyan-400 text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.3)]",
      cosmic: "bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white border border-purple-500",
      royal: "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-black border-2 border-yellow-300"
    }

    // 애니메이션별 스타일/애니메이션 분기
    let motionProps: any = {}
    if (animation === 'pulse') {
      motionProps.whileHover = { scale: 1.05 }
      motionProps.transition = { duration: 0.2 }
    } else if (animation === 'bounce') {
      motionProps.animate = isClicked ? { y: -5 } : { y: 0 }
      motionProps.transition = { type: 'spring', stiffness: 400, damping: 10 }
    } else if (animation === 'shake') {
      motionProps.animate = isClicked ? { x: [-2, 2, -2, 2, 0] } : { x: 0 }
      motionProps.transition = { duration: 0.5 }
    } else if (animation === 'glow') {
      motionProps.style = {
        boxShadow: isHovered
          ? '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3)'
          : '0 0 0px rgba(59, 130, 246, 0)'
      }
      motionProps.transition = { duration: 0.3 }
    } else if (animation === 'magnetic') {
      motionProps.whileHover = { scale: 1.1, rotateY: 5 }
      motionProps.transition = { type: 'spring', stiffness: 300, damping: 20 }
    } else if (animation === 'morphing') {
      motionProps.whileHover = { borderRadius: '20px', scale: 1.05 }
      motionProps.transition = { duration: 0.3 }
    } else if (animation === 'sparkle') {
      motionProps.whileHover = { scale: 1.05 }
      motionProps.transition = { duration: 0.2 }
    }

    const getIcon = () => {
      if (icon) return icon
      switch (variant) {
        case 'rainbow': return <Sparkles className="w-4 h-4" />
        case 'neon': return <Zap className="w-4 h-4" />
        case 'cosmic': return <Star className="w-4 h-4" />
        case 'royal': return <Crown className="w-4 h-4" />
        default: return null
      }
    }

    const sparklePositions = [
      { top: '10%', left: '20%', delay: 0 },
      { top: '80%', right: '15%', delay: 0.2 },
      { top: '30%', right: '25%', delay: 0.4 },
      { bottom: '20%', left: '30%', delay: 0.6 }
    ]

    return (
      <motion.button
        ref={ref}
        className={cn(baseClasses, variantClasses[variant])}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleClick}
        whileTap={{ scale: 0.95 }}
        {...motionProps}
        {...props}
      >
        {/* Background Effects */}
        {variant === 'rainbow' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 via-blue-500 via-green-500 via-yellow-500 to-red-500"
            animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            style={{ backgroundSize: '200% 200%' }}
          />
        )}
        {variant === 'neon' && isHovered && (
          <motion.div
            className="absolute inset-0 bg-cyan-400 opacity-20"
            animate={{ opacity: [0.2, 0.4, 0.2] }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
        {variant === 'cosmic' && (
          <motion.div
            className="absolute inset-0"
            style={{
              background: 'radial-gradient(circle at 50% 50%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
            }}
            animate={{
              background: [
                'radial-gradient(circle at 20% 20%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 80%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 80%, rgba(147, 51, 234, 0.3) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 20%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)',
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
        )}
        {/* Ripple Effect */}
        {animation === 'ripple' && (
          <AnimatePresence>
            {ripples.map((ripple) => (
              <motion.div
                key={ripple.id}
                className="absolute rounded-full bg-white opacity-30"
                style={{
                  left: ripple.x - 10,
                  top: ripple.y - 10,
                  width: 20,
                  height: 20,
                }}
                initial={{ scale: 0, opacity: 0.5 }}
                animate={{ scale: 4, opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              />
            ))}
          </AnimatePresence>
        )}
        {/* Sparkle Effect */}
        {animation === 'sparkle' && isHovered && (
          <AnimatePresence>
            {sparklePositions.map((pos, index) => (
              <motion.div
                key={index}
                className="absolute w-1 h-1 bg-white rounded-full"
                style={pos}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ 
                  scale: [0, 1, 0], 
                  opacity: [0, 1, 0],
                  rotate: [0, 180, 360]
                }}
                transition={{ 
                  duration: 1, 
                  delay: pos.delay,
                  repeat: Infinity,
                  repeatDelay: 1
                }}
              />
            ))}
          </AnimatePresence>
        )}
        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {getIcon()}
          {children}
        </span>
        {/* Shine Effect */}
        {(variant === 'royal' || variant === 'rainbow') && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 3,
              ease: "easeInOut"
            }}
            style={{ transform: 'skewX(-20deg)' }}
          />
        )}
      </motion.button>
    )
  }
)

AnimatedButton.displayName = "AnimatedButton"

export default AnimatedButton 