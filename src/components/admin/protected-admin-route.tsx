'use client'

import { useUserAuth } from '@/context/user-auth-context'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function ProtectedAdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, isLoading } = useUserAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        router.push('/admin/login')
      } else if (!profile?.is_admin) {
        router.push('/')
      }
    }
  }, [user, profile, isLoading, router])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Verifying access...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile?.is_admin) return null

  return <>{children}</>
}

// 'use client';

// import { useEffect } from 'react';
// import { useRouter } from 'next/navigation';
// import { useAdminAuth } from '@/context/admin-auth-context';
// import { Loader2 } from 'lucide-react';

// interface ProtectedAdminRouteProps {
//   children: React.ReactNode;
// }

// export default function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
//   const { isAuthenticated, isLoading } = useAdminAuth();
//   const router = useRouter();

//   useEffect(() => {
//     if (!isLoading && !isAuthenticated) {
//       router.push('/admin/login');
//     }
//   }, [isAuthenticated, isLoading, router]);

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
//           <p className="text-gray-600">
//             <span className="font-headline text-2xl font-bold text-primary tracking-wider">Luméra</span>
//           </p>
//         </div>
//       </div>
//     );
//   }

//   if (!isAuthenticated) {
//     return null; // Will redirect to login
//   }

//   return <>{children}</>;
// }
