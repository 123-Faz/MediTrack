import MainLayout from "../layout/MainLayout";
import { useRoutes } from "react-router-dom";
import { lazy } from "react";
import ClientDashboard from "@/layout/userDashboard/index"
import { AdminProtectedRoute, DoctorProtectedRoute, ClientProtectedRoute } from "./ProtectedRoutes";
import AdDashboard from "@/layout/adminDashboard/index"
import DrDashboard from "@/layout/doctorDashboard/index"


// frontend components
const HomePage = lazy(() => import("@/pages/home"));
const ContactPage = lazy(() => import("@/pages/contact"));
const AboutPage = lazy(() => import("@/pages/about"));
const Doctors = lazy(() => import("@/pages/doctors"));
const Appointments = lazy(() => import("@/pages/apointments"));
const ResetPassword = lazy(() => import("@/pages/client/auth/ResetPassword"));

const MyPrescription = lazy(() => import("@/pages/client/MyPrescriptions"));
const Doctor = lazy(() => import("@/pages/client/DoctorList"));
const MyAppintments = lazy(() => import("@/pages/client/MyAppointments"));
const NewAppointments = lazy(() => import("@/pages/client/NewAppointment"));
const Report = lazy(() => import("@/pages/client/ReportFiles"));
const Profile = lazy(() => import("@/pages/client/Profile"));
const Settings = lazy(() => import("@/pages/client/Settings"));
const Dashboard = lazy(() => import("@/pages/client/Dashboard"));

const AllUser = lazy(() => import("@/pages/admin/AllUser"));
const AllDOctors = lazy(() => import("@/pages/admin/AllDoctors"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));
const Ad_Profile = lazy(() => import("@/pages/admin/Profile"));

const DoctorDashboard = lazy(() => import("@/pages/doctor/Dashboard"));
const MySchedules = lazy(() => import("@/pages/doctor/MySchedules"));
const Treatment = lazy(() => import("@/pages/doctor/Treatment"));
const MyAppointments = lazy(() => import("@/pages/doctor/MyAppointments"))
const DR_Profile = lazy(() => import("@/pages/doctor/Profile"))

const Router = () => {
	const routes = [
		{
			path: "/",
			element: <MainLayout />,
			children: [
				{
					index: true,
					element: <HomePage />,
				},
				{
					path: "doctors",
					element: <Doctors />,
				},
				{
					path: "apointments",
					element: <Appointments />,
				},
				{
					path: "about",
					element: <AboutPage />,
				},
				{
					path: "contact",
					element: <ContactPage />,
				},
				{
					path: "reset-password",
					element: <ResetPassword />,
				},
			],
		},

		// ✅ Admin Protected Routes
		{
			path: "/adDashboard",
			element: (
				<AdminProtectedRoute>
					<AdDashboard />
				</AdminProtectedRoute>
			),
			children: [
				{ index: true, element: <AdminDashboard /> },
				{ path: "appointments", element: <AllDOctors /> },
				{ path: "myUsers", element: <AllUser /> },
				{ path: "profile", element: <Ad_Profile /> },
				// { path: "notifications", element: <AdminNotifications /> },
				// { path: "reports", element: <AdminReports /> },
				// { path: "settings", element: <AdminSettings /> },
			],
		},

		// ✅ Doctor Protected Routes
		{
			path: "/drDashboard",
			element: (
				<DoctorProtectedRoute>
					<DrDashboard />
				</DoctorProtectedRoute>
			),
			children: [
				{ index: true, element: <DoctorDashboard /> },
				{ path: "schedules", element: <MySchedules /> },
				{ path: "appointments", element: <MyAppointments /> },
				{ path: "treatment", element: <Treatment /> },
				{ path: "profile", element: <DR_Profile /> },
				// { path: "notifications", element: <AdminNotifications /> },
				// { path: "reports", element: <AdminReports /> },
				// { path: "settings", element: <AdminSettings /> },
			],
		},

		// ✅ Client Protected Routes
		{
			path: "/dashboard",
			element: (
				<ClientProtectedRoute>
					<ClientDashboard />
				</ClientProtectedRoute>
			),
			children: [
				{ index: true, element: <Dashboard /> },
				{ path: "newappoinments", element: <NewAppointments /> },
				{ path: "myappointments", element: <MyAppintments /> },
				{ path: "myprescriptions", element: <MyPrescription /> },
				{ path: "doctors", element: <Doctor /> },
				{ path: "report", element: <Report /> },
				{ path: "profile", element: <Profile /> },
				{ path: "settings", element: <Settings /> },
			],
		},
	];
	return useRoutes(routes);
};

export default Router;