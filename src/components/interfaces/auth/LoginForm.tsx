'use client'

import React from 'react'
import { Button, Input, Link } from '@nextui-org/react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import SocialAuth from './SocialAuth'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginForm = () => {
  const [isVisible, setIsVisible] = React.useState(false)
  const toggleVisibility = () => setIsVisible(!isVisible)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = (data: LoginFormValues) => {
    console.log(data)
    // Handle login logic here
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
          placeholder="Enter your password"
          isInvalid={!!errors.password}
          type={isVisible ? "text" : "password"}
          startContent={<Lock className="text-default-400" size={16} />}
          endContent={
            <button type="button" onClick={toggleVisibility}>
              {isVisible ? (
                <EyeOff className="text-default-400" size={16} />
              ) : (
                <Eye className="text-default-400" size={16} />
              )}
            </button>
          }
        />
      </div>

      <div className="flex justify-between items-center">
        <Link href="/forgot-password" size="sm">Forgot password?</Link>
      </div>

      <Button type="submit" color="primary" className="w-full" size="lg">
        Sign In
      </Button>

      <SocialAuth />

      <p className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" size="sm">Sign up</Link>
      </p>
    </form>
  )
}

export default LoginForm
