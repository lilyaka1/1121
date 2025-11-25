import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const rootEl = document.getElementById('root');
if (!rootEl) {
	throw new Error('В HTML-файле должен быть элемент с id="root"');
}
createRoot(rootEl).render(<App />);
