import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Pilot from './Pilot.jsx';
import '../styles.css';
import './pilot.css';

createRoot(document.getElementById('pilot-root')).render(
  <StrictMode>
    <Pilot />
  </StrictMode>,
);
