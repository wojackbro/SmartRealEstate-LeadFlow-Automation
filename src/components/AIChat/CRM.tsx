import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Edit2, Trash2 } from 'lucide-react';
import { AnalyticsDashboard } from '../Analytics/AnalyticsDashboard';
import { LeadAnalytics } from '../Analytics/LeadAnalytics';
import { LeadReports } from '../Analytics/LeadReports';
import { LeadCapture } from '../Leads/LeadCapture';
import { BarChart2, PieChart, FileText } from 'lucide-react';

interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'closed';
  notes: string;
  lastContact: Date;
}

export const CRM: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  useEffect(() => {
    // Simulate fetching leads from Airtable
    const mockLeads: Lead[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '(555) 123-4567',
        status: 'new',
        notes: 'Interested in 3-bedroom homes in downtown area',
        lastContact: new Date('2024-03-10')
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '(555) 987-6543',
        status: 'qualified',
        notes: 'Looking for investment properties',
        lastContact: new Date('2024-03-12')
      }
    ];
    setLeads(mockLeads);
  }, []);

  const filteredLeads = leads.filter(lead =>
    lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    lead.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColors = {
    new: 'bg-blue-100 text-blue-800',
    contacted: 'bg-yellow-100 text-yellow-800',
    qualified: 'bg-green-100 text-green-800',
    proposal: 'bg-purple-100 text-purple-800',
    closed: 'bg-gray-100 text-gray-800'
  };

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart2 },
    { id: 'analytics', label: 'Analytics', icon: PieChart },
    { id: 'reports', label: 'Reports', icon: FileText },
    { id: 'leads', label: 'Leads', icon: Users }
  ];

  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="flex space-x-4 p-4">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  activeTab === tab.id
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow p-6">
        {activeTab === 'dashboard' && <AnalyticsDashboard />}
        {activeTab === 'analytics' && <LeadAnalytics />}
        {activeTab === 'reports' && <LeadReports />}
        {activeTab === 'leads' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Lead Management</h2>
            <LeadCapture onLeadCaptured={(leadId) => {
              console.log('Lead captured:', leadId);
              // Refresh analytics data
              setActiveTab('analytics');
            }} />
          </div>
        )}
      </div>
    </div>
  );
};