"use client";

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/admin/login');
      } else if (allowedRoles && !allowedRoles.includes(user.role)) {
        if (user.role === 'ADMIN' || user.role === 'SUPERADMIN') {
          router.replace('/admin');
        } else {
          router.replace('/');
        }
      }
    }
  }, [user, loading, allowedRoles, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#171717]">
        <div className="w-12 h-12 border-4 border-[#8B6B57] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#171717]">
        <div className="w-12 h-12 border-4 border-[#8B6B57] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;
