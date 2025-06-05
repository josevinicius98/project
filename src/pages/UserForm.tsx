import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowLeft } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import Card from '../../components/ui/Card';
import { api } from '../../services/api';

type UserFormData = {
  name: string;
  email: string;
  password: string;
  role: string;
  active: boolean;
};

export default function UserForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<UserFormData>();
  
  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);
  
  const fetchUser = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/users/${id}`);
      reset(response.data);
    } catch (error) {
      toast.error('Failed to fetch user');
      navigate('/users');
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmit = async (data: UserFormData) => {
    try {
      setIsLoading(true);
      
      if (id) {
        await api.put(`/users/${id}`, data);
        toast.success('User updated successfully');
      } else {
        await api.post('/users', data);
        toast.success('User created successfully');
      }
      
      navigate('/users');
    } catch (error) {
      toast.error(id ? 'Failed to update user' : 'Failed to create user');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Edit User' : 'New User'}
          </h1>
          <p className="mt-1 text-gray-600">
            {id ? 'Update user information' : 'Create a new user'}
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => navigate('/users')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back
        </Button>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Name"
              error={errors.name?.message}
              {...register('name', {
                required: 'Name is required',
              })}
            />
            
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address',
                },
              })}
            />
            
            {!id && (
              <Input
                label="Password"
                type="password"
                error={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
            )}
            
            <Select
              label="Role"
              options={[
                { value: 'admin', label: 'Admin' },
                { value: 'manager', label: 'Manager' },
                { value: 'employee', label: 'Employee' },
              ]}
              error={errors.role?.message}
              {...register('role', {
                required: 'Role is required',
              })}
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="active"
              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              {...register('active')}
            />
            <label htmlFor="active" className="text-sm text-gray-700">
              Active
            </label>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/users')}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={isLoading}>
              {id ? 'Update User' : 'Create User'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}