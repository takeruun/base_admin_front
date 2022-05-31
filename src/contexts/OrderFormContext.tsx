import {
  VFC,
  createContext,
  useReducer,
  Dispatch,
  ReactNode,
  useContext
} from 'react';

export type OrderFormStateType = {
  removeOrderItemIds: number[];
  customerId: number;
};

const initialState: Readonly<OrderFormStateType> = {
  removeOrderItemIds: [],
  customerId: 0
};

type ADD_REMOVE_ORDER_ITEM_ID = 'ADD_REMOVE_ORDER_ITEM_ID';
type RESET = 'RESET';
type SET_CUSTOMER_ID = 'SET_CUSTOMER_ID';

const ActionType: {
  ADD_REMOVE_ORDER_ITEM_ID: ADD_REMOVE_ORDER_ITEM_ID;
  SET_CUSTOMER_ID: SET_CUSTOMER_ID;
  RESET: RESET;
} = {
  ADD_REMOVE_ORDER_ITEM_ID: 'ADD_REMOVE_ORDER_ITEM_ID',
  SET_CUSTOMER_ID: 'SET_CUSTOMER_ID',
  RESET: 'RESET'
};

export const addRemoveOrderItemId = (id: number) => ({
  type: ActionType.ADD_REMOVE_ORDER_ITEM_ID,
  payload: {
    id
  }
});

export const setCustomerId = (customerId: number) => ({
  type: ActionType.SET_CUSTOMER_ID,
  payload: {
    customerId
  }
});


export const reset = () => ({
  type: ActionType.RESET
});

type OrderFormActionType =
  | ReturnType<typeof addRemoveOrderItemId>
  | ReturnType<typeof setCustomerId>
  | ReturnType<typeof reset>;

const OrderFormReducer = (
  state: OrderFormStateType,
  action: OrderFormActionType
) => {
  switch (action.type) {
    case ActionType.ADD_REMOVE_ORDER_ITEM_ID:
      return {
        ...state,
        removeOrderItemIds: state.removeOrderItemIds.concat(action.payload.id)
      };
    case ActionType.SET_CUSTOMER_ID:
      return {
        ...state,
        customerId: action.payload.customerId
      };
    case ActionType.RESET:
      return initialState;
    default:
      throw new Error('Invalid action type');
  }
};

type OrderFormDispatchType = Dispatch<OrderFormActionType>;
const OrderFormStateContext = createContext(initialState as OrderFormStateType);
const OrderFormDispatchContext = createContext<OrderFormDispatchType>(() => {
  throw new Error('Context not provided');
});

type Props = {
  children: ReactNode;
};

export const OrderFormProvider: VFC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(OrderFormReducer, initialState);

  return (
    <OrderFormDispatchContext.Provider value={dispatch}>
      <OrderFormStateContext.Provider value={state}>
        {children}
      </OrderFormStateContext.Provider>
    </OrderFormDispatchContext.Provider>
  );
};

export const useOrderFormState = () => useContext(OrderFormStateContext);
export const useOrderFormDispatch = () => useContext(OrderFormDispatchContext);
