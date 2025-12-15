'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import {
  Users,
  ShoppingCart,
  Recycle,
  ChevronLeft
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useAppContext } from '@/context/AppContext';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { Logo } from '@/components/logo';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { countries } from '@/lib/countries';

type BusinessType = 'dropshipper' | 'wholesaler' | 'influencer';

const businessTypes = [
  {
    id: 'dropshipper' as BusinessType,
    icon: Recycle,
    title: 'I am a dropshipper',
    description: 'Dropshippers are retailers who sell products without keeping stock',
  },
  {
    id: 'wholesaler' as BusinessType,
    icon: ShoppingCart,
    title: 'I am a wholesaler',
    description:
      'Wholesalers buy products in bulk, often directly through distributors.',
  },
  {
    id: 'influencer' as BusinessType,
    icon: Users,
    title: "I'm an influencer",
    description: 'Influencers promote brands without inventory.',
  },
];

const wholesalerOptions = [
  'Online business',
  'Brick and mortar',
  'Distributor',
  'Procurement',
  'Manufacturer',
  'Purchaser',
  'Personal',
  'Social media based',
];

const dropshipperOptions = [
    'E-commerce platform',
    'Social media seller',
    'Marketplace seller',
    'Subscription box',
];


export default function BusinessVerificationPage() {
  const [step, setStep] = useState(1);
  const [selectedType, setSelectedType] = useState<BusinessType>('wholesaler');
  const [wholesalerChoices, setWholesalerChoices] = useState<string[]>(['Distributor', 'Purchaser']);
  const [dropshipperChoices, setDropshipperChoices] = useState<string[]>(['E-commerce platform']);
  const [companyInfo, setCompanyInfo] = useState({ name: '', country: 'IN' });

  const { user, submitVerification, isUserLoading } = useAppContext();
  const router = useRouter();
  const { toast } = useToast();

  const handleWholesalerChoiceChange = (option: string) => {
    setWholesalerChoices((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };
  
  const handleDropshipperChoiceChange = (option: string) => {
    setDropshipperChoices((prev) =>
      prev.includes(option)
        ? prev.filter((item) => item !== option)
        : [...prev, option]
    );
  };

  const handleCompanyInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCompanyInfo(prev => ({...prev, [e.target.name]: e.target.value }));
  }

  const handleCountryChange = (value: string) => {
      setCompanyInfo(prev => ({ ...prev, country: value}));
  }

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };


  const handleSubmit = () => {
    if (!user || !user.email) {
        toast({
            title: "Please sign in",
            description: "You must be signed in to submit a verification request.",
            variant: "destructive"
        })
        router.push('/signin');
        return;
    }
    const details = selectedType === 'wholesaler' ? wholesalerChoices : selectedType === 'dropshipper' ? dropshipperChoices : [];
    submitVerification({
        uid: user.uid,
        email: user.email,
        businessType: selectedType,
        details: [...details, `Company: ${companyInfo.name}`, `Country: ${companyInfo.country}`]
    });
  }

  if (isUserLoading) {
      return <div className="flex h-screen items-center justify-center">Loading...</div>
  }
  
  const progressValue = (step / 3) * 100;
  
  const stepTitles: { [key: number]: { title: string, description: string }} = {
      1: { title: "1/3 Business identity", description: "Let us know more about you" },
      2: { title: "2/3 Company information", description: "Provide your company details" },
      3: { title: "3/3 Complete verification", description: "Review and submit your application" },
  }

  return (
    <div className="min-h-screen bg-[#13151A] text-white">
        {/* Custom Header */}
        <header className="absolute top-0 left-0 right-0 z-10 p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link href="/">
                  <Logo />
                </Link>
                 <div className="flex items-center gap-6 text-sm">
                    <Link href="#" className="hover:text-purple-300">Services</Link>
                    <Button variant="ghost">🇮🇳 IN/EN/INR</Button>
                    <Button variant="outline" className="bg-purple-600 border-purple-500 hover:bg-purple-700">S My Business</Button>
                    <ShoppingCart className="h-5 w-5" />
                    <Users className="h-5 w-5" />
                    <Recycle className="h-5 w-5" />
                </div>
            </div>
        </header>

      <div className="relative h-[40vh]">
        <Image
          src="https://images.unsplash.com/photo-1616401784845-180882ba9ba8?q=80&w=2070&auto=format&fit=crop"
          alt="Business background"
          layout="fill"
          objectFit="cover"
          className="opacity-20"
        />
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <h1 className="text-5xl font-bold">Business Verification</h1>
        </div>
      </div>
      
      <main className="-mt-32 relative z-20 pb-16">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-purple-700/80 backdrop-blur-sm p-8 rounded-t-lg">
            <div className="flex items-center gap-4">
              {step > 1 && (
                <Button variant="ghost" size="icon" onClick={handleBack} className="bg-white/10 hover:bg-white/20">
                  <ChevronLeft />
                </Button>
              )}
              <div>
                <h2 className="text-2xl font-semibold">{stepTitles[step].title}</h2>
                <p className="text-purple-200 mt-1">{stepTitles[step].description}</p>
              </div>
            </div>
            <Progress value={progressValue} className="mt-4 h-2 bg-purple-900/70" />
          </div>

          <div className="bg-card text-card-foreground p-8 rounded-b-lg shadow-2xl">
            {step === 1 && (
                <>
                <div className="grid md:grid-cols-3 gap-6">
                {businessTypes.map((type) => (
                    <div
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={cn(
                        'p-6 rounded-lg border-2 cursor-pointer transition-all',
                        selectedType === type.id
                        ? 'bg-primary/10 border-primary shadow-lg'
                        : 'border-border hover:border-primary/50'
                    )}
                    >
                    <type.icon className="h-8 w-8 mb-4 text-primary" />
                    <h3 className="font-bold text-lg mb-2">{type.title}</h3>
                    <p className="text-sm text-muted-foreground">
                        {type.description}
                    </p>

                    {type.id === 'wholesaler' && selectedType === 'wholesaler' && (
                        <div className="mt-6">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                            Options are multiple choice
                        </p>
                        <div className="w-full h-px bg-border my-3"></div>
                        <div className="space-y-3">
                            {wholesalerOptions.map((option) => (
                            <div key={option} className="flex items-center gap-3">
                                <Checkbox
                                id={option}
                                checked={wholesalerChoices.includes(option)}
                                onCheckedChange={() => handleWholesalerChoiceChange(option)}
                                />
                                <label
                                htmlFor={option}
                                className="text-sm font-medium leading-none cursor-pointer"
                                >
                                {option}
                                </label>
                            </div>
                            ))}
                        </div>
                        </div>
                    )}

                    {type.id === 'dropshipper' && selectedType === 'dropshipper' && (
                        <div className="mt-6">
                        <p className="text-sm font-medium text-muted-foreground mb-1">
                            Options are multiple choice
                        </p>
                        <div className="w-full h-px bg-border my-3"></div>
                        <div className="space-y-3">
                            {dropshipperOptions.map((option) => (
                            <div key={option} className="flex items-center gap-3">
                                <Checkbox
                                id={option}
                                checked={dropshipperChoices.includes(option)}
                                onCheckedChange={() => handleDropshipperChoiceChange(option)}
                                />
                                <label
                                htmlFor={option}
                                className="text-sm font-medium leading-none cursor-pointer"
                                >
                                {option}
                                </label>
                            </div>
                            ))}
                        </div>
                        </div>
                    )}
                    </div>
                ))}
                </div>
                <div className="mt-8 flex justify-end">
                    <Button size="lg" className="px-16 bg-purple-600 hover:bg-purple-700" onClick={handleNext}>Next</Button>
                </div>
                </>
            )}

            {step === 2 && (
                <div className='space-y-6'>
                    <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input id="companyName" name="name" value={companyInfo.name} onChange={handleCompanyInfoChange} className="mt-2" placeholder="Your Company Inc."/>
                    </div>
                    <div>
                        <Label htmlFor="country">Country of Registration</Label>
                        <Select onValueChange={handleCountryChange} defaultValue={companyInfo.country}>
                            <SelectTrigger id="country" className="mt-2">
                                <SelectValue placeholder="Select a country" />
                            </SelectTrigger>
                            <SelectContent>
                                {countries.map(country => (
                                    <SelectItem key={country.code} value={country.code}>{country.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                     <div className="mt-8 flex justify-end">
                        <Button size="lg" className="px-16 bg-purple-600 hover:bg-purple-700" onClick={handleNext}>Next</Button>
                    </div>
                </div>
            )}
            
            {step === 3 && (
                 <div className='space-y-6'>
                    <div className="space-y-2">
                        <h3 className="font-semibold text-lg">Review Your Information</h3>
                        <p className="text-muted-foreground">Please confirm the details below before submitting.</p>
                    </div>
                    <div className="p-4 border rounded-lg space-y-3 bg-muted/20">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Business Type:</span>
                            <span className="font-medium capitalize">{selectedType}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Company Name:</span>
                            <span className="font-medium">{companyInfo.name}</span>
                        </div>
                         <div className="flex justify-between">
                            <span className="text-muted-foreground">Country:</span>
                            <span className="font-medium">{countries.find(c => c.code === companyInfo.country)?.name}</span>
                        </div>
                    </div>
                    <p className='text-xs text-muted-foreground'>By clicking "Submit for Verification", you agree to our Terms of Service and Privacy Policy.</p>
                    <div className="mt-8 flex justify-end">
                        <Button size="lg" className="px-12 bg-purple-600 hover:bg-purple-700" onClick={handleSubmit}>Submit for Verification</Button>                    </div>
                 </div>
            )}
          </div>
        </div>
         <footer className="text-center mt-12 text-xs text-muted-foreground">
            <p>©2023 Created by GlobalCart - Privacy Policy - Terms of Use - GlobalCart Business Recommend</p>
        </footer>
      </main>
    </div>
  );
}
