import { Link, useLocation } from 'react-router-dom';
import { X, LayoutDashboard, Users, Building, Briefcase, ShoppingCart, ArrowUpCircle, ArrowDownCircle, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

type SidebarProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

type NavItem = {
  name: string;
  path: string;
  icon: JSX.Element;
};

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { pathname } = useLocation();
  const { logout } = useAuth();
  
  const navigation: NavItem[] = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Users', path: '/users', icon: <Users className="h-5 w-5" /> },
    { name: 'Clients', path: '/clients', icon: <Building className="h-5 w-5" /> },
    { name: 'Suppliers', path: '/suppliers', icon: <Briefcase className="h-5 w-5" /> },
    { name: 'Products', path: '/products', icon: <ShoppingCart className="h-5 w-5" /> },
    { name: 'Accounts Payable', path: '/accounts-payable', icon: <ArrowUpCircle className="h-5 w-5" /> },
    { name: 'Accounts Receivable', path: '/accounts-receivable', icon: <ArrowDownCircle className="h-5 w-5" /> },
  ];
  
  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 transition-opacity md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 transform bg-white shadow-lg transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-5">
            <h1 className="text-xl font-bold text-primary-600">ERP System</h1>
            <button
              className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {navigation.map((item) => {
                const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
                
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center rounded-md px-3 py-2 text-sm font-medium ${
                      isActive
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    <span className={`mr-3 ${isActive ? 'text-primary-600' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                );
              })}
            </nav>
          </div>
          
          <div className="border-t border-gray-200 px-2 py-4">
            <button
              className="group flex w-full items-center rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-gray-900"
              onClick={() => {
                logout();
                setIsOpen(false);
              }}
            >
              <LogOut className="mr-3 h-5 w-5 text-gray-500" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
}