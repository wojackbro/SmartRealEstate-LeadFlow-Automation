import React, { useState, useEffect } from 'react';
import { AnalyticsService } from '../../services/analyticsService';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingUp,
  Users,
  DollarSign,
  Clock,
  MapPin,
  Star,
  Download,
  Calendar,
  Filter
} from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export const LeadAnalytics: React.FC = () => {
  const [timeRange, setTimeRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
    end: new Date()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<any>(null);
  const [filters, setFilters] = useState({
    source: 'all',
    status: 'all',
    location: 'all'
  });

  const analyticsService = AnalyticsService.getInstance();

  useEffect(() => {
    loadReport();
  }, [timeRange, filters]);

  const loadReport = async () => {
    try {
      setLoading(true);
      const data = await analyticsService.generateReport(timeRange);
      setReport(data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadReport = () => {
    // In production, generate and download a PDF or CSV report
    console.log('Downloading report...');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">
        {error}
        <button
          onClick={loadReport}
          className="ml-4 text-blue-500 hover:text-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!report) return null;

  const { summary, trends, sourcePerformance, agentPerformance, recommendations } = report;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lead Analytics</h1>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Calendar className="w-4 h-4" />
            <select
              className="border rounded-lg px-3 py-1"
              onChange={(e) => {
                const days = parseInt(e.target.value);
                setTimeRange({
                  start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
                  end: new Date()
                });
              }}
            >
              <option value="7">Last 7 days</option>
              <option value="30" selected>Last 30 days</option>
              <option value="90">Last 90 days</option>
            </select>
          </div>
          <button
            onClick={handleDownloadReport}
            className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            <Download className="w-4 h-4" />
            <span>Download Report</span>
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex items-center space-x-4">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            className="border rounded-lg px-3 py-1"
            value={filters.source}
            onChange={(e) => setFilters(prev => ({ ...prev, source: e.target.value }))}
          >
            <option value="all">All Sources</option>
            <option value="website">Website</option>
            <option value="chatbot">Chatbot</option>
            <option value="voicebot">Voicebot</option>
            <option value="referral">Referral</option>
          </select>
          <select
            className="border rounded-lg px-3 py-1"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="all">All Statuses</option>
            <option value="new">New</option>
            <option value="contacted">Contacted</option>
            <option value="qualified">Qualified</option>
            <option value="converted">Converted</option>
            <option value="lost">Lost</option>
          </select>
          <select
            className="border rounded-lg px-3 py-1"
            value={filters.location}
            onChange={(e) => setFilters(prev => ({ ...prev, location: e.target.value }))}
          >
            <option value="all">All Locations</option>
            <option value="san-francisco">San Francisco</option>
            <option value="los-angeles">Los Angeles</option>
            <option value="new-york">New York</option>
          </select>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2 text-gray-500">
            <Users className="w-5 h-5" />
            <span>Total Leads</span>
          </div>
          <div className="text-2xl font-bold mt-2">{summary.totalLeads}</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2 text-gray-500">
            <TrendingUp className="w-5 h-5" />
            <span>Conversion Rate</span>
          </div>
          <div className="text-2xl font-bold mt-2">{summary.conversionRate}%</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2 text-gray-500">
            <Clock className="w-5 h-5" />
            <span>Avg Response Time</span>
          </div>
          <div className="text-2xl font-bold mt-2">{summary.averageResponseTime}h</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center space-x-2 text-gray-500">
            <Star className="w-5 h-5" />
            <span>Lead Quality</span>
          </div>
          <div className="text-2xl font-bold mt-2">
            {Math.round((summary.leadQuality.hot / summary.totalLeads) * 100)}%
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-6">
        {/* Lead Trends */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Lead Trends</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trends.dailyLeads}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Sources */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Lead Sources</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(summary.leadsBySource).map(([source, count]) => ({
                    name: source,
                    value: count
                  }))}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label
                >
                  {Object.entries(summary.leadsBySource).map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Source Performance */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Source Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourcePerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="source" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="conversionRate" fill="#8884d8" name="Conversion Rate (%)" />
                <Bar dataKey="averageResponseTime" fill="#82ca9d" name="Response Time (h)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Agent Performance */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Agent Performance</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={agentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="agentName" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="conversionRate" fill="#8884d8" name="Conversion Rate (%)" />
                <Bar dataKey="customerSatisfaction" fill="#82ca9d" name="Satisfaction" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
        <div className="space-y-2">
          {recommendations.map((rec: string, index: number) => (
            <div key={index} className="flex items-center space-x-2 text-gray-600">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>{rec}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 