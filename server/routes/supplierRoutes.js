// src/pages/suppliers/Suppliers.tsx
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2, BriefcaseX, BriefcaseCheck } from 'lucide-react';
import { toast } from 'react-toastify';
import { Table, TableHead, TableBody, TableRow, TableHeaderCell, TableCell } from '../../components/ui/Table'; //
import Button from '../../components/ui/Button'; //
import Card from '../../components/ui/Card'; //
import { api } from '../../services/api'; //

type Supplier = {
  id: number;
  name: string;
  email: string;
  phone: string;
  contactPerson: string;
  active: boolean;
  createdAt: string;
};

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (error) {
      toast.error('Falha ao buscar fornecedores');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSupplierStatus = async (id: number, active: boolean) => {
    try {
      await api.put(`/suppliers/${id}`, { active: !active });
      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((supplier) =>
          supplier.id === id ? { ...supplier, active: !active } : supplier
        )
      );
      toast.success(`Fornecedor ${active ? 'desativado' : 'ativado'} com sucesso`);
    } catch (error) {
      toast.error('Falha ao atualizar status do fornecedor');
      console.error(error);
    }
  };

  const deleteSupplier = async (id: number) => {
    if (!confirm('Tem certeza que deseja deletar este fornecedor? Esta ação não pode ser desfeita.')) {
      return;
    }
    try {
      await api.delete(`/suppliers/${id}`);
      setSuppliers((prevSuppliers) => prevSuppliers.filter((supplier) => supplier.id !== id));
      toast.success('Fornecedor deletado com sucesso');
    } catch (error) {
      toast.error('Falha ao deletar fornecedor');
      console.error(error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR'); // Usando pt-BR para formato de data
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fornecedores</h1>
          <p className="mt-1 text-gray-600">Gerencie seus fornecedores</p>
        </div>
        <Link to="/suppliers/new">
          <Button leftIcon={<Plus className="h-4 w-4" />}>Adicionar Fornecedor</Button>
        </Link>
      </div>
      <Card>
        {isLoading ? (
          <div className="flex h-64 items-center justify-center">
            <p className="text-gray-500">Carregando fornecedores...</p>
          </div>
        ) : suppliers.length === 0 ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <p className="text-gray-500">Nenhum fornecedor encontrado</p>
            <Link to="/suppliers/new" className="mt-2">
              <Button size="sm">Adicionar Fornecedor</Button>
            </Link>
          </div>
        ) : (
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Nome</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Telefone</TableHeaderCell>
                <TableHeaderCell>Contato</TableHeaderCell>
                <TableHeaderCell>Status</TableHeaderCell>
                <TableHeaderCell>Criado em</TableHeaderCell>
                <TableHeaderCell>Ações</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {suppliers.map((supplier) => (
                <TableRow key={supplier.id}>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.contactPerson}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                        supplier.active
                          ? 'bg-success-100 text-success-800'
                          : 'bg-error-100 text-error-800'
                      }`}
                    >
                      {supplier.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </TableCell>
                  <TableCell>{formatDate(supplier.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link to={`/suppliers/${supplier.id}`}>
                        <Button variant="outline" size="sm" leftIcon={<Edit className="h-4 w-4" />}>
                          Editar
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        leftIcon={
                          supplier.active ? (
                            <BriefcaseX className="h-4 w-4" />
                          ) : (
                            <BriefcaseCheck className="h-4 w-4" />
                          )
                        }
                        onClick={() => toggleSupplierStatus(supplier.id, supplier.active)}
                      >
                        {supplier.active ? 'Desativar' : 'Ativar'}
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        leftIcon={<Trash2 className="h-4 w-4" />}
                        onClick={() => deleteSupplier(supplier.id)}
                      >
                        Deletar
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