import {
  VFC,
  createContext,
  useReducer,
  Dispatch,
  ReactNode,
  useContext
} from 'react';
import type { Order } from 'src/models/order';
import type { OrderEvent, Resource } from 'src/models/calendar';

export type DashboardStateType = {
  orders: Order[];
  events: OrderEvent[];
  resources: Resource[];
};

const initialState: Readonly<DashboardStateType> = {
  orders: [],
  events: [],
  resources: []
};

type SET_ORDERS = 'SET_ORDERS';
type SET_EVENTS_RESOURCES = 'SET_EVENTS_RESOURCES';
type UPDATE_ORDER = 'UPDATE_ORDER';

const ActionType: {
  SET_ORDERS: SET_ORDERS;
  SET_EVENTS_RESOURCES: SET_EVENTS_RESOURCES;
  UPDATE_ORDER: UPDATE_ORDER;
} = {
  SET_ORDERS: 'SET_ORDERS',
  SET_EVENTS_RESOURCES: 'SET_EVENTS_RESOURCES',
  UPDATE_ORDER: 'UPDATE_ORDER'
};

export const setDashboardOrders = (orders: Order[]) => ({
  type: ActionType.SET_ORDERS,
  payload: { orders }
});

export const setEventsResources = (
  events: OrderEvent[],
  resources: Resource[]
) => ({
  type: ActionType.SET_EVENTS_RESOURCES,
  payload: { events, resources }
});

export const updateDashboardOrder = (order: Order) => ({
  type: ActionType.UPDATE_ORDER,
  payload: {
    order
  }
});

type DashboardActionType =
  | ReturnType<typeof setDashboardOrders>
  | ReturnType<typeof setEventsResources>
  | ReturnType<typeof updateDashboardOrder>;

const dashboardReducer = (
  state: DashboardStateType,
  action: DashboardActionType
) => {
  switch (action.type) {
    case ActionType.SET_ORDERS:
      return {
        ...state,
        orders: action.payload.orders
      };
    case ActionType.SET_EVENTS_RESOURCES:
      return {
        ...state,
        events: action.payload.events,
        resources: action.payload.resources
      };
    case ActionType.UPDATE_ORDER:
      return {
        ...state,
        orders: state.orders.map((order) => {
          if (order.id === action.payload.order.id) return action.payload.order;
          else return order;
        })
      };
    default:
      throw new Error('Invalid action type');
  }
};

type DashboardDispatchType = Dispatch<DashboardActionType>;
const DashboardStateContext = createContext(initialState as DashboardStateType);
const DashboardDispatchContext = createContext<DashboardDispatchType>(() => {
  throw new Error('Context not provided');
});

type Props = {
  children: ReactNode;
};

export const DashboardProvider: VFC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);

  return (
    <DashboardDispatchContext.Provider value={dispatch}>
      <DashboardStateContext.Provider value={state}>
        {children}
      </DashboardStateContext.Provider>
    </DashboardDispatchContext.Provider>
  );
};

export const useDashboardState = () => useContext(DashboardStateContext);
export const useDashboardDispatch = () => useContext(DashboardDispatchContext);
