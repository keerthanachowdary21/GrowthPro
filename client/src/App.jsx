// client/src/App.jsx

import { useState } from 'react';
import './index.css'; // Import Tailwind CSS styles
// A simple loading spinner component
const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  // State for form inputs
  const [formData, setFormData] = useState({ name: '', location: '' });
  // State for data returned from API
  const [businessData, setBusinessData] = useState(null);
  // State for loading indicators
  const [isLoading, setIsLoading] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  // State for error messages
  const [error, setError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Basic Form Validation
    if (!formData.name || !formData.location) {
      setError('Please fill in both fields.');
      return;
    }
    setIsLoading(true);
    setError('');
    setBusinessData(null); // Clear old data

    try {
      const response = await fetch(`${API_URL}/api/business-data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Something went wrong!');
      const data = await response.json();
      setBusinessData({ ...data, rating: parseFloat(data.rating) }); // Ensure rating is a number
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    try {
      const params = new URLSearchParams({ name: formData.name, location: formData.location });
      const response = await fetch(`${API_URL}/api/regenerate-headline?${params}`);
      if (!response.ok) throw new Error('Failed to regenerate headline.');
      const data = await response.json();
      setBusinessData(prev => ({ ...prev, headline: data.headline }));
    } catch (err) {
      // You could show a small toast notification here instead of a big error
      console.error(err);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center text-white p-4 font-sans transition-colors duration-300">
      <header className="w-full max-w-4xl text-center my-8">
        <h1 className="text-4xl md:text-5xl font-bold text-indigo-600">GrowthProAI</h1>
        <p className="text-gray-600

 mt-2">Mini Local Business Dashboard @ Keerthana</p>
      </header>

      <main className="w-full max-w-md">
        {/* --- Form Card --- */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4">Enter Business Details</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 mb-2">Business Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500

"
                placeholder="e.g., Cake & Co"
              />
            </div>
            <div className="mb-6">
              <label htmlFor="location" className="block text-gray-700 mb-2">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-gray-50 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500

"
                placeholder="e.g., Mumbai"
              />
            </div>
            {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 hover:bg-cyan-700 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-all"
            >
              {isLoading ? <Spinner /> : 'Get Data'}
            </button>
          </form>
        </div>

        {/* --- Display Card (conditional) --- */}
        {businessData && (
          <div className="mt-8 bg-white p-6 rounded-lg shadow-lg animate-fade-in">
            <h3 className="text-xl font-bold text-white mb-4">{formData.name} - {formData.location}</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                <span className="text-gray-700">Google Rating</span>
                <span className="font-bold text-lg text-yellow-400">{businessData.rating} ★</span>
              </div>
              <div className="flex justify-between items-center bg-gray-50 p-3 rounded-md">
                <span className="text-gray-700">Number of Reviews</span>
                <span className="font-bold text-lg text-indigo-600">{businessData.reviews}</span>
              </div>
              <div className="bg-gray-50 p-3 rounded-md">
                <span className="text-gray-700 block mb-2">AI-Generated SEO Headline</span>
                <p className="font-semibold text-white text-lg">"{businessData.headline}"</p>
              </div>
            </div>
            <button
              onClick={handleRegenerate}
              disabled={isRegenerating}
              className="w-full mt-6 bg-green-600 hover:bg-green-700 disabled:bg-slate-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-all"
            >
              {isRegenerating ? <Spinner /> : 'Regenerate SEO Headline'}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;