import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { RBProvider } from './context/RBContext';
import { ResumeBuilderProvider } from './context/ResumeBuilderContext';
import { TemplateProvider } from './context/TemplateContext';
import { StepPage } from './routes/StepPage';
import { ProofPage as RBProofPage } from './routes/ProofPage';
import { HomePage } from './routes/HomePage';
import { BuilderPage } from './routes/BuilderPage';
import { PreviewPage } from './routes/PreviewPage';
import { ResumeProofPage } from './routes/ResumeProofPage';
import './App.css';

function App() {
  return (
    <RBProvider>
      <ResumeBuilderProvider>
        <TemplateProvider>
          <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/builder" element={<BuilderPage />} />
            <Route path="/preview" element={<PreviewPage />} />
            <Route path="/proof" element={<ResumeProofPage />} />

            <Route path="/rb" element={<Navigate to="/rb/01-problem" replace />} />
            <Route path="/rb/proof" element={<RBProofPage />} />
            <Route path="/rb/:step" element={<StepPage />} />
          </Routes>
        </BrowserRouter>
        </TemplateProvider>
      </ResumeBuilderProvider>
    </RBProvider>
  );
}

export default App;
