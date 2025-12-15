'use client';

import React, { createContext, useContext, useState, ReactNode, useMemo, useCallback, useEffect } from 'react';
import type { Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { products as initialProducts } from '@/lib/data';

// Type for a single item in the cart
export type CartItem = {
  productId: string;
  quantity: number;
  product: Product;
};

// Type for a simulated user
type User = {
  id: string;
  email: string;
  storeName?: string; 
  role: 'user' | 'seller' | 'admin';
};

type Banner = {
    title: string;
    imageUrl: string;
}

export type BusinessVerification = {
    id: string;
    uid: string;
    email: string;
    businessType: string;
    details: string[];
    status: 'Pending' | 'Approved' | 'Rejected';
}

// The shape of our context
interface AppContextType {
  user: User | null;
  userInfo: User | null;
  isAdmin: boolean;
  isSeller: boolean;
  cart: CartItem[];
  products: Product[];
  isUserLoading: boolean;
  isProductsLoading: boolean;
  banner: Banner;
  verifications: BusinessVerification[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, newQuantity: number) => void;
  signIn: (email: string, password?: string) => Promise<void>;
  signOut: () => void;
  setBanner: (title: string, imageUrl: string) => void;
  addProduct: (product: Omit<Product, 'id' | 'rating' | 'reviews' | 'sold' | 'published'>) => void;
  removeProduct: (productId: string) => void;
  toggleProductPublication: (productId: string) => void;
  submitVerification: (data: Omit<BusinessVerification, 'id' | 'status'>) => void;
  updateVerificationStatus: (id: string, status: BusinessVerification['status']) => void;
}

// Create the context with a default undefined value
const AppContext = createContext<AppContextType | undefined>(undefined);

// Dummy user data for demonstration
const initialDummyUsers: User[] = [
    { id: '1', email: 'user@example.com', role: 'user' },
    { id: '2', email: 'seller@example.com', role: 'seller', storeName: "The Seller's Store" },
    { id: '3', email: 'admin@example.com', role: 'admin' },
];

const getUsersFromStorage = (): User[] => {
    if (typeof window === 'undefined') return initialDummyUsers;
    const storedUsers = localStorage.getItem('dummyUsers');
    return storedUsers ? JSON.parse(storedUsers) : initialDummyUsers;
}

const saveUsersToStorage = (users: User[]) => {
    if (typeof window !== 'undefined') {
        localStorage.setItem('dummyUsers', JSON.stringify(users));
    }
}


// The provider component
export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [dummyUsers, setDummyUsers] = useState<User[]>(getUsersFromStorage);
  const [isUserLoading, setIsUserLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [isProductsLoading, setIsProductsLoading] = useState(true);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [banner, setBannerState] = useState<Banner>({
      title: "Seasonal hot picks",
      imageUrl: "https://images.unsplash.com/photo-1667409702771-14213044ccc7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw4fHxibGFjayUyMGZyaWRheXxlbnwwfHx8fDE3NjM5OTYzMTh8MA&ixlib=rb-4.1.0&q=80&w=1080"
  })
  const [verifications, setVerifications] = useState<BusinessVerification[]>([]);
  const { toast } = useToast();
  const router = useRouter();
  
  useEffect(() => {
    // Simulate checking for a logged-in user
    setIsUserLoading(true);
    const loggedInUserEmail = typeof window !== 'undefined' ? localStorage.getItem('loggedInUser') : null;
    if (loggedInUserEmail) {
      const allUsers = getUsersFromStorage();
      const foundUser = allUsers.find(u => u.email === loggedInUserEmail) || null;
      setUser(foundUser);
    }
    setIsUserLoading(false);

    // Simulate fetching products
    setIsProductsLoading(true);
    setTimeout(() => {
        setProducts(initialProducts);
        setIsProductsLoading(false);
    }, 2500);

  }, []);

  useEffect(() => {
      saveUsersToStorage(dummyUsers);
  }, [dummyUsers]);

  const isAdmin = useMemo(() => user?.role === 'admin', [user]);
  const isSeller = useMemo(() => user?.role === 'seller', [user]);

 const signIn = async (email: string, password?: string): Promise<void> => {
    return new Promise((resolve) => {
      setIsUserLoading(true);
      
      setTimeout(() => {
        const allUsers = getUsersFromStorage();
        let foundUser = allUsers.find(u => u.email === email);

        if (!foundUser) {
            // New user registration
            foundUser = { id: String(allUsers.length + 1), email, role: 'user' };
            const newUsers = [...allUsers, foundUser];
            setDummyUsers(newUsers);
        } else {
            // Existing user login
            if ((foundUser.role === 'seller' || foundUser.role === 'admin')) {
                // For sellers/admins, if no password is provided during sign-in attempt,
                // it might be the first login after approval. Default to 'password'.
                const effectivePassword = password ?? 'password';
                if (effectivePassword !== 'password') {
                    toast({ variant: 'destructive', title: 'Sign In Failed', description: 'Invalid email or password.' });
                    setIsUserLoading(false);
                    resolve();
                    return;
                }
            }
        }
        
        setUser(foundUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('loggedInUser', foundUser.email);
        }

        if (foundUser.role === 'seller') {
            router.replace('/seller');
        } else if (foundUser.role === 'admin') {
            router.replace('/admin');
        } else {
            router.replace('/');
        }
        
        setIsUserLoading(false);
        resolve();
      }, 500);
    });
  };


  const signOut = () => {
    setUser(null);
     if (typeof window !== 'undefined') {
        localStorage.removeItem('loggedInUser');
     }
    router.push('/');
  };

  const addToCart = (product: Product, quantity = 1) => {
    if (!user) {
      toast({ title: 'Please sign in', description: 'You need to be signed in to add items to your cart.', variant: 'destructive'});
      router.push('/signin');
      return;
    }
    if (!product.published) {
      toast({ title: 'Product Not Available', description: 'This product is currently not available for purchase.', variant: 'destructive' });
      return;
    }
    setCart((prevCart) => {
      const existingItem = prevCart.find(item => item.productId === product.id);
      if (existingItem) {
        return prevCart.map(item =>
          item.productId === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prevCart, { productId: product.id, quantity, product }];
    });
    toast({ title: 'Added to cart', description: `${product.name} has been added to your cart.` });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter(item => item.productId !== productId));
  };

  const updateCartQuantity = (productId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart((prevCart) =>
        prevCart.map(item =>
          item.productId === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  };
  
  const setBanner = useCallback((title: string, imageUrl: string) => {
    setBannerState({ title, imageUrl });
  }, []);
  
  const addProduct = useCallback((newProductData: Omit<Product, 'id' | 'rating' | 'reviews' | 'sold' | 'published'>) => {
    setProducts(prev => {
        const newProduct: Product = {
            id: String(prev.length + 1),
            ...newProductData,
            rating: 0,
            reviews: 0,
            sold: 0,
            published: false,
        };
        return [...prev, newProduct];
    });
    toast({
        title: "Product Added",
        description: `${newProductData.name} has been added as a draft.`
    })
  }, []);

  const removeProduct = useCallback((productId: string) => {
    setProducts(prev => prev.filter(p => p.id !== productId));
    toast({
        title: 'Product Removed',
        description: 'The product has been successfully removed.',
        variant: 'destructive'
    })
  }, []);

  const toggleProductPublication = useCallback((productId: string) => {
      setProducts(prev => prev.map(p => {
          if (p.id === productId) {
              toast({
                  title: !p.published ? 'Product Published' : 'Product Unpublished',
                  description: `${p.name} is now ${!p.published ? 'visible on' : 'hidden from'} the main site.`
              })
              return { ...p, published: !p.published };
          }
          return p;
      }))
  }, [toast]);

  const submitVerification = useCallback((data: Omit<BusinessVerification, 'id' | 'status'>) => {
    const newVerification: BusinessVerification = {
        id: String(verifications.length + 1),
        ...data,
        status: 'Pending'
    }
    setVerifications(prev => [...prev, newVerification]);
    toast({
        title: "Verification Submitted",
        description: "Your business verification has been sent to the admin for review.",
    });
    router.push('/ownshopplus');
  }, [verifications.length, router, toast]);

  const updateVerificationStatus = useCallback((id: string, status: BusinessVerification['status']) => {
    let verificationEmail = '';
    setVerifications(prev => prev.map(v => {
        if (v.id === id) {
            verificationEmail = v.email;
            return { ...v, status };
        }
        return v;
    }));

    if (status === 'Approved' && verificationEmail) {
        setDummyUsers(currentUsers => {
            const userExists = currentUsers.some(u => u.email === verificationEmail);
            let updatedUsers;
            if (userExists) {
                updatedUsers = currentUsers.map(u => 
                    u.email === verificationEmail 
                    ? { ...u, role: 'seller', storeName: u.storeName || `${verificationEmail.split('@')[0]}'s Store` }
                    : u
                );
            } else {
                const newUser: User = {
                    id: String(currentUsers.length + 1),
                    email: verificationEmail,
                    role: 'seller',
                    storeName: `${verificationEmail.split('@')[0]}'s Store`,
                };
                updatedUsers = [...currentUsers, newUser];
            }
            return updatedUsers;
        });

        setTimeout(() => {
            toast({
                title: `Verification ${status}`,
                description: `${verificationEmail} is now a seller.`
            });
        }, 0);
    } else if (verificationEmail) {
        setTimeout(() => {
            toast({
                title: `Verification ${status}`,
                description: `The business verification for ${verificationEmail} has been ${status.toLowerCase()}.`
            });
        }, 0);
    }
  }, [toast]);

  const value = {
    user,
    userInfo: user,
    isAdmin,
    isSeller,
    cart,
    products,
    isUserLoading,
    isProductsLoading,
    banner,
    verifications,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    signIn,
    signOut,
    setBanner,
    addProduct,
    removeProduct,
    toggleProductPublication,
    submitVerification,
    updateVerificationStatus
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

// Custom hook to use the AppContext
export function useAppContext() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
}
