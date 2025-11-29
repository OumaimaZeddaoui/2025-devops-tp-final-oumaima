import { createFileRoute } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { peopleApi } from '../lib/api';
import { PersonCard } from '../components/PersonCard';
import { AddPersonForm } from '../components/AddPersonForm';
import type { CreatePersonInput } from '../types';

export const Route = createFileRoute("/")( {
  component: HomePage,
});


function HomePage() {
  const queryClient = useQueryClient();

  const { data: people = [], isLoading } = useQuery({
    queryKey: ['people'],
    queryFn: peopleApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: peopleApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: peopleApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['people'] });
    },
  });

  const handleAddPerson = (data: CreatePersonInput) => {
    createMutation.mutate(data);
  };

  const handleDeletePerson = (id: string) => {
    if (confirm('Are you sure you want to delete this person and all their gift ideas?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <AddPersonForm onSubmit={handleAddPerson} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {people.map((person) => (
          <PersonCard key={person.id} person={person} onDelete={handleDeletePerson} />
        ))}
      </div>
    </div>
  );
}
