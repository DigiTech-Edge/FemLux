'use client'

import React from 'react'
import { Button, Input, Link } from '@nextui-org/react'
import { Mail, Lock, Eye, EyeOff } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'react-hot-toast'
import { useRouter } from 'next/navigation'
import SocialAuth from './SocialAuth'
import { login } from '@/services/actions/auth.actions'

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

type LoginFormValues = z.infer<typeof loginSchema>

const LoginForm = () => {
  const [isVisible, setIsVisible] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const router = useRouter()

  const toggleVisibility = () => setIsVisible(!isVisible)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setIsLoading(true)
      const response = await login(data.email, data.password)
      
      if (response.error) {
        toast.error(response.error)
        return
      }

      if (!response.user) {
        toast.error('Something went wrong')
        return
      }

      toast.success('Logged in successfully!')
      router.push('/')
    } catch (error) {
      toast.error('Failed to login')
    } finally {
      setIsLoading(false)
    }
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
          isDisabled={isLoading}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Password</label>
        <Input
          {...register('password')}
          errorMessage={errors.password?.message}
          isInvalid={!!errors.password}
          placeholder="Enter your password"
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
          isDisabled={isLoading}
        />
      </div>

      <div className="flex justify-end">
        <Link href="/forgot-password" size="sm">Forgot password?</Link>
      </div>

      <Button 
        type="submit" 
        color="primary" 
        className="w-full" 
        size="lg"
        isLoading={isLoading}
      >
        Sign in
      </Button>

      <SocialAuth />

      <p className="text-center text-sm">
        Don't have an account?{" "}
        <Link href="/register" size="sm">Sign up</Link>
      </p>
    </form>
  )
}

export default LoginForm
