import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, UserX, UserCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import { api } from '../../services/api';

type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  taxId: string;
  contactPerson: string;
  active: boolean;
  createdAt: string;
};

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchClients();
  }, []);
  
  const fetchClients = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      toast.error('Failed to fetch clients');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleClientStatus = async (id: number, active: boolean) => {
    try {
      await api.put(`/clients/${id}`, { active: !active });
      
      setClients((prevClients) =>
        prevClients.map((client) =>
          client.id === id ? { ...client, active: !active } : client
        )
      );
      
      toast.success(`Client ${active ? 'deactivated' : 'activated'} successfully`);
    } catch (error) {
      toast.error('Failed to update client status');
      console.error(error);
    }
  };
  
  const deleteClient = async (id: number) => {
    if (!confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      return;
    }
    
    try {
      await api.delete(`/clients/${id}`);
      setClients((prevClients) => prevClients.filter((client) => client.id !== id));
      toast.success('Client deleted successfully');
    } catch (error) {
      toast.error('Failed to delete client');
      console.error(error);
    }
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
          <p className="mt-1 text-gray-600">Manage your business clients</p>
        </div>
        
        <Link to="/clients/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>Add Client</Button>
        </Link>
      </div>
      
      <Card>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-500">Loading clients...</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <p className="text-gray-500">No clients found</p>
            <Link to="/clients/new" className="mt-2">
              <Button size="sm">Add Client</Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Name</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Phone</TableHeaderCell>
                <TableHeaderCell>Contact Person</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Created At</TableHeaderCell>
                <TableHeaderCell>Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.name}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.phone}</TableCell>
                  <TableCell>{client.contactPerson}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        client.active
                          ? 'bg-success-100 text-success-800'
                          : 'bg-error-100 text-error-800'
                      }`}
                    >
                      {client.active ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(client.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link to={`/clients/${client.id}`}>
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
                          client.active ? (
                            <UserX className="h-4 w-4" />
                          ) : (
                            <UserCheck className="h-4 w-4" />
                          )
                        }
                        onClick={() => toggleClientStatus(client.id, client.active)}
                      >
                        {client.active ? 'Deactivate' : 'Activate'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={<Trash2 className="h-4 w-4" />}
                        onClick={() => deleteClient(client.id)}
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