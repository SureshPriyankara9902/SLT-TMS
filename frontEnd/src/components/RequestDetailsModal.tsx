import { FC } from 'react';
import { XIcon } from 'lucide-react';
import { TireRequest } from '../types/api';

interface RequestDetailsModalProps {
  request: TireRequest;
  onClose: () => void;
}

const RequestDetailsModal: FC<RequestDetailsModalProps> = ({ request, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 w-full h-full overflow-y-auto bg-gray-600 bg-opacity-50">
      <div className="relative w-11/12 p-5 mx-auto bg-white border rounded-md shadow-lg top-20 md:w-3/4 lg:w-2/3">
        <div className="flex items-center justify-between pb-2 mb-4 border-b">
          <h3 className="text-xl font-bold">
            Request Details {/* Remove #{request.id} if no id */}
          </h3>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <XIcon size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto max-h-[70vh]">
          {/* Vehicle Information */}
          <div className="p-4 rounded-lg bg-gray-50">
            <h3 className="pb-2 mb-3 text-lg font-semibold border-b">Vehicle Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-600">Vehicle Number</p>
                <p>{request.vehicleNumber}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Vehicle Type</p>
                <p>{request.vehicleType}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Make/Model</p>
                <p>{request.vehicleBrand} {request.vehicleModel}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Current KM Reading</p>
                <p>{request.presentKmReading} km</p>
              </div>
            </div>
          </div>

          {/* Tire Request Details */}
          <div className="p-4 rounded-lg bg-gray-50">
            <h3 className="pb-2 mb-3 text-lg font-semibold border-b">Tire Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-600">Tire Size</p>
                <p>{request.tireSize}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Quantity Requested</p>
                <p>{request.quantity} tires</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Tubes Requested</p>
                <p>{request.tubesQuantity || 'None'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Last Replacement KM</p>
                <p>{request.previousKmReading} km</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Wear Pattern</p>
                <p>{request.tireWearPattern?.replace(/_/g, ' ') || 'Not specified'}</p>
              </div>
            </div>
          </div>

          {/* Requester Information */}
          <div className="p-4 rounded-lg bg-gray-50">
            <h3 className="pb-2 mb-3 text-lg font-semibold border-b">Requester Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-600">Name</p>
                <p>{request.requesterName}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Section</p>
                <p>{request.userSection}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Contact</p>
                <p>{request.requesterPhone} / {request.requesterEmail}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-600">Cost Center</p>
                <p>{request.costCenter}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="p-4 rounded-lg bg-gray-50">
            <h3 className="pb-2 mb-3 text-lg font-semibold border-b">Additional Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm font-semibold text-gray-600">Request Reason</p>
                <p className="whitespace-pre-line">{request.requestReason}</p>
              </div>
              {request.comments && (
                <div>
                  <p className="text-sm font-semibold text-gray-600">Additional Notes</p>
                  <p className="whitespace-pre-line">{request.comments}</p>
                </div>
              )}
              {request.images?.filter((img: File | string | null) => img).length > 0 && (
                <div>
                  <p className="text-sm font-semibold text-gray-600">Attached Images</p>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {request.images.map((img: File | string | null, index: number) => (
                      img && (
                        <div key={index} className="p-1 border rounded">
                          <img 
                            src={typeof img === 'string' ? img : URL.createObjectURL(img)} 
                            alt={`Tire condition ${index + 1}`}
                            className="object-cover w-full h-24"
                          />
                          <p className="mt-1 text-xs text-center">Image {index + 1}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RequestDetailsModal;