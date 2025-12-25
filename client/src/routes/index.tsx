// import MainLayout from "../layout/MainLayout";
// import { useRoutes } from "react-router-dom";
// import { lazy } from "react";
// import ClientDashboard from "@/layout/userDashboard/index"
// import { AdminProtectedRoute } from "./ProtectedRoutes";
// import AdDashboard from "@/layout/adminDashboard/index"
// import DrDashboard from "@/layout/doctorDashboard/index"

// // fronend components
// const HomePage = lazy(() => import("@/pages/home"));
// const ContactPage = lazy(() => import("@/pages/contact"));
// const AboutPage = lazy(() => import("@/pages/about"));
// const Doctors = lazy(() => import("@/pages/doctors"));
// const Appointments = lazy(() => import("@/pages/apointments"));


// const MyPrescription = lazy(() => import("@/pages/client/MyPrescriptions"));
// const Doctor = lazy(() => import("@/pages/client/Doctors/DoctorList"));
// const MyAppintments = lazy(() => import("@/pages/client/MyAppointments"));
// const NewAppointments = lazy(() => import("@/pages/client/NewAppointment"));
// const Report = lazy(() => import("@/pages/client/ReportFiles"));
// const Dashboard = lazy(() => import("@/pages/client/Dashboard"));

// const AllUser = lazy(() => import("@/pages/admin/AllUser"));
// const AllAppointments = lazy(() => import("@/pages/admin/AllAppointments"));
// const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));

// const DoctorDashboard = lazy(() => import("@/pages/doctor/Dashboard"));
// const MySchedules = lazy(() => import("@/pages/doctor/MySchedules"));
// const MyPatients = lazy(() => import("@/pages/doctor/MyPatients"));
// const Treatment = lazy(() => import("@/pages/doctor/Treatment"));





// const Router = () => {
// 	const routes = [
// 		{
// 			path: "/",
// 			element: <MainLayout />,
// 			children: [
// 				{
// 					index: true,
// 					element: <HomePage />,
// 				},
// 				{
// 					path: "doctors",
// 					element: <Doctors />,
// 				},
// 				{
// 					path: "apointments",
// 					element: <Appointments />,
// 				},
// 				{
// 					path: "about",
// 					element: <AboutPage />,
// 				},
// 				{
// 					path: "contact",
// 					element: <ContactPage />,
// 				},
// 			],
// 		},

//        // ✅ Admin Protected Routes
//     {
//       path: "/adDashboard",
//       element: (
//         <AdminProtectedRoute>
//           <AdDashboard />
//         </AdminProtectedRoute>
//       ),
//       children: [
//         { index: true, element: <AdminDashboard /> },
//         { path: "appointments", element: <AllAppointments /> },
//         { path: "myUsers", element: <AllUser /> },
//         // { path: "notifications", element: <AdminNotifications /> },
//         // { path: "reports", element: <AdminReports /> },
//         // { path: "settings", element: <AdminSettings /> },
//       ],
//     },


//         {
//       path: "/drDashboard",
//       element: (
//         <DrDashboard />
//       ),
//       children: [
//         { index: true, element: <DoctorDashboard /> },
//         { path: "schedules", element: <MySchedules /> },
//         { path: "patients", element: <MyPatients /> },
//         { path: "treatment", element: <Treatment /> },
//         // { path: "notifications", element: <AdminNotifications /> },
//         // { path: "reports", element: <AdminReports /> },
//         // { path: "settings", element: <AdminSettings /> },
//       ],
//     },

// 		{
//       path: "/dashboard",
//       element: (
//           <ClientDashboard />
//       ),
//       children: [
//         { index: true, element: <Dashboard /> },
//         { path: "newappoinments", element: <NewAppointments /> },
//         { path: "myappointments", element: <MyAppintments /> },
//         { path: "myprescriptions", element: <MyPrescription /> },
//         { path: "doctors", element: <Doctor /> },
//         { path: "report", element: <Report /> },
//       ],
//     },

		
// 	];
// 	return useRoutes(routes);
// };

// export default Router;
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

const MyPrescription = lazy(() => import("@/pages/client/MyPrescriptions"));
const Doctor = lazy(() => import("@/pages/client/DoctorList"));
const MyAppintments = lazy(() => import("@/pages/client/MyAppointments"));
const NewAppointments = lazy(() => import("@/pages/client/NewAppointment"));
const Report = lazy(() => import("@/pages/client/ReportFiles"));
const Dashboard = lazy(() => import("@/pages/client/Dashboard"));

const AllUser = lazy(() => import("@/pages/admin/AllUser"));
const AllDOctors = lazy(() => import("@/pages/admin/AllDoctors"));
const AdminDashboard = lazy(() => import("@/pages/admin/Dashboard"));

const DoctorDashboard = lazy(() => import("@/pages/doctor/Dashboard"));
const MySchedules = lazy(() => import("@/pages/doctor/MySchedules"));
const Treatment = lazy(() => import("@/pages/doctor/Treatment"));
const MyAppointments = lazy(() => import ("@/pages/doctor/MyAppointments"))

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
			],
		},
	];
	return useRoutes(routes);
};

export default Router;