import { Suspense, lazy } from 'react';
import { Navigate } from 'react-router-dom';

import SuspenseLoader from 'src/components/SuspenseLoader';

const Loader = (Component) =>
  function (props) {
    return (
      <Suspense fallback={<SuspenseLoader />}>
        <Component {...props} />
      </Suspense>
    );
  };

// Dashboards

const Reports = Loader(lazy(() => import('src/content/dashboards/Reports')));

const Customers = Loader(lazy(() => import('src/content/pages/Customers')));
const CreateCustomers = Loader(
  lazy(() => import('src/content/pages/Customers/create'))
);
const EditCustomers = Loader(
  lazy(() => import('src/content/pages/Customers/edit'))
);

const Orders = Loader(lazy(() => import('src/content/pages/Orders')));
const CreateOrders = Loader(
  lazy(() => import('src/content/pages/Orders/create'))
);
const EditOrder = Loader(lazy(() => import('src/content/pages/Orders/edit')));
const AccountingOrders = Loader(
  lazy(() => import('src/content/pages/Orders/accounting'))
);
const ShowOrder = Loader(lazy(() => import('src/content/pages/Orders/show')));
const ReceiptOrder = Loader(
  lazy(() => import('src/content/pages/Orders/receipt'))
);

const Courses = Loader(lazy(() => import('src/content/pages/Courses')));
const CreateCourses = Loader(
  lazy(() => import('src/content/pages/Courses/create'))
);

const Products = Loader(lazy(() => import('src/content/pages/Products')));
const CreateProducts = Loader(
  lazy(() => import('src/content/pages/Products/create'))
);

const Categories = Loader(lazy(() => import('src/content/pages/Categories')));
const CreateCategories = Loader(
  lazy(() => import('src/content/pages/Categories/create'))
);

const Administrators = Loader(
  lazy(() => import('src/content/pages/Administrators'))
);
const CreateAdministrators = Loader(
  lazy(() => import('src/content/pages/Administrators/create'))
);

const Calendar = Loader(lazy(() => import('src/content/pages/Calendar')));

const ImageSaves = Loader(lazy(() => import('src/content/pages/ImageSaves')));

const dashboardsRoutes = [
  {
    path: '/',
    element: <Reports />
  },
  {
    path: 'customers',
    children: [
      {
        path: '/',
        element: <Customers />
      },
      {
        path: 'new',
        element: <CreateCustomers />
      },
      {
        path: 'edit/:customerId',
        element: <EditCustomers />
      }
    ]
  },
  {
    path: 'orders',
    children: [
      {
        path: '/',
        element: <Orders />
      },
      {
        path: '/new',
        element: <CreateOrders />
      },
      {
        path: '/:orderId',
        element: <ShowOrder />
      },
      {
        path: '/edit/:orderId',
        element: <EditOrder />
      },
      {
        path: '/accounting/:orderId',
        element: <AccountingOrders />
      },
      {
        path: '/receipt/:orderId',
        element: <ReceiptOrder />
      }
    ]
  },
  {
    path: 'courses',
    children: [
      {
        path: '/',
        element: <Courses />
      },
      {
        path: '/new',
        element: <CreateCourses />
      }
    ]
  },
  {
    path: 'image_saves',
    children: [
      {
        path: '/',
        element: <ImageSaves />
      }
    ]
  },
  {
    path: 'products',
    children: [
      {
        path: '/',
        element: <Products />
      },
      {
        path: '/new',
        element: <CreateProducts />
      }
    ]
  },
  {
    path: 'categories',
    children: [
      {
        path: '/',
        element: <Categories />
      },
      {
        path: '/new',
        element: <CreateCategories />
      }
    ]
  },
  {
    path: 'administrators',
    children: [
      {
        path: '/',
        element: <Administrators />
      },
      {
        path: '/new',
        element: <CreateAdministrators />
      }
    ]
  },
  {
    path: 'calendar',
    children: [
      {
        path: '/',
        element: <Calendar />
      }
    ]
  }
];

export default dashboardsRoutes;
