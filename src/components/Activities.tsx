import { useState, useEffect } from 'react';
import { activityService } from '../services/airtableService';

interface Activity {
  id: string;
  Type: string;
  Subject: string;
  Contact: string[];
  Deal: string[];
  'Due Date': string;
  Status: string;
  Notes?: string;
}

interface ActivityFormData {
  Type: string;
  Subject: string;
  Contact: string[];
  Deal: string[];
  'Due Date': string;
  Status: string;
  Notes?: string;
}

export default function Activities() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [formData, setFormData] = useState<ActivityFormData>({
    Type: 'Call',
    Subject: '',
    Contact: [],
    Deal: [],
    'Due Date': new Date().toISOString().split('T')[0],
    Status: 'Not Started',
    Notes: ''
  });

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getAll();
      setActivities(data as Activity[]);
      setError(null);
    } catch (err) {
      setError('Failed to load activities');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingActivity) {
        await activityService.update(editingActivity.id, formData);
      } else {
        await activityService.create(formData);
      }
      await loadActivities();
      setIsModalOpen(false);
      setEditingActivity(null);
      resetForm();
    } catch (err) {
      setError('Failed to save activity');
      console.error(err);
    }
  };

  const handleEdit = (activity: Activity) => {
    setEditingActivity(activity);
    setFormData({
      Type: activity.Type,
      Subject: activity.Subject,
      Contact: activity.Contact,
      Deal: activity.Deal,
      'Due Date': activity['Due Date'],
      Status: activity.Status,
      Notes: activity.Notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this activity?')) {
      try {
        await activityService.delete(id);
        await loadActivities();
      } catch (err) {
        setError('Failed to delete activity');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      Type: 'Call',
      Subject: '',
      Contact: [],
      Deal: [],
      'Due Date': new Date().toISOString().split('T')[0],
      Status: 'Not Started',
      Notes: ''
    });
  };

  if (loading) return <div>Loading activities...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Activities</h2>
        <button
          onClick={() => {
            resetForm();
            setEditingActivity(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Activity
        </button>
      </div>

      <div className="grid gap-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border p-4 rounded-lg shadow bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{activity.Subject}</h3>
                <p>Type: {activity.Type}</p>
                <p>Status: {activity.Status}</p>
                <p>Due Date: {new Date(activity['Due Date']).toLocaleDateString()}</p>
                {activity.Notes && (
                  <p className="mt-2 text-gray-600">Notes: {activity.Notes}</p>
                )}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(activity)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(activity.id)}
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
              {editingActivity ? 'Edit Activity' : 'Add Activity'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={formData.Type}
                  onChange={(e) => setFormData({ ...formData, Type: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Call">Call</option>
                  <option value="Email">Email</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Task">Task</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Subject</label>
                <input
                  type="text"
                  value={formData.Subject}
                  onChange={(e) => setFormData({ ...formData, Subject: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.Status}
                  onChange={(e) => setFormData({ ...formData, Status: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={formData['Due Date']}
                  onChange={(e) => setFormData({ ...formData, 'Due Date': e.target.value })}
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
                    setEditingActivity(null);
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
                  {editingActivity ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 