import {
  VFC,
  createContext,
  useReducer,
  Dispatch,
  ReactNode,
  useContext
} from 'react';
import type { Order } from 'src/models/order';

export type OrderStateType = {
  orders: Order[];
  totalCount: number;
};

const initialState: Readonly<OrderStateType> = {
  orders: [],
  totalCount: 0
};

type SET_ORDERS = 'SET_ORDERS';
type UPDATE_ORDER = 'UPDATE_ORDER';

const ActionType: {
  SET: SET_ORDERS;
  UPDATE: UPDATE_ORDER;
} = {
  SET: 'SET_ORDERS',
  UPDATE: 'UPDATE_ORDER'
};

export const setOrders = (orders: Order[], totalCount: number) => ({
  type: ActionType.SET,
  payload: {
    orders,
    totalCount
  }
});

export const updateOrder = (order: Order) => ({
  type: ActionType.UPDATE,
  payload: {
    order
  }
});

type OrderActionType =
  | ReturnType<typeof setOrders>
  | ReturnType<typeof updateOrder>;

const OrderReducer = (state: OrderStateType, action: OrderActionType) => {
  switch (action.type) {
    case ActionType.SET:
      return {
        ...state,
        orders: action.payload.orders,
        totalCount: action.payload.totalCount
      };
    case ActionType.UPDATE:
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

type OrderDispatchType = Dispatch<OrderActionType>;
const OrderStateContext = createContext(initialState as OrderStateType);
const OrderDispatchContext = createContext<OrderDispatchType>(() => {
  throw new Error('Context not provided');
});

type Props = {
  children: ReactNode;
};

export const OrderProvider: VFC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(OrderReducer, initialState);

  return (
    <OrderDispatchContext.Provider value={dispatch}>
      <OrderStateContext.Provider value={state}>
        {children}
      </OrderStateContext.Provider>
    </OrderDispatchContext.Provider>
  );
};

export const useOrderState = () => useContext(OrderStateContext);
export const useOrderDispatch = () => useContext(OrderDispatchContext);
