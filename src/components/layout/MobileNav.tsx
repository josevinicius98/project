import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Building, Briefcase, ShoppingCart, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';

type NavItem = {
  name: string;
  path: string;
  icon: JSX.Element;
};

export default function MobileNav() {
  const { pathname } = useLocation();
  
  const navigation: NavItem[] = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: 'Users', path: '/users', icon: <Users className="h-5 w-5" /> },
    { name: 'Clients', path: '/clients', icon: <Building className="h-5 w-5" /> },
    { name: 'Suppliers', path: '/suppliers', icon: <Briefcase className="h-5 w-5" /> },
    { name: 'Products', path: '/products', icon: <ShoppingCart className="h-5 w-5" /> },
    { name: 'Payable', path: '/accounts-payable', icon: <ArrowUpCircle className="h-5 w-5" /> },
    { name: 'Receivable', path: '/accounts-receivable', icon: <ArrowDownCircle className="h-5 w-5" /> },
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-10 border-t border-gray-200 bg-white shadow-lg md:hidden">
      <nav className="flex justify-around">
        {navigation.map((item) => {
          const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
          
          return (
            <Link
              key={item.name}
              to={item.path}
              className={`flex flex-1 flex-col items-center justify-center py-3 ${
                isActive ? 'text-primary-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {item.icon}
              <span className="mt-1 text-xs">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}