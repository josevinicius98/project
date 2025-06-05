import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

type HeaderProps = {
  onMenuClick: () => void;
};

export default function Header({ onMenuClick }: HeaderProps) {
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between bg-white px-4 shadow-sm md:px-6">
      <button
        className="rounded-md p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 md:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </button>
      
      <div className="flex items-center space-x-4">
        <button className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700">
          <Bell className="h-6 w-6" />
        </button>
        
        <div className="flex items-center space-x-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-600 text-white">
            {user?.name.charAt(0)}
          </div>
          
          <div className="hidden md:block">
            <p className="text-sm font-medium text-gray-700">{user?.name}</p>
            <p className="text-xs text-gray-500">{user?.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
}