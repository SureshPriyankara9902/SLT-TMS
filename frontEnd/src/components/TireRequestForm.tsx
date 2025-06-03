import React, { useState, useEffect } from "react";
import Autosuggest from "react-autosuggest";
import { useVehicles } from "../contexts/VehicleContext";
import { useRequests } from "../contexts/RequestContext";
import { useAuth } from "../contexts/AuthContext";
import { Vehicle } from "../types/api";
import { Navigate, useLocation } from "react-router-dom";

interface TireRequestFormProps {
  onSuccess?: () => void;
}

const TireRequestForm: React.FC<TireRequestFormProps> = ({ onSuccess }) => {
  const { vehicles, loading: vehiclesLoading } = useVehicles();
  const { addRequest } = useRequests();
  const { user } = useAuth(); // Add this line
  const location = useLocation();

  const initialFormData = {
    vehicleNumber: "",
    vehicleId: "",
    year: "",
    vehicleBrand: "",
    vehicleModel: "",
    tireSizeRequired: "",
    quantity: 1,
    tubesQuantity: 0,
    requestReason: "",
    requesterName: "",
    requesterEmail: "",
    requesterPhone: "",
    userSection: "",
    lastReplacementDate: "",
    existingTireMake: "",
    costCenter: "",
    presentKmReading: "",
    previousKmReading: "",
    tireWearPattern: "",
    comments: "",
    images: Array(7).fill(null),
  };

  const [formData, setFormData] =
    useState<typeof initialFormData>(initialFormData);
  const [vehicleNotFound, setVehicleNotFound] = useState(false);
  const [vehicleTouched, setVehicleTouched] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // State for Autosuggest
  const [suggestions, setSuggestions] = useState<Vehicle[]>([]);

  // Get vehicle numbers for suggestions
  const getSuggestions = (value: string): Vehicle[] => {
    const inputValue = value.trim().toLowerCase();
    return vehicles.filter((v) =>
      v.vehicleNumber.toLowerCase().includes(inputValue)
    );
  };

  const getSuggestionValue = (suggestion: Vehicle) => suggestion.vehicleNumber;

  const renderSuggestion = (suggestion: Vehicle) => (
    <div>{suggestion.vehicleNumber}</div>
  );

  // Autosuggest input props
  const inputProps = {
    id: "vehicleNumber",
    name: "vehicleNumber",
    placeholder: "Type vehicle number",
    value: formData.vehicleNumber,
    onChange: (_: React.FormEvent<any>, { newValue }: { newValue: string }) => {
      setFormData((prev) => ({ ...prev, vehicleNumber: newValue }));
      setVehicleTouched(false); // Reset touched on change
    },
    onBlur: () => setVehicleTouched(true), // Mark as touched on blur
    className:
      "w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500",
    required: true,
    autoComplete: "off",
  };

  // Autofill vehicle data when vehicleNumber changes
  useEffect(() => {
    if (!formData.vehicleNumber) {
      setVehicleNotFound(false);
      setFormData((prev) => ({
        ...prev,
        vehicleId: "",
        year: "",
        vehicleBrand: "",
        vehicleModel: "",
        tireSizeRequired: "",
      }));
      return;
    }
    const found = vehicles.find(
      (v) => v.vehicleNumber === formData.vehicleNumber
    );
    if (found) {
      setVehicleNotFound(false);
      setFormData((prev) => ({
        ...prev,
        vehicleId: found.id.toString(),
        year: found.year ? String(found.year) : "",
        vehicleBrand: found.make || "",
        vehicleModel: found.model || "",
        tireSizeRequired: found.tireSize || "",
      }));
    } else {
      setVehicleNotFound(true);
      setFormData((prev) => ({
        ...prev,
        vehicleId: "",
        year: "",
        vehicleBrand: "",
        vehicleModel: "",
        tireSizeRequired: "",
      }));
    }
  }, [formData.vehicleNumber, vehicles]);

  // Auto-clear error and success messages after 4 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError("");
        setSuccess(false);
      }, 4000); // <-- 4 seconds
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.target.files && e.target.files[0]) {
      const newImages = [...formData.images];
      newImages[index] = e.target.files[0];
      setFormData((prev) => ({
        ...prev,
        images: newImages,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Block if not logged in
    if (!user) {
      setError("You must be logged in to submit a tire request.");
      return;
    }

    setFormLoading(true);

    // Validate vehicle number
    const selectedVehicle = vehicles.find(
      (v) => v.vehicleNumber === formData.vehicleNumber
    );
    if (!selectedVehicle) {
      setFormLoading(false);
      setError("Please select a valid vehicle number from the list.");
      return;
    }

    // Before calling addRequest
    const numericFields = [
      "vehicleId",
      "quantity",
      "tubesQuantity",
      "presentKmReading",
      "previousKmReading",
      "userId",
    ];
    // Add userId from logged-in user
    formData.userId = user.id;

    // Ensure tireSize is set for backend
    formData.tireSize = formData.tireSizeRequired;

    numericFields.forEach((field) => {
      if (
        formData[field] === "" ||
        formData[field] === null ||
        formData[field] === undefined
      ) {
        formData[field] = 0;
      } else {
        formData[field] = Number(formData[field]);
      }
    });

    // Ensure tireSize is set
    formData.tireSize = formData.tireSizeRequired;

    try {
      // Simulate processing delay of 2 seconds
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (key === "images" && Array.isArray(value)) {
          value.forEach((file, idx) => {
            if (file) formDataToSend.append("images", file);
          });
        } else {
          formDataToSend.append(key, value);
        }
      });

      console.log("Submitting formData:", formData);

      await fetch("http://localhost:5000/api/requests", {
        method: "POST",
        body: formDataToSend,
      });

      setFormLoading(false);
      setSuccess(true);

      // Delay closing the form so the user sees the success message
      setTimeout(() => {
        setSuccess(false);
        setFormData(initialFormData);
        if (onSuccess) onSuccess();
      }, 2000); // Show message for 2 seconds
    } catch (err) {
      setFormLoading(false);
      setError("An error occurred while submitting your request");
    }
  };

  // Redirect to login if not logged in
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (vehiclesLoading) {
    return <div>Loading vehicles...</div>;
  }
  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <h2 className="mb-6 text-2xl font-bold">
          Tire Replacement Approval Request
        </h2>
        <div className="px-4 py-3 mb-4 text-red-700 bg-red-100 border border-red-400 rounded">
          No vehicles found. Please contact your administrator.
        </div>
      </div>
    );
  }

  return (
    <div className="relative p-6 bg-white rounded-lg shadow-md">
      {/* Loading Spinner Modal */}
      {formLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 mb-4 border-4 border-gray-200 rounded-full border-t-transparent animate-spin"></div>
            <span className="text-lg font-semibold text-white">
              Processing...
            </span>
          </div>
        </div>
      )}

      {/* Popup Modal for Success/Error */}
      {(success || error) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="w-full max-w-md px-12 py-8 text-center bg-white rounded-lg shadow-lg">
            {success && (
              <div>
                <svg
                  className="mx-auto mb-3 text-green-500 w-14 h-14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <div className="mb-2 text-xl font-bold text-green-700">
                  Success
                </div>
                <div className="text-gray-700">
                  Your request has been submitted successfully.
                </div>
              </div>
            )}
            {error && (
              <div>
                <svg
                  className="mx-auto mb-3 text-red-500 w-14 h-14"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <div className="mb-2 text-xl font-bold text-red-700">Error</div>
                <div className="text-gray-700">{error}</div>
              </div>
            )}
          </div>
        </div>
      )}

      <h2 className="mb-6 text-2xl font-bold">
        Tire Replacement Approval Request
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="p-4 mb-6 rounded-lg bg-blue-50">
          <h3 className="mb-3 text-lg font-semibold">Your Information</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="requesterName"
              >
                Your Name
              </label>
              <input
                id="requesterName"
                name="requesterName"
                type="text"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.requesterName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="requesterEmail"
              >
                Your Email
              </label>
              <input
                id="requesterEmail"
                name="requesterEmail"
                type="email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.requesterEmail}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="requesterPhone"
              >
                Your Phone
              </label>
              <input
                id="requesterPhone"
                name="requesterPhone"
                type="tel"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={formData.requesterPhone}
                onChange={handleChange}
                required
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 mb-6 md:grid-cols-2">
          <div>
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="vehicleNumber"
            >
              Vehicle Number
            </label>
            <Autosuggest
              suggestions={suggestions}
              onSuggestionsFetchRequested={({ value }: { value: string }) =>
                setSuggestions(getSuggestions(value))
              }
              onSuggestionsClearRequested={() => setSuggestions([])}
              getSuggestionValue={getSuggestionValue}
              renderSuggestion={renderSuggestion}
              inputProps={inputProps}
              onSuggestionSelected={(
                _: React.FormEvent<any>,
                { suggestion }: { suggestion: Vehicle }
              ) => {
                setFormData((prev) => ({
                  ...prev,
                  vehicleNumber: suggestion.vehicleNumber,
                  vehicleId: suggestion.id.toString(),
                  year: suggestion.year ? String(suggestion.year) : "",
                  vehicleBrand: suggestion.make || "",
                  vehicleModel: suggestion.model || "",
                  tireSizeRequired: suggestion.tireSize || "",
                }));
                setVehicleNotFound(false);
              }}
            />
            {vehicleNotFound && vehicleTouched && (
              <div className="mt-1 text-sm text-red-600">
                Vehicle number not found. Please select a valid vehicle from the
                list.
              </div>
            )}
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="year"
            >
              Vehicle Year
            </label>
            <input
              id="year"
              name="year"
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.year}
              onChange={handleChange}
              readOnly
              required
              disabled={vehicleNotFound}
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="vehicleBrand"
            >
              Vehicle Brand
            </label>
            <input
              id="vehicleBrand"
              name="vehicleBrand"
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.vehicleBrand}
              onChange={handleChange}
              readOnly
              required
              disabled={vehicleNotFound}
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="vehicleModel"
            >
              Vehicle Model
            </label>
            <input
              id="vehicleModel"
              name="vehicleModel"
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.vehicleModel}
              onChange={handleChange}
              readOnly
              required
              disabled={vehicleNotFound}
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="userSection"
            >
              User Section
            </label>
            <input
              id="userSection"
              name="userSection"
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.userSection}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="lastReplacementDate"
            >
              Last Tire Replacement Date
            </label>
            <input
              id="lastReplacementDate"
              name="lastReplacementDate"
              type="date"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.lastReplacementDate}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="existingTireMake"
            >
              Make of Existing Tire
            </label>
            <input
              id="existingTireMake"
              name="existingTireMake"
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.existingTireMake}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="tireSizeRequired"
            >
              Tire Size Required
            </label>
            <input
              id="tireSizeRequired"
              name="tireSizeRequired"
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.tireSizeRequired}
              onChange={handleChange}
              readOnly
              required
              disabled={vehicleNotFound}
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="quantity"
            >
              Number of Tires Required
            </label>
            <input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              max="10"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.quantity}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="tubesQuantity"
            >
              Number of Tubes Required
            </label>
            <input
              id="tubesQuantity"
              name="tubesQuantity"
              type="number"
              min="0"
              max="10"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.tubesQuantity}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="costCenter"
            >
              Cost Center
            </label>
            <input
              id="costCenter"
              name="costCenter"
              type="text"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.costCenter}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="presentKmReading"
            >
              Present KM Reading
            </label>
            <input
              id="presentKmReading"
              name="presentKmReading"
              type="number"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.presentKmReading}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="previousKmReading"
            >
              KM Reading at Previous Tire Replacement
            </label>
            <input
              id="previousKmReading"
              name="previousKmReading"
              type="number"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.previousKmReading}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold">Tire Wear Indicator</h3>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {[
              "Yes",
              "No",
              "one edge",
              "middle",
              "both edge",
              "middle crack",
              "sidewall crack",
              "normal wear",
            ].map((option) => (
              <label key={option} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="tireWearPattern"
                  value={option}
                  checked={formData.tireWearPattern === option}
                  onChange={handleChange}
                  className="text-blue-600"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="comments"
          >
            Comments
          </label>
          <textarea
            id="comments"
            name="comments"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            value={formData.comments}
            onChange={handleChange}
          ></textarea>
        </div>

        <div className="mb-6">
          <h3 className="mb-3 text-lg font-semibold">Upload Images</h3>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {formData.images.map((_, index) => (
              <div key={index}>
                <label
                  className="block mb-2 text-sm font-bold text-gray-700"
                  htmlFor={`image-${index}`}
                >
                  Image {index + 1}
                </label>
                <input
                  id={`image-${index}`}
                  type="file"
                  accept="image/*"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onChange={(e) => handleFileChange(e, index)}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="mb-6">
          <label
            className="block mb-2 text-sm font-bold text-gray-700"
            htmlFor="requestReason"
          >
            Reason for Request
          </label>
          <textarea
            id="requestReason"
            name="requestReason"
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Please explain why new tires are needed..."
            value={formData.requestReason}
            onChange={handleChange}
            required
          ></textarea>
        </div>

        <button
          type="submit"
          className="w-full p-3 font-bold text-white transition-colors bg-blue-600 rounded hover:bg-blue-700"
          disabled={vehicleNotFound}
        >
          Submit Approval Request
        </button>
      </form>
    </div>
  );
};

export default TireRequestForm;
