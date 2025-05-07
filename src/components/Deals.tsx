import { useState, useEffect } from 'react';
import { dealService } from '../services/airtableService';

interface Deal {
  id: string;
  'Deal Name': string;
  Amount: number;
  Stage: string;
  Contact: string[];
  'Close Date': string;
  Notes?: string;
}

interface DealFormData {
  'Deal Name': string;
  Amount: number;
  Stage: string;
  Contact: string[];
  'Close Date': string;
  Notes?: string;
}

export default function Deals() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState<Deal | null>(null);
  const [formData, setFormData] = useState<DealFormData>({
    'Deal Name': '',
    Amount: 0,
    Stage: 'New',
    Contact: [],
    'Close Date': new Date().toISOString().split('T')[0],
    Notes: ''
  });

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const data = await dealService.getAll();
      setDeals(data as Deal[]);
      setError(null);
    } catch (err) {
      setError('Failed to load deals');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingDeal) {
        await dealService.update(editingDeal.id, formData);
      } else {
        await dealService.create(formData);
      }
      await loadDeals();
      setIsModalOpen(false);
      setEditingDeal(null);
      resetForm();
    } catch (err) {
      setError('Failed to save deal');
      console.error(err);
    }
  };

  const handleEdit = (deal: Deal) => {
    setEditingDeal(deal);
    setFormData({
      'Deal Name': deal['Deal Name'],
      Amount: deal.Amount,
      Stage: deal.Stage,
      Contact: deal.Contact,
      'Close Date': deal['Close Date'],
      Notes: deal.Notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this deal?')) {
      try {
        await dealService.delete(id);
        await loadDeals();
      } catch (err) {
        setError('Failed to delete deal');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      'Deal Name': '',
      Amount: 0,
      Stage: 'New',
      Contact: [],
      'Close Date': new Date().toISOString().split('T')[0],
      Notes: ''
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) return <div>Loading deals...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Deals</h2>
        <button
          onClick={() => {
            resetForm();
            setEditingDeal(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Deal
        </button>
      </div>

      <div className="grid gap-4">
        {deals.map((deal) => (
          <div key={deal.id} className="border p-4 rounded-lg shadow bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{deal['Deal Name']}</h3>
                <p>Amount: {formatCurrency(deal.Amount)}</p>
                <p>Stage: {deal.Stage}</p>
                <p>Close Date: {new Date(deal['Close Date']).toLocaleDateString()}</p>
                {deal.Notes && (
                  <p className="mt-2 text-gray-600">Notes: {deal.Notes}</p>
                )}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(deal)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(deal.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editingDeal ? 'Edit Deal' : 'Add Deal'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Deal Name</label>
                <input
                  type="text"
                  value={formData['Deal Name']}
                  onChange={(e) => setFormData({ ...formData, 'Deal Name': e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  value={formData.Amount}
                  onChange={(e) => setFormData({ ...formData, Amount: Number(e.target.value) })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stage</label>
                <select
                  value={formData.Stage}
                  onChange={(e) => setFormData({ ...formData, Stage: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="New">New</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Negotiation">Negotiation</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Close Date</label>
                <input
                  type="date"
                  value={formData['Close Date']}
                  onChange={(e) => setFormData({ ...formData, 'Close Date': e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={formData.Notes}
                  onChange={(e) => setFormData({ ...formData, Notes: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingDeal(null);
                    resetForm();
                  }}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600"
                >
                  {editingDeal ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 