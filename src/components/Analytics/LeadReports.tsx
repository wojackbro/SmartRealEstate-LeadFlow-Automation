import React, { useState, useEffect } from 'react';
import { AnalyticsService } from '../../services/analyticsService';
import { Download, Filter, Calendar } from 'lucide-react';

export const LeadReports: React.FC = () => {
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
      setError('Failed to load report data');
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

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Lead Reports</h1>
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

      {/* Report Content */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="space-y-6">
          {/* Lead Summary */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Lead Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <div className="text-sm text-blue-600">Total Leads</div>
                <div className="text-2xl font-bold">{report.summary.totalLeads}</div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <div className="text-sm text-green-600">Conversion Rate</div>
                <div className="text-2xl font-bold">{report.summary.conversionRate}%</div>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <div className="text-sm text-purple-600">Avg Response Time</div>
                <div className="text-2xl font-bold">{report.summary.averageResponseTime}h</div>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg">
                <div className="text-sm text-yellow-600">Lead Quality</div>
                <div className="text-2xl font-bold">
                  {Math.round((report.summary.leadQuality.hot / report.summary.totalLeads) * 100)}%
                </div>
              </div>
            </div>
          </div>

          {/* Source Performance */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Source Performance</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Source
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Leads
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Conversion Rate
                    </th>
                    <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Avg Response Time
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {Object.entries(report.sourcePerformance).map(([source, data]: [string, any]) => (
                    <tr key={source}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {source}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.totalLeads}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.conversionRate}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {data.averageResponseTime}h
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recommendations */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Recommendations</h2>
            <div className="space-y-2">
              {report.recommendations.map((rec: string, index: number) => (
                <div key={index} className="flex items-center space-x-2 text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 