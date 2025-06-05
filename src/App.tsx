import { Suspense, lazy } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import PrivateRoute from './components/auth/PrivateRoute';
import { useAuth } from './hooks/useAuth';

// Lazy-loaded routes for better performance
const Users = lazy(() => import('./pages/users/Users'));
const UserForm = lazy(() => import('./pages/users/UserForm'));
const Clients = lazy(() => import('./pages/clients/Clients'));
const ClientForm = lazy(() => import('./pages/ClientForm'));
const Suppliers = lazy(() => import('./pages/suppliers/Suppliers'));
const SupplierForm = lazy(() => import('./pages/suppliers/SupplierForm'));
const Products = lazy(() => import('./pages/products/Products'));
const ProductForm = lazy(() => import('./pages/products/ProductForm'));
const AccountsPayable = lazy(() => import('./pages/accounts/AccountsPayable'));
const AccountPayableForm = lazy(() => import('./pages/accounts/AccountPayableForm'));
const AccountsReceivable = lazy(() => import('./pages/accounts/AccountsReceivable'));
const AccountReceivableForm = lazy(() => import('./pages/accounts/AccountReceivableForm'));
const NotFound = lazy(() => import('./pages/NotFound'));
const Suppliers = lazy(() => import('./pages/suppliers/Suppliers')); //
const SupplierForm = lazy(() => import('./pages/suppliers/SupplierForm')); 

function App() {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-screen items-center justify-center bg-gray-50">
          <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
        </div>
      }
    >
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/\" replace />} />
        
        <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
          <Route index element={<Dashboard />} />
          
          <Route path="users">
            <Route index element={<Users />} />
            <Route path="new" element={<UserForm />} />
            <Route path=":id" element={<UserForm />} />
          </Route>
          
          <Route path="clients">
            <Route index element={<Clients />} />
            <Route path="new" element={<ClientForm />} />
            <Route path=":id" element={<ClientForm />} />
          </Route>
          
          <Route path="suppliers">
            <Route index element={<Suppliers />} />
            <Route path="new" element={<SupplierForm />} />
            <Route path=":id" element={<SupplierForm />} />
          </Route>
          
          <Route path="products">
            <Route index element={<Products />} />
            <Route path="new" element={<ProductForm />} />
            <Route path=":id" element={<ProductForm />} />
          </Route>
          
          <Route path="accounts-payable">
            <Route index element={<AccountsPayable />} />
            <Route path="new" element={<AccountPayableForm />} />
            <Route path=":id" element={<AccountPayableForm />} />
          </Route>
          
          <Route path="accounts-receivable">
            <Route index element={<AccountsReceivable />} />
            <Route path="new" element={<AccountReceivableForm />} />
            <Route path=":id" element={<AccountReceivableForm />} />
          </Route>
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
}

export default App;