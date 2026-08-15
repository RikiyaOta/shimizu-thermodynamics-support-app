import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { LegendrePage } from './pages/LegendrePage';

export const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/legendre" element={<LegendrePage />} />
      </Routes>
    </Router>
  );
};

export default App;
