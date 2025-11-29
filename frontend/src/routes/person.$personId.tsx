import { createFileRoute, Link } from '@tanstack/react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { peopleApi, giftsApi } from '../lib/api';
import { GiftCard } from '../components/GiftCard';
import { AddGiftForm } from '../components/AddGiftForm';
import type { CreateGiftInput } from '../types';

export const Route = createFileRoute('/person/$personId')({
  component: PersonPage,
});

function PersonPage() {
  const { personId } = Route.useParams();
  const queryClient = useQueryClient();

  const { data: person, isLoading: personLoading } = useQuery({
    queryKey: ['person', personId],
    queryFn: () => peopleApi.getById(personId),
  });

  const { data: gifts = [], isLoading: giftsLoading } = useQuery({
    queryKey: ['gifts', personId],
    queryFn: () => giftsApi.getByPersonId(personId),
  });

  const createMutation = useMutation({
    mutationFn: giftsApi.create,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gifts', personId] }),
  });

  const deleteMutation = useMutation({
    mutationFn: giftsApi.delete,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gifts', personId] }),
  });

  const selectMutation = useMutation({
    mutationFn: ({ giftId }: { giftId: string }) => giftsApi.selectGift(personId, giftId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['gifts', personId] }),
  });

  const handleAddGift = (data: CreateGiftInput) => createMutation.mutate(data);

  if (personLoading || giftsLoading) return <div>Loading...</div>;

  if (!person)
    return (
      <div>
        <p>Not found</p>
        <Link to="/">Back</Link>
      </div>
    );

  return (
    <div className="space-y-8">
      <Link to="/" className="christmas-button">
        ← Back
      </Link>

      <h1 className="text-3xl font-bold">Gifts for {person.name}</h1>

      <AddGiftForm personId={personId} onSubmit={handleAddGift} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {gifts.map((gift) => (
          <GiftCard
            key={gift.id}
            gift={gift}
            onDelete={() => deleteMutation.mutate(gift.id)}
            onSelect={() => selectMutation.mutate({ giftId: gift.id })}
          />
        ))}
      </div>
    </div>
  );
}
