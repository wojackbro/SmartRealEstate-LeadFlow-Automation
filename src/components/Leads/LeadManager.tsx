import React, { useState, useEffect } from 'react';
import { LeadService } from '../../services/leadService';
import { Lead } from '../../types';
import {
  Search,
  Filter,
  Star,
  Phone,
  Mail,
  Calendar,
  MessageSquare,
  Eye,
  Trash2,
  ChevronDown,
  ChevronUp,
  ChevronRight
} from 'lucide-react';

interface LeadManagerProps {
  onLeadSelect?: (lead: Lead) => void;
}

export const LeadManager: React.FC<LeadManagerProps> = ({ onLeadSelect }) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    status: '',
    source: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [qualification, setQualification] = useState<{
    score: number;
    status: 'hot' | 'warm' | 'cold';
    recommendations: string[];
  } | null>(null);

  const leadService = LeadService.getInstance();

  useEffect(() => {
    loadLeads();
  }, [filters]);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const response = await leadService.getLeads({
        status: filters.status as Lead['status'],
        source: filters.source as Lead['source']
      });
      setLeads(response.leads);
      setError(null);
    } catch (err) {
      setError('Failed to load leads');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSelect = async (lead: Lead) => {
    setSelectedLead(lead);
    try {
      const qual = await leadService.qualifyLead(lead.id);
      setQualification(qual);
    } catch (err) {
      console.error('Failed to qualify lead:', err);
    }
    onLeadSelect?.(lead);
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await leadService.deleteLead(leadId);
      setLeads(leads.filter(lead => lead.id !== leadId));
      if (selectedLead?.id === leadId) {
        setSelectedLead(null);
        setQualification(null);
      }
    } catch (err) {
      console.error('Failed to delete lead:', err);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = filters.search === '' ||
      lead.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      lead.email.toLowerCase().includes(filters.search.toLowerCase()) ||
      (lead.phone || '').includes(filters.search);
    
    const matchesStatus = filters.status === '' || lead.status === filters.status;
    const matchesSource = filters.source === '' || lead.source === filters.source;

    return matchesSearch && matchesStatus && matchesSource;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'hot': return 'bg-red-100 text-red-800';
      case 'warm': return 'bg-yellow-100 text-yellow-800';
      case 'cold': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'website': return <Eye className="w-4 h-4" />;
      case 'chatbot': return <MessageSquare className="w-4 h-4" />;
      case 'voicebot': return <Phone className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      default: return <Star className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex h-full">
      {/* Lead List */}
      <div className="w-1/2 border-r border-gray-200 p-4">
        <div className="mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search leads..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              <Filter className="w-4 h-4" />
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-2 gap-2 mb-4">
              <select
                className="border border-gray-300 rounded-lg p-2"
                value={filters.status}
                onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
              >
                <option value="">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="qualified">Qualified</option>
                <option value="converted">Converted</option>
              </select>
              <select
                className="border border-gray-300 rounded-lg p-2"
                value={filters.source}
                onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
              >
                <option value="">All Sources</option>
                <option value="website">Website</option>
                <option value="chatbot">Chatbot</option>
                <option value="voicebot">Voicebot</option>
                <option value="email">Email</option>
                <option value="referral">Referral</option>
              </select>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="space-y-2">
            {filteredLeads.map(lead => (
              <div
                key={lead.id}
                className={`p-4 border rounded-lg cursor-pointer hover:bg-gray-50 ${
                  selectedLead?.id === lead.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => handleLeadSelect(lead)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    {getSourceIcon(lead.source)}
                    <div>
                      <h3 className="font-medium">{lead.name}</h3>
                      <p className="text-sm text-gray-500">{lead.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(lead.status)}`}>
                      {lead.status}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteLead(lead.id);
                      }}
                      className="p-1 hover:bg-red-100 rounded-full"
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lead Details */}
      <div className="w-1/2 p-4">
        {selectedLead ? (
          <div>
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">{selectedLead.name}</h2>
              <div className="flex items-center space-x-4 text-gray-500">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-1" />
                  {selectedLead.email}
                </div>
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-1" />
                  {selectedLead.phone}
                </div>
              </div>
            </div>

            {qualification && (
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Lead Qualification</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-sm text-gray-500">Score</span>
                      <div className="text-2xl font-bold">{qualification.score}</div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">Status</span>
                      <div className={`text-lg font-semibold ${getStatusColor(qualification.status)}`}>
                        {qualification.status}
                      </div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">Recommendations</h4>
                    <ul className="space-y-2">
                      {qualification.recommendations.map((rec, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <ChevronRight className="w-4 h-4 mr-2 text-gray-400" />
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Preferences</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-500">Property Type</span>
                  <div className="font-medium">
                    {selectedLead.preferences?.propertyType?.join(', ')}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Price Range</span>
                  <div className="font-medium">
                    ${selectedLead.preferences?.priceRange?.[0].toLocaleString()} - $
                    {selectedLead.preferences?.priceRange?.[1].toLocaleString()}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Locations</span>
                  <div className="font-medium">
                    {selectedLead.preferences?.locations?.join(', ')}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Beds/Baths</span>
                  <div className="font-medium">
                    {selectedLead.preferences?.beds} beds, {selectedLead.preferences?.baths} baths
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Interactions</h3>
              <div className="space-y-2">
                {selectedLead.interactions.map((interaction, index) => (
                  <div key={index} className="flex items-start space-x-2 p-2 bg-gray-50 rounded">
                    <div className="mt-1">
                      {interaction.type === 'chat' && <MessageSquare className="w-4 h-4" />}
                      {interaction.type === 'call' && <Phone className="w-4 h-4" />}
                      {interaction.type === 'email' && <Mail className="w-4 h-4" />}
                      {interaction.type === 'viewing' && <Eye className="w-4 h-4" />}
                    </div>
                    <div>
                      <div className="text-sm font-medium capitalize">{interaction.type}</div>
                      {interaction.notes && (
                        <div className="text-sm text-gray-500">{interaction.notes}</div>
                      )}
                      <div className="text-xs text-gray-400">
                        {new Date(interaction.timestamp).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a lead to view details
          </div>
        )}
      </div>
    </div>
  );
}; 