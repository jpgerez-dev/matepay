import './polyfills';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import {WalletProviders} from './solana/WalletProviders';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <WalletProviders>
    <App />
  </WalletProviders>
);
