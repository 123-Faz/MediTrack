// import LoadingSpinner from "@/components/custom/Loader";
// import { useGetCurrentAdmin } from "@/hooks/useGetCurrentAdmin";
// import { getAuthAdminToken } from "@/store/authAdminSlice";
// import { useAppSelector } from "@/store/hooks";
// import { Suspense } from "react";
// import { Navigate } from "react-router-dom";



// interface ChildrenProps {
//   children: React.ReactNode;
// }


// // common
// const LazyLoader = ({ children }: ChildrenProps) => (
//   <Suspense fallback={<LoadingSpinner />}>
//     {children}
//   </Suspense>
// );



// export const GuestAdminRoutes = ({ children }: ChildrenProps) => {
//   const token = useAppSelector(getAuthAdminToken)
//   const { data: admin } = useGetCurrentAdmin()

//   if (token && admin) {
//     return <Navigate to={'/'} replace />
//   }

//   return <LazyLoader>{children}</LazyLoader>
// }
// export const AdminProtectedRoute = ({ children }: ChildrenProps) => {
//   const token = useAppSelector(getAuthAdminToken)
//   const { data: admin, isLoading } = useGetCurrentAdmin()

//   if (!token) return <Navigate to={"/"} replace />

//   if (isLoading) return <LoadingSpinner />

//   if (!admin) return <Navigate to={"/"} replace />

//   return <LazyLoader>{children}</LazyLoader>
// }
import LoadingSpinner from "@/components/custom/Loader";
import { useGetCurrentAdmin } from "@/hooks/useGetCurrentAdmin";
import { useGetCurrentDoctor } from "@/hooks/useGetCurrentDoctor";
import {useGetCurrentUser} from "@/hooks/useGetCurrentUser"
import { getAuthAdminToken } from "@/store/authAdminSlice";
import { getAuthDoctorToken } from "@/store/authDoctorSlice";
import { getAuthToken } from "@/store/authSlice";
import { useAppSelector } from "@/store/hooks";
import { Suspense } from "react";
import { Navigate } from "react-router-dom";


interface ChildrenProps {
  children: React.ReactNode;
}

// common
const LazyLoader = ({ children }: ChildrenProps) => (
  <Suspense fallback={<LoadingSpinner />}>
    {children}
  </Suspense>
);

// Guest Routes - Redirect if already logged in
export const GuestClientRoutes = ({ children }: ChildrenProps) => {
  const token = useAppSelector(getAuthToken)
  const { data: user } = useGetCurrentUser()

  if (token && user) {
    return <Navigate to={'/dashboard'} replace />
  }

  return <LazyLoader>{children}</LazyLoader>
}

export const GuestDoctorRoutes = ({ children }: ChildrenProps) => {
  const token = useAppSelector(getAuthDoctorToken)
  const { data: doctor } = useGetCurrentDoctor()

  if (token && doctor) {
    return <Navigate to={'/drDashboard'} replace />
  }

  return <LazyLoader>{children}</LazyLoader>
}

export const GuestAdminRoutes = ({ children }: ChildrenProps) => {
  const token = useAppSelector(getAuthAdminToken)
  const { data: admin } = useGetCurrentAdmin()

  if (token && admin) {
    return <Navigate to={'/adDashboard'} replace />
  }

  return <LazyLoader>{children}</LazyLoader>
}

// Protected Routes - Redirect if not logged in
export const ClientProtectedRoute = ({ children }: ChildrenProps) => {
  const token = useAppSelector(getAuthToken)
  const { data: user, isLoading } = useGetCurrentUser()

  if (!token) return <Navigate to={"/"} replace />

  if (isLoading) return <LoadingSpinner />

  if (!user) return <Navigate to={"/"} replace />

  return <LazyLoader>{children}</LazyLoader>
}

export const DoctorProtectedRoute = ({ children }: ChildrenProps) => {
  const token = useAppSelector(getAuthDoctorToken)
  const { data: doctor, isLoading } = useGetCurrentDoctor()

  if (!token) return <Navigate to={"/"} replace />

  if (isLoading) return <LoadingSpinner />

  if (!doctor) return <Navigate to={"/"} replace />

  return <LazyLoader>{children}</LazyLoader>
}

export const AdminProtectedRoute = ({ children }: ChildrenProps) => {
  const token = useAppSelector(getAuthAdminToken)
  const { data: admin, isLoading } = useGetCurrentAdmin()

  if (!token) return <Navigate to={"/"} replace />

  if (isLoading) return <LoadingSpinner />

  if (!admin) return <Navigate to={"/"} replace />

  return <LazyLoader>{children}</LazyLoader>
}