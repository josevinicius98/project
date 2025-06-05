import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, UserX, UserCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { api } from '../../services/api';

type User = {
  id: number;
  name: string;
  email: string;
  role: string;
  active: boolean;
  createdAt: string;
};

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchUsers();
  }, []);
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (error) {
      toast.error('Failed to fetch users');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleUserStatus = async (id: number, active: boolean) => {
    try {
      await api.put(`/users/${id}`, { active: !active });
      
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === id ? { ...user, active: !active } : user
        )
      );
      
      toast.success(`User ${active ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      toast.error('Failed to update user status');
      console.error(error);
    }
  };
  
  const deleteUser = async (id: number) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/users/${id}`);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
      toast.success('User deleted successfully');
    } catch (error) {
      toast.error('Failed to delete user');
      console.error(error);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  const getRoleBadgeClass = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-error-100 text-error-800';
      case 'manager':
        return 'bg-primary-100 text-primary-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <p className="mt-1 text-gray-600">Manage system users and permissions</p>
        </div>
        
        <Link to="/users/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>Add User</Button>
        </Link>
      </div>
      
      <Card>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-500">Loading users...</p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <p className="text-gray-500">No users found</p>
            <Link to="/users/new" className="mt-2">
              <Button size="sm">Add User</Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Role</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Created At</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        user.active
                          ? 'bg-success-100 text-success-800'
                          : 'bg-error-100 text-error-800'
                      }`}
                    >
                      {user.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link to={`/users/${user.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          leftIcon={<Edit className="h-4 w-4" />}
                        >
                          Edit
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={
                          user.active ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )
                        }
                        onClick={() => toggleUserStatus(user.id, user.active)}
                      >
                        {user.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={<Trash2 className="h-4 w-4" />}
                        onClick={() => deleteUser(user.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </div>
  );
}