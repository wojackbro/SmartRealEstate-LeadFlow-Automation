import { useState, useEffect } from 'react';
import { contactService } from '../services/airtableService';
import { CONTACT_FIELDS } from '../config/airtable';

interface Contact {
  id: string;
  Name: string;
  Email: string;
  Phone: string;
  Company: string;
  Status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Closed';
  Notes?: string;
  createdTime?: string;
  lastModifiedTime?: string;
}

interface ContactFormData {
  Name: string;
  Email: string;
  Phone: string;
  Company: string;
  Status: 'New' | 'Contacted' | 'Qualified' | 'Proposal' | 'Closed';
  Notes?: string;
}

interface ContactService {
  getAll: () => Promise<Contact[]>;
  create: (data: ContactFormData) => Promise<Contact>;
  update: (id: string, data: ContactFormData) => Promise<Contact>;
  delete: (id: string) => Promise<void>;
}

export default function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [formData, setFormData] = useState<ContactFormData>({
    Name: '',
    Email: '',
    Phone: '',
    Company: '',
    Status: 'New',
    Notes: ''
  });

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      setLoading(true);
      const data = await contactService.getAll();
      setContacts(
        data.map((c: any) => ({
          id: c.id,
          Name: c.Name || '',
          Email: c.Email || '',
          Phone: c.Phone || '',
          Company: c.Company || '',
          Status: (c.Status as Contact['Status']) || 'New',
          Notes: c.Notes || '',
          createdTime: c.createdTime,
          lastModifiedTime: c.lastModifiedTime,
        }))
      );
      setError(null);
    } catch (err) {
      setError('Failed to load contacts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingContact) {
        await contactService.update(editingContact.id, formData);
      } else {
        await contactService.create(formData);
      }
      await loadContacts();
      setIsModalOpen(false);
      setEditingContact(null);
      resetForm();
    } catch (err) {
      setError('Failed to save contact');
      console.error(err);
    }
  };

  const handleEdit = (contact: Contact) => {
    setEditingContact(contact);
    setFormData({
      Name: contact.Name,
      Email: contact.Email,
      Phone: contact.Phone,
      Company: contact.Company,
      Status: contact.Status,
      Notes: contact.Notes || ''
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await contactService.delete(id);
        await loadContacts();
      } catch (err) {
        setError('Failed to delete contact');
        console.error(err);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      Name: '',
      Email: '',
      Phone: '',
      Company: '',
      Status: 'New',
      Notes: ''
    });
  };

  if (loading) return <div>Loading contacts...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Contacts</h2>
        <button
          onClick={() => {
            resetForm();
            setEditingContact(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Add Contact
        </button>
      </div>

      <div className="grid gap-4">
        {contacts.map((contact) => (
          <div key={contact.id} className="border p-4 rounded-lg shadow bg-white">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-bold text-lg">{contact.Name}</h3>
                <p>Email: {contact.Email}</p>
                <p>Phone: {contact.Phone}</p>
                <p>Company: {contact.Company}</p>
                <p>Status: {contact.Status}</p>
                {contact.Notes && (
                  <p className="mt-2 text-gray-600">Notes: {contact.Notes}</p>
                )}
              </div>
              <div className="space-x-2">
                <button
                  onClick={() => handleEdit(contact)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(contact.id)}
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
              {editingContact ? 'Edit Contact' : 'Add Contact'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={formData.Name}
                  onChange={(e) => setFormData({ ...formData, Name: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={formData.Email}
                  onChange={(e) => setFormData({ ...formData, Email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="tel"
                  value={formData.Phone}
                  onChange={(e) => setFormData({ ...formData, Phone: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  type="text"
                  value={formData.Company}
                  onChange={(e) => setFormData({ ...formData, Company: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.Status}
                  onChange={(e) => setFormData({ ...formData, Status: e.target.value as ContactFormData['Status'] })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal">Proposal</option>
                  <option value="Closed">Closed</option>
                </select>
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
                    setEditingContact(null);
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
                  {editingContact ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 