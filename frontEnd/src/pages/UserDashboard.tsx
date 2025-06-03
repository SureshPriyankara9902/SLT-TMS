import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { PlusIcon, TruckIcon, InfoIcon, Eye } from "lucide-react";
import TireRequestForm from "../components/TireRequestForm";
import RequestDetailsModal from "../components/RequestDetailsModal";
import { TireRequest } from "../types/api";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const POLL_INTERVAL = 3000; // 3 seconds

const UserDashboard = () => {
  const { user } = useAuth();
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TireRequest | null>(null);
  const [userRequests, setUserRequests] = useState<TireRequest[]>([]);

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'complete':
      case 'engineer approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
      case 'supervisor approved':
      case 'technical-manager approved':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusDisplay = (status: string | undefined) => {
    switch (status) {
      case 'pending':
        return 'Pending';
      case 'supervisor approved':
        return 'Supervisor Approved';
      case 'technical-manager approved':
        return 'Technical Review Done';
      case 'engineer approved':
      case 'complete':
        return 'Complete';
      case 'rejected':
        return 'Rejected';
      default:
        return 'Unknown';
    }
  };

  const fetchUserRequests = async () => {
    if (!user?.id) return;
    
    try {
      const response = await fetch(`${API_BASE_URL}/requests/user/${user.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch requests');
      }
      const data = await response.json();
      setUserRequests(data);
    } catch (err) {
      console.error("Failed to fetch user requests:", err);
      setUserRequests([]);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return '-';
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  useEffect(() => {
    fetchUserRequests();
    const interval = setInterval(fetchUserRequests, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [user?.id]);

  const openDetailsModal = (request: TireRequest) => {
    setSelectedRequest(request);
  };

  const closeDetailsModal = () => {
    setSelectedRequest(null);
  };

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl">
      <div className="flex flex-col items-start justify-between gap-4 mb-8 md:flex-row md:items-center">
        <h1 className="text-2xl font-bold text-gray-800">User Dashboard</h1>
        <div className="flex flex-col w-full gap-3 sm:flex-row md:w-auto">
          <Link
            to="/vehicle-registration"
            className="flex items-center justify-center px-4 py-2 text-white transition-colors bg-green-600 rounded hover:bg-green-700"
          >
            <TruckIcon size={18} className="mr-2" />
            Register Vehicle
          </Link>
          <button
            onClick={() => setShowRequestForm(!showRequestForm)}
            className="flex items-center justify-center px-4 py-2 text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
          >
            <PlusIcon size={18} className="mr-2" />
            {showRequestForm ? "Cancel" : "New Tire Request"}
          </button>
        </div>
      </div>

      {showRequestForm ? (
        <TireRequestForm onSuccess={() => setShowRequestForm(false)} />
      ) : (
        <div className="space-y-6">
          <div className="overflow-hidden bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="mb-4 text-xl font-semibold">All Tire Requests ({userRequests.length})</h2>
              {userRequests.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">ID</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Vehicle</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Tire Details</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-xs font-medium tracking-wider text-center text-gray-500 uppercase">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {userRequests.map((request) => (
                        <tr key={request.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900 whitespace-nowrap">
                            #{request.id}
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-gray-900">{request.vehicleNumber}</div>
                            <div className="text-sm text-gray-500">{request.vehicleBrand} {request.vehicleModel}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-900">{request.tireSize}</div>
                            <div className="text-sm text-gray-500">{request.quantity} tires</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col gap-1">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(request.status)}`}>
                                {getStatusDisplay(request.status)}
                              </span>
                              <div className="flex flex-col text-xs text-gray-500">
                                {request.supervisorApproved && <span>✓ Supervisor</span>}
                                {request.technicalManagerApproved && <span>✓ Technical</span>}
                                {request.engineerApproved && <span>✓ Engineer</span>}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500 whitespace-nowrap">
                            {formatDate(request.submittedAt)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex justify-center gap-3">
                              <button
                                onClick={() => openDetailsModal(request)}
                                className="inline-flex items-center p-1 text-blue-600 hover:text-blue-900"
                                title="View Details"
                              >
                                <Eye size={20} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">You haven't made any tire requests yet.</p>
                  <button
                    onClick={() => setShowRequestForm(true)}
                    className="flex items-center justify-center px-4 py-2 mx-auto text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
                  >
                    <PlusIcon size={18} className="mr-2" />
                    Make Your First Request
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="p-6 border border-blue-100 rounded-lg shadow-md bg-blue-50">
            <div className="flex items-center mb-3">
              <InfoIcon className="mr-2 text-blue-600" size={20} />
              <h2 className="text-xl font-semibold">How Tire Requests Work</h2>
            </div>
            <ol className="pl-5 space-y-2 text-gray-700 list-decimal">
              <li>Submit a tire request for a registered vehicle</li>
              <li>Your supervisor will review and approve your request</li>
              <li>The technical manager will perform a technical review</li>
              <li>An engineer will provide the final technical approval</li>
              <li>Once approved, your request will be marked as complete</li>
              <li>You will be notified when your tires are ready</li>
            </ol>
          </div>
        </div>
      )}

      {selectedRequest && (
        <RequestDetailsModal
          request={selectedRequest}
          onClose={closeDetailsModal}
        />
      )}
    </div>
  );
};

export default UserDashboard;
