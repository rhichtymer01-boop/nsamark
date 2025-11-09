import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

import { AppLayout } from './layouts/AppLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoadingScreen } from './components/feedback/LoadingScreen';

const HomePage = lazy(() => import('./pages/HomePage'));
const VendorDashboardPage = lazy(() => import('./pages/dashboard/VendorDashboardPage'));
const TransporterDashboardPage = lazy(() => import('./pages/dashboard/TransporterDashboardPage'));
const AdminDashboardPage = lazy(() => import('./pages/dashboard/AdminDashboardPage'));
const ProductsPage = lazy(() => import('./pages/ProductsPage'));
const ClassifiedsPage = lazy(() => import('./pages/ClassifiedsPage'));
const ChatPage = lazy(() => import('./pages/ChatPage'));
const InternetVendorsPage = lazy(() => import('./pages/InternetVendorsPage'));

const App = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/classifieds" element={<ClassifiedsPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/internet-vendors" element={<InternetVendorsPage />} />

          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="vendor" replace />} />
            <Route path="vendor" element={<VendorDashboardPage />} />
            <Route path="transporter" element={<TransporterDashboardPage />} />
            <Route path="admin" element={<AdminDashboardPage />} />
          </Route>
        </Route>
      </Routes>
    </Suspense>
  );
};

export default App;
