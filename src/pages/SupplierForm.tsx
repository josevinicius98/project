// src/pages/SupplierForm.tsx
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { ArrowLeft, Save } from 'lucide-react';
import Button from '../../components/ui/Button'; //
import Input from '../../components/ui/Input'; //
import Card from '../../components/ui/Card'; //
import { api } from '../../services/api'; //

type SupplierFormData = {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  taxId?: string;
  contactPerson?: string;
  paymentTerms?: string;
  notes?: string;
  active: boolean;
};

export default function SupplierForm() {
  const [isLoading, setIsLoading] = useState(false); // Para buscar dados
  const [isSaving, setIsSaving] = useState(false); // Para submissão do formulário
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const {
    register,
    handleSubmit,
    reset,
    // setValue, // Para definir o valor do checkbox, se necessário explicitamente
    formState: { errors },
  } = useForm<SupplierFormData>({
    defaultValues: {
        active: true // Padrão para ativo para novos fornecedores
    }
  });

  useEffect(() => {
    if (isEditing) {
      fetchSupplier();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, id, reset]); // Adicionar dependências

  const fetchSupplier = async () => {
    setIsLoading(true);
    try {
      const response = await api.get(`/suppliers/${id}`);
      reset(response.data); // Popula o formulário com dados buscados
    } catch (error) {
      toast.error('Falha ao buscar detalhes do fornecedor');
      navigate('/suppliers');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: SupplierFormData) => {
    setIsSaving(true);
    try {
      if (isEditing) {
        await api.put(`/suppliers/${id}`, data);
        toast.success('Fornecedor atualizado com sucesso');
      } else {
        await api.post('/suppliers', data);
        toast.success('Fornecedor criado com sucesso');
      }
      navigate('/suppliers');
    } catch (error: any) { // Especificar 'any' ou um tipo de erro mais específico
      const errorMsg = error.response?.data?.message || (isEditing ? 'Falha ao atualizar fornecedor' : 'Falha ao criar fornecedor');
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading && isEditing) { // Mostrar carregando apenas se editando e buscando
    return (
      <div className="flex h-64 items-center justify-center">
        <p className="text-gray-500">Carregando detalhes do fornecedor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditing ? 'Editar Fornecedor' : 'Novo Fornecedor'}
          </h1>
          <p className="mt-1 text-gray-600">
            {isEditing ? 'Atualize as informações do fornecedor' : 'Adicione um novo fornecedor'}
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/suppliers')}
          leftIcon={<ArrowLeft className="h-4 w-4" />}
        >
          Voltar para Fornecedores
        </Button>
      </div>
      <Card>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Input
              label="Nome"
              error={errors.name?.message}
              {...register('name', { required: 'Nome é obrigatório' })}
            />
            <Input
              label="Email"
              type="email"
              error={errors.email?.message}
              {...register('email', {
                required: 'Email é obrigatório',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Endereço de email inválido',
                },
              })}
            />
            <Input label="Telefone" {...register('phone')} />
            <Input label="CNPJ/CPF (Tax ID)" {...register('taxId')} />
            <Input label="Pessoa de Contato" {...register('contactPerson')} />
            <Input label="Termos de Pagamento" {...register('paymentTerms')} />
            <div className="col-span-2">
              <Input label="Endereço" {...register('address')} />
            </div>
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Observações</label>
              <textarea
                className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                rows={3}
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
                <span className="text-sm font-medium text-gray-700">Ativo</span>
              </label>
            </div>
          </div>
          <div className="flex justify-end space-x-4">
            <Button type="button" variant="outline" onClick={() => navigate('/suppliers')}>
              Cancelar
            </Button>
            <Button type="submit" isLoading={isSaving} leftIcon={<Save className="h-4 w-4" />}>
              {isEditing ? 'Atualizar Fornecedor' : 'Criar Fornecedor'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}