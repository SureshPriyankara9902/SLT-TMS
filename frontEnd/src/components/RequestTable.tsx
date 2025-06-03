import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, CheckCircle, XCircle } from 'lucide-react';
import type { Request } from '../types/request';

interface RequestTableProps{
  requests: Request[];
  title: string;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onView: (request: Request) => void;
  showActions?: boolean;
}

const RequestTable: React.FC<RequestTableProps> = ({
  requests,
  title,
  onApprove,
  onReject,
  onView,
  showActions = true,
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [sortField, setSortField] = useState<keyof Request>('submittedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const toggleRow = (id: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (expandedRows.has(id)) {
      newExpandedRows.delete(id);
    } else {
      newExpandedRows.add(id);
    }
    setExpandedRows(newExpandedRows);
  };

  const handleSort = (field: keyof Request) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 flex items-center justify-between">
          <span>{title}</span>
          <span className="text-sm text-gray-500">{requests.length} requests</span>
        </h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Vehicle Info
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Requester
              </th>
              <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Request Details
              </th>
              {showActions && (
                <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {requests.map((request) => (
              <React.Fragment key={request.id}>
                <tr className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(request.submittedAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.vehicleNumber}</div>
                    <div className="text-xs text-gray-500">{request.vehicleBrand} {request.vehicleModel}</div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{request.requesterName}</div>
                    <div className="text-xs text-gray-500">{request.userSection}</div>
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">
                    <button
                      onClick={() => toggleRow(request.id)}
                      className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
                    >
                      {expandedRows.has(request.id) ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      <span>View Details</span>
                    </button>
                  </td>
                  {showActions && (
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => onView(request)}
                        className="text-blue-600 hover:text-blue-900 mx-2"
                        title="View Full Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button
                        onClick={() => onApprove(request.id)}
                        className="text-green-600 hover:text-green-900 mx-2"
                        title="Approve Request"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        onClick={() => onReject(request.id)}
                        className="text-red-600 hover:text-red-900 mx-2"
                        title="Reject Request"
                      >
                        <XCircle size={18} />
                      </button>
                    </td>
                  )}
                </tr>
                {expandedRows.has(request.id) && (
                  <tr>
                    <td colSpan={showActions ? 5 : 4} className="px-6 py-4 bg-gray-50">
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Vehicle Details</h4>
                          <p><span className="font-medium">Number:</span> {request.vehicleNumber}</p>
                          <p><span className="font-medium">Brand/Model:</span> {request.vehicleBrand} {request.vehicleModel}</p>
                          <p><span className="font-medium">Year:</span> {request.year}</p>
                          <p><span className="font-medium">Section:</span> {request.userSection}</p>
                          <p><span className="font-medium">Cost Center:</span> {request.costCenter}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Tire Information</h4>
                          <p><span className="font-medium">Size Required:</span> {request.tireSizeRequired}</p>
                          <p><span className="font-medium">Quantity:</span> {request.quantity}</p>
                          <p><span className="font-medium">Tubes:</span> {request.tubesQuantity}</p>
                          <p><span className="font-medium">Current Make:</span> {request.existingTireMake}</p>
                          <p><span className="font-medium">Last Replaced:</span> {formatDate(request.lastReplacementDate)}</p>
                        </div>
                        <div className="space-y-2">
                          <h4 className="font-medium text-gray-900">Additional Details</h4>
                          <p><span className="font-medium">Current KM:</span> {request.presentKmReading}</p>
                          <p><span className="font-medium">Previous KM:</span> {request.previousKmReading}</p>
                          <p><span className="font-medium">Wear Pattern:</span> {request.tireWearPattern}</p>
                          <p><span className="font-medium">Reason:</span> {request.requestReason}</p>
                          {request.comments && (
                            <p><span className="font-medium">Comments:</span> {request.comments}</p>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RequestTable;
