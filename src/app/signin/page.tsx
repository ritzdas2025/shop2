'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAppContext } from '@/context/AppContext';
import Image from 'next/image';
import { ShieldCheck } from 'lucide-react';
import { GoogleIcon, FacebookIcon, AppleIcon } from '@/components/icons';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  password: z.string().optional(),
});

export default function SignInPage() {
  const router = useRouter();
  const { user, isUserLoading, signIn } = useAppContext();
  const { toast } = useToast();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await signIn(values.email, values.password);
  }

  useEffect(() => {
    if (!isUserLoading && user) {
        if(user.role === 'seller') router.replace('/seller');
        else if(user.role === 'admin') router.replace('/admin');
        else router.replace('/');
    }
  }, [user, isUserLoading, router]);

  if (!isMounted || isUserLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Loading...
      </div>
    );
  }

  // If user is logged in, don't show the form, show loading until redirect happens.
  if (user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Redirecting...
      </div>
    );
  }


  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/20 p-4">
      <div className="flex w-full max-w-4xl bg-background rounded-lg shadow-2xl overflow-hidden">
        <div className="hidden md:block md:w-1/2 relative">
          <Image
            src="https://picsum.photos/seed/signin/800/1200"
            alt="New shoppers promotion"
            fill
            className="object-cover"
            data-ai-hint="woman relaxing"
          />
          <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-8 text-white">
            <h2 className="text-4xl font-bold">New shoppers get up to 70% off</h2>
          </div>
        </div>
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
          <h1 className="text-2xl font-bold">Register/Sign in</h1>
          <p className="text-sm text-muted-foreground flex items-center gap-1.5 mt-2">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Your information is protected</span>
          </p>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="mt-8 space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                     <FormLabel className="sr-only">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Password (optional)"
                        className="h-12"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 text-base" size="lg" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Continuing...' : 'Continue'}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-4">
            <Link href="#" className="text-sm text-primary hover:underline">
                Trouble signing in?
            </Link>
          </div>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
          
          <div className="space-y-3">
             <Button variant="outline" className="w-full h-12 text-base justify-center gap-3" size="lg">
                <GoogleIcon className="w-6 h-6" />
                <span>google</span>
            </Button>
            <Button variant="outline" className="w-full h-12 text-base justify-center gap-3" size="lg">
                <FacebookIcon className="w-6 h-6" />
                <span>facebook</span>
            </Button>
            <Button variant="outline" className="w-full h-12 text-base justify-center gap-3" size="lg">
                <AppleIcon className="w-6 h-6" />
                <span>apple</span>
            </Button>
          </div>

            <p className="mt-8 text-xs text-muted-foreground text-center">
                By continuing, you confirm that you are an adult and have read and accepted our{' '}
                <Link href="#" className="underline hover:text-primary">Membership Agreement</Link> and{' '}
                <Link href="#" className="underline hover:text-primary">Privacy Policy</Link>.
            </p>
        </div>
      </div>
    </div>
  );
}
