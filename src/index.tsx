```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './store';
import { GlobalStyles } from './styles/GlobalStyles';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    {/* Provide the Redux store to the entire application */}
    <Provider store={store}>
      {/* Apply global styles */}
      <GlobalStyles />
      {/* Enable routing */}
      <BrowserRouter>
        {/* Render the main App component */}
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```