'use client'

import React from 'react'
import { Button, Input, Link } from '@nextui-org/react'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import SocialAuth from './SocialAuth'

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

type RegisterFormValues = z.infer<typeof registerSchema>

const RegisterForm = () => {
  const [isVisible, setIsVisible] = React.useState({
    password: false,
    confirmPassword: false,
  })

  const toggleVisibility = (field: 'password' | 'confirmPassword') => {
    setIsVisible(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = (data: RegisterFormValues) => {
    console.log(data)
    // Handle registration logic here
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Full Name</label>
        <Input
          {...register('name')}
          errorMessage={errors.name?.message}
          placeholder="Enter your full name"
          startContent={<User className="text-default-400" size={16} />}
          isInvalid={!!errors.name}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Email</label>
        <Input
          {...register('email')}
          errorMessage={errors.email?.message}
          isInvalid={!!errors.email}
          placeholder="Enter your email"
          type="email"
          startContent={<Mail className="text-default-400" size={16} />}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input
          {...register('password')}
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
          placeholder="Create a password"
          type={isVisible.password ? "text" : "password"}
          startContent={<Lock className="text-default-400" size={16} />}
          endContent={
            <button type="button" onClick={() => toggleVisibility('password')}>
              {isVisible.password ? (
                <EyeOff className="text-default-400" size={16} />
              ) : (
                <Eye className="text-default-400" size={16} />
              )}
            </button>
          }
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Confirm Password</label>
        <Input
          {...register('confirmPassword')}
          errorMessage={errors.confirmPassword?.message}
          isInvalid={!!errors.confirmPassword}
          placeholder="Confirm your password"
          type={isVisible.confirmPassword ? "text" : "password"}
          startContent={<Lock className="text-default-400" size={16} />}
          endContent={
            <button type="button" onClick={() => toggleVisibility('confirmPassword')}>
              {isVisible.confirmPassword ? (
                <EyeOff className="text-default-400" size={16} />
              ) : (
                <Eye className="text-default-400" size={16} />
              )}
            </button>
          }
        />
      </div>

      <Button type="submit" color="primary" className="w-full" size="lg">
        Create Account
      </Button>

      <SocialAuth />

      <p className="text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" size="sm">Sign in</Link>
      </p>
    </form>
  )
}

export default RegisterForm
