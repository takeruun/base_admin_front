import { Suspense, lazy } from 'react';

import SuspenseLoader from 'src/components/SuspenseLoader';
import Guest from 'src/components/Guest';

const Loader = (Component) => (props) =>
  (
    <Suspense fallback={<SuspenseLoader />}>
      <Component {...props} />
    </Suspense>
  );

// Account

const LoginBasic = Loader(
  lazy(() => import('src/content/pages/Auth/Login/Basic'))
);

const Register = Loader(
  lazy(() => import('src/content/pages/Auth/Register/Basic'))
);

const RecoverPassword = Loader(
  lazy(() => import('src/content/pages/Auth/RecoverPassword'))
);

const accountRoutes = [
  {
    path: 'login',
    element: (
      <Guest>
        <LoginBasic />
      </Guest>
    )
  },
  {
    path: 'recover-password',
    element: <RecoverPassword />
  },

  {
    path: 'register',
    element: <Register />
  }
];

export default accountRoutes;
