import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RBProvider } from './context/RBContext';
import { StepPage } from './routes/StepPage';
import { ProofPage } from './routes/ProofPage';
import './App.css';

function App() {
  return (
    <RBProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/rb/01-problem" replace />} />
          <Route path="/rb" element={<Navigate to="/rb/01-problem" replace />} />
          <Route path="/rb/proof" element={<ProofPage />} />
          <Route path="/rb/:step" element={<StepPage />} />
        </Routes>
      </BrowserRouter>
    </RBProvider>
  );
}

export default App;
