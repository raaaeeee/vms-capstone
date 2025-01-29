import React, { useState } from 'react';
import supabase from '../supabaseClient';

const VisitorForm = () => {
  const [visitorName, setVisitorName] = useState('');
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isNameNotFoundModalOpen, setIsNameNotFoundModalOpen] = useState(false);

  const today = new Date().toISOString().split('T')[0]; // Get today's date in 'YYYY-MM-DD' format

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: existingVisitors, error: checkError } = await supabase
        .from('visitors')
        .select('name, date')
        .eq('name', visitorName)
        .eq('date', today);

      if (checkError) throw checkError;

      if (existingVisitors.length === 0) {
        setIsNameNotFoundModalOpen(true);
        setLoading(false);
        return;
      }

      const { error: updateError } = await supabase
        .from('visitors')
        .update({ status: 'Attended' })
        .eq('name', visitorName);

      if (updateError) throw updateError;

      setIsModalOpen(true);
    } catch (error) {
      alert('Failed to update status.');
      console.error('Error updating visitor status:', error.message);
    } finally {
      setLoading(false);
      setVisitorName('');
    }
  };

  return (
    <div
      className="relative flex items-center justify-center min-h-screen bg-cover bg-center font-mono"
      style={{
        backgroundImage: "url('images/csu-bg.jpg')",
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="bg-opacity-90 shadow-lg rounded-lg p-6 w-full max-w-md relative z-10 backdrop-blur-sm bg-white/40 border border-white/40">
        <h1 className="text-3xl font-semibold text-center text-white mb-6">
          Visitor Log
        </h1>
        <hr />
        <form onSubmit={handleSubmit} className="space-y-4 mt-5">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-white"
            >
              Visitor's Name
            </label>
            <input
              type="text"
              id="name"
              value={visitorName}
              onChange={(e) => setVisitorName(e.target.value)}
              placeholder="Enter your name"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ease-in-out"
            />
          </div>
          <button
            type="submit"
            className={`w-full py-3 px-4 text-white font-semibold rounded-md shadow-md transition transform ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-800 hover:bg-green-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>

      {/* Success Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-80 text-center transform transition-all duration-300 scale-105">
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              Visit Confirmed!
            </h2>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Name Not Found Modal */}
      {isNameNotFoundModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-80 text-center transform transition-all duration-300 scale-105">
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Name Not Found
            </h2>
            <p className="mb-4 text-gray-700">
              The entered name does not exist in our records.
            </p>
            <button
              onClick={() => setIsNameNotFoundModalOpen(false)}
              className="mt-4 px-4 py-2 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700"
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
