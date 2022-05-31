import {
  VFC,
  createContext,
  useReducer,
  Dispatch,
  ReactNode,
  useContext
} from 'react';

export type OrderFormStateType = {
  reservationAnotherOpens: {
    index: number;
    open: boolean;
    registerFlg: boolean;
  }[];
  removeOrderItemIds: number[];
  registerAnotherFlg: boolean;
  customerId: number;
};

const initialState: Readonly<OrderFormStateType> = {
  reservationAnotherOpens: [],
  removeOrderItemIds: [],
  registerAnotherFlg: false,
  customerId: 0
};

type ADD_RESERVATION_ANOTHER = 'ADD_RESERVATION_ANOTHER';
type HANDLE_RESERVATION_ANOTHER = 'HANDLE_RESERVATION_ANOTHER';
type ADD_REMOVE_ORDER_ITEM_ID = 'ADD_REMOVE_ORDER_ITEM_ID';
type EXEC_REGISTER_ANOTHER = 'EXEC_REGISTER_ANOTHER';
type RESET = 'RESET';
type SET_CUSTOMER_ID = 'SET_CUSTOMER_ID';
type DELETE_RESERVATION_ANOTHER = 'DELETE_RESERVATION_ANOTHER';

const ActionType: {
  ADD_RESERVATION_ANOTHER: ADD_RESERVATION_ANOTHER;
  HANDLE_RESERVATION_ANOTHER: HANDLE_RESERVATION_ANOTHER;
  ADD_REMOVE_ORDER_ITEM_ID: ADD_REMOVE_ORDER_ITEM_ID;
  EXEC_REGISTER_ANOTHER: EXEC_REGISTER_ANOTHER;
  SET_CUSTOMER_ID: SET_CUSTOMER_ID;
  DELETE_RESERVATION_ANOTHER: DELETE_RESERVATION_ANOTHER;
  RESET: RESET;
} = {
  ADD_RESERVATION_ANOTHER: 'ADD_RESERVATION_ANOTHER',
  HANDLE_RESERVATION_ANOTHER: 'HANDLE_RESERVATION_ANOTHER',
  ADD_REMOVE_ORDER_ITEM_ID: 'ADD_REMOVE_ORDER_ITEM_ID',
  EXEC_REGISTER_ANOTHER: 'EXEC_REGISTER_ANOTHER',
  SET_CUSTOMER_ID: 'SET_CUSTOMER_ID',
  DELETE_RESERVATION_ANOTHER: 'DELETE_RESERVATION_ANOTHER',
  RESET: 'RESET'
};

export const addReservationAnother = () => ({
  type: ActionType.ADD_RESERVATION_ANOTHER
});

export const handleReservationAnother = (index: number, open: boolean) => ({
  type: ActionType.HANDLE_RESERVATION_ANOTHER,
  payload: {
    index,
    open
  }
});

export const addRemoveOrderItemId = (id: number) => ({
  type: ActionType.ADD_REMOVE_ORDER_ITEM_ID,
  payload: {
    id
  }
});

export const execOnRegisterAnother = () => ({
  type: ActionType.EXEC_REGISTER_ANOTHER
});

export const setCustomerId = (customerId: number) => ({
  type: ActionType.SET_CUSTOMER_ID,
  payload: {
    customerId
  }
});

export const deleteReservationAnother = (deleteIndex: number) => ({
  type: ActionType.DELETE_RESERVATION_ANOTHER,
  payload: {
    deleteIndex
  }
});

export const reset = () => ({
  type: ActionType.RESET
});

type OrderFormActionType =
  | ReturnType<typeof addReservationAnother>
  | ReturnType<typeof handleReservationAnother>
  | ReturnType<typeof addRemoveOrderItemId>
  | ReturnType<typeof execOnRegisterAnother>
  | ReturnType<typeof setCustomerId>
  | ReturnType<typeof deleteReservationAnother>
  | ReturnType<typeof reset>;

const OrderFormReducer = (
  state: OrderFormStateType,
  action: OrderFormActionType
) => {
  switch (action.type) {
    case ActionType.ADD_RESERVATION_ANOTHER:
      return {
        ...state,
        reservationAnotherOpens: state.reservationAnotherOpens.concat({
          index: state.reservationAnotherOpens.length + 1,
          open: false,
          registerFlg: true
        })
      };
    case ActionType.HANDLE_RESERVATION_ANOTHER:
      return {
        ...state,
        reservationAnotherOpens: state.reservationAnotherOpens.map((n) =>
          n.index === action.payload.index
            ? { ...n, open: action.payload.open }
            : n
        )
      };
    case ActionType.ADD_REMOVE_ORDER_ITEM_ID:
      return {
        ...state,
        removeOrderItemIds: state.removeOrderItemIds.concat(action.payload.id)
      };
    case ActionType.EXEC_REGISTER_ANOTHER:
      return {
        ...state,
        registerAnotherFlg: true
      };
    case ActionType.SET_CUSTOMER_ID:
      return {
        ...state,
        customerId: action.payload.customerId
      };
    case ActionType.DELETE_RESERVATION_ANOTHER:
      return {
        ...state,
        reservationAnotherOpens: state.reservationAnotherOpens.map((n) =>
          n.index === action.payload.deleteIndex
            ? { ...n, registerFlg: false }
            : n
        )
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
