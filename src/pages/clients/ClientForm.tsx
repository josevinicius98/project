import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { api } from '../../services/api';

type ClientFormData = {
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  contactPerson: string;
  active: boolean;
  notes: string;
};

export default function ClientForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ClientFormData>();
  
  useEffect(() => {
    if (isEditing) {
      fetchClient();
    }
  }, [isEditing]);
  
  const fetchClient = async () => {
    try {
      setIsLoading(true);
      const response = await api.get(`/clients/${id}`);
      reset(response.data);
    } catch (error) {
      toast.error('Failed to fetch client details');
      navigate('/clients');
    } finally {
      setIsLoading(false);
    }
  };
  
  const onSubmit = async (data: ClientFormData) => {
    try {
      setIsSaving(true);
      
      if (isEditing) {
        await api.put(`/clients/${id}`, data);
        toast.success('Client updated successfully');
      } else {
        await api.post('/clients', data);
        toast.success('Client created successfully');
      }
      
      navigate('/clients');
    } catch (error) {
      toast.error(isEditing ? 'Failed to update client' : 'Failed to create client');
    } finally {
      setIsSaving(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Loading client details...</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Edit Client' : 'New Client'}
          </h1>
          <p className="mt-1 text-gray-600">
            {isEditing ? 'Update client information' : 'Add a new client to the system'}
          </p>
        </div>
        
        <Button
          variant="outline"
          onClick={() => navigate('/clients')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Back to Clients
        </Button>
      </div>
      
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Name"
              error={errors.name?.message}
              {...register('name', { required: 'Name is required' })}
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
            
            <Input
              label="Phone"
              error={errors.phone?.message}
              {...register('phone', { required: 'Phone is required' })}
            />
            
            <Input
              label="Tax ID"
              error={errors.taxId?.message}
              {...register('taxId', { required: 'Tax ID is required' })}
            />
            
            <Input
              label="Contact Person"
              error={errors.contactPerson?.message}
              {...register('contactPerson', { required: 'Contact person is required' })}
            />
            
            <div className="col-span-2">
              <Input
                label="Address"
                error={errors.address?.message}
                {...register('address', { required: 'Address is required' })}
              />
            </div>
            
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                rows={4}
                {...register('notes')}
              />
            </div>
            
            <div className="col-span-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  {...register('active')}
                />
                <span className="text-sm font-medium text-gray-700">Active</span>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate('/clients')}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={isSaving}
              leftIcon={<Save className="h-4 w-4" />}
            >
              {isEditing ? 'Update Client' : 'Create Client'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}