import React, { useState } from "react";
import supabase from "../supabaseClient";

const VisitorForm = () => {
  const [visitorName, setVisitorName] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase
        .from('visitors')
        .update({ status: 'Attended' })
        .eq('name', visitorName);
      if (error) throw error;

      // Show the modal on success
      setIsModalOpen(true);
    } catch (error) {
      alert('Failed to update status.');
      console.error('Error updating visitor status:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-green-600">
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="relative bg-white bg-opacity-90 shadow-lg rounded-lg p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Visitor Log
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Visitor's Name
            </label>
            <input
              type="text"
              id="name"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 text-white font-bold rounded-md shadow-md transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={loading}
          >
            {loading ? "Sending..." : "Submit"}
          </button>
        </form>

        {status === "success" && (
          <div className="mt-4 p-4 text-green-700 bg-green-100 border border-green-300 rounded-md">
            🎉 Name sent successfully!
          </div>
        )}

        {status === "error" && (
          <div className="mt-4 p-4 text-red-700 bg-red-100 border border-red-300 rounded-md">
            ❌ Failed to send name. Please try again.
          </div>
        )}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-80 text-center">
            <h2 className="text-xl font-bold mb-4">Visit Confirmed!</h2>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorForm;
