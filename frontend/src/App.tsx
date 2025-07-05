import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import OnboardingPage from './pages/OnboardingPage';
import OffersPage from './pages/OffersPage';
import TopicsPage from './pages/TopicsPage';
import ContentPage from './pages/ContentPage';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-gray-900">
          <Routes>
            <Route path="/" element={<OnboardingPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/topics" element={<TopicsPage />} />
            <Route path="/content/:id" element={<ContentPage />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;