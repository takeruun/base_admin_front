import ReactDOM from 'react-dom';
import 'src/utils/chart';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import ScrollTop from 'src/hooks/useScrollTop';

import 'nprogress/nprogress.css';
import App from 'src/App';
import * as serviceWorker from 'src/serviceWorker';
import { RootContextProvider } from 'src/contexts';

ReactDOM.render(
  <HelmetProvider>
    <RootContextProvider>
      <BrowserRouter>
        <ScrollTop />
        <App />
      </BrowserRouter>
    </RootContextProvider>
  </HelmetProvider>,
  document.getElementById('root')
);

serviceWorker.unregister();
