import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building, Briefcase, ShoppingCart, DollarSign, BarChart2 } from 'lucide-react';
import Card from '../components/ui/Card';
import { api } from '../services/api';

type StatCard = {
  title: string;
  value: number;
  icon: JSX.Element;
  color: string;
  path: string;
};

type RecentActivity = {
  id: number;
  type: string;
  description: string;
  date: string;
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    clients: 0,
    suppliers: 0,
    products: 0,
    users: 0,
    accountsPayable: 0,
    accountsReceivable: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  
  useEffect(() => {
    // In a real app, this would fetch actual data from the API
    const fetchDashboardData = async () => {
      try {
        // Simulating API calls
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        // Simulated data
        setStats({
          clients: 47,
          suppliers: 23,
          products: 156,
          users: 12,
          accountsPayable: 28,
          accountsReceivable: 42,
        });
        
        setRecentActivity([
          { id: 1, type: 'client', description: 'New client added: ABC Corporation', date: '2025-06-15T14:30:00Z' },
          { id: 2, type: 'product', description: 'Product stock updated: Office Chair', date: '2025-06-15T11:45:00Z' },
          { id: 3, type: 'accounts', description: 'Invoice #1234 paid by Acme Inc.', date: '2025-06-14T16:20:00Z' },
          { id: 4, type: 'supplier', description: 'New order placed with XYZ Supplies', date: '2025-06-14T10:15:00Z' },
          { id: 5, type: 'accounts', description: 'Payment sent to Global Services', date: '2025-06-13T15:30:00Z' },
        ]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);
  
  const statCards: StatCard[] = [
    {
      title: 'Clients',
      value: stats.clients,
      icon: <Building className="h-6 w-6" />,
      color: 'bg-primary-50 text-primary-600',
      path: '/clients',
    },
    {
      title: 'Suppliers',
      value: stats.suppliers,
      icon: <Briefcase className="h-6 w-6" />,
      color: 'bg-secondary-50 text-secondary-600',
      path: '/suppliers',
    },
    {
      title: 'Products',
      value: stats.products,
      icon: <ShoppingCart className="h-6 w-6" />,
      color: 'bg-accent-50 text-accent-600',
      path: '/products',
    },
    {
      title: 'Users',
      value: stats.users,
      icon: <Users className="h-6 w-6" />,
      color: 'bg-success-50 text-success-600',
      path: '/users',
    },
    {
      title: 'Accounts Payable',
      value: stats.accountsPayable,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-warning-50 text-warning-600',
      path: '/accounts-payable',
    },
    {
      title: 'Accounts Receivable',
      value: stats.accountsReceivable,
      icon: <DollarSign className="h-6 w-6" />,
      color: 'bg-error-50 text-error-600',
      path: '/accounts-receivable',
    },
  ];
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-1 text-gray-600">Overview of your business</p>
      </div>
      
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="h-32 animate-pulse rounded-lg bg-gray-200"></div>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statCards.map((card) => (
            <Link key={card.title} to={card.path}>
              <Card className="transition duration-200 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{card.title}</p>
                    <p className="mt-1 text-3xl font-semibold text-gray-900">{card.value}</p>
                  </div>
                  <div className={`rounded-full p-3 ${card.color}`}>{card.icon}</div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
      
      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Recent Activity">
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex animate-pulse space-x-4">
                  <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                  <div className="flex-1 space-y-2 py-1">
                    <div className="h-4 rounded bg-gray-200"></div>
                    <div className="h-4 w-5/6 rounded bg-gray-200"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className="rounded-full bg-gray-100 p-2">
                    {activity.type === 'client' && <Building className="h-5 w-5 text-primary-600" />}
                    {activity.type === 'supplier' && <Briefcase className="h-5 w-5 text-secondary-600" />}
                    {activity.type === 'product' && <ShoppingCart className="h-5 w-5 text-accent-600" />}
                    {activity.type === 'accounts' && <DollarSign className="h-5 w-5 text-warning-600" />}
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">{activity.description}</p>
                    <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
        
        <Card title="Business Overview">
          <div className="flex h-64 items-center justify-center">
            <div className="text-center">
              <BarChart2 className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-600">
                Business analytics will be displayed here.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}