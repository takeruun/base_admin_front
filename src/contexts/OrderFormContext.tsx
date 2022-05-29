import {
  VFC,
  createContext,
  useReducer,
  Dispatch,
  ReactNode,
  useContext
} from 'react';

export type OrderFormStateType = {
  reservationAnotherOpens: { index: number; open: boolean }[];
  removeOrderItemIds: number[];
};

const initialState: Readonly<OrderFormStateType> = {
  reservationAnotherOpens: [],
  removeOrderItemIds: []
};

type ADD_RESERVATION_ANOTHER = 'ADD_RESERVATION_ANOTHER';
type CLOSE_RESERVATION_ANOTHER = 'CLOSE_RESERVATION_ANOTHER';
type HANDLE_RESERVATION_ANOTHER = 'HANDLE_RESERVATION_ANOTHER';
type ADD_REMOVE_ORDER_ITEM_ID = 'ADD_REMOVE_ORDER_ITEM_ID';
type RESET = 'RESET';

const ActionType: {
  ADD_RESERVATION_ANOTHER: ADD_RESERVATION_ANOTHER;
  CLOSE_RESERVATION_ANOTHER: CLOSE_RESERVATION_ANOTHER;
  HANDLE_RESERVATION_ANOTHER: HANDLE_RESERVATION_ANOTHER;
  ADD_REMOVE_ORDER_ITEM_ID: ADD_REMOVE_ORDER_ITEM_ID;
  RESET: RESET;
} = {
  ADD_RESERVATION_ANOTHER: 'ADD_RESERVATION_ANOTHER',
  CLOSE_RESERVATION_ANOTHER: 'CLOSE_RESERVATION_ANOTHER',
  HANDLE_RESERVATION_ANOTHER: 'HANDLE_RESERVATION_ANOTHER',
  ADD_REMOVE_ORDER_ITEM_ID: 'ADD_REMOVE_ORDER_ITEM_ID',
  RESET: 'RESET'
};

export const addReservationAnother = () => ({
  type: ActionType.ADD_RESERVATION_ANOTHER
});

export const closeReservationAnother = (closeIndex: number) => ({
  type: ActionType.CLOSE_RESERVATION_ANOTHER,
  payload: {
    closeIndex
  }
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

export const reset = () => ({
  type: ActionType.RESET
});

type OrderFormActionType =
  | ReturnType<typeof addReservationAnother>
  | ReturnType<typeof closeReservationAnother>
  | ReturnType<typeof handleReservationAnother>
  | ReturnType<typeof addRemoveOrderItemId>
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
          open: false
        })
      };
    case ActionType.CLOSE_RESERVATION_ANOTHER:
      return {
        ...state,
        reservationAnotherOpens: state.reservationAnotherOpens.map((n) =>
          n.index === action.payload.closeIndex
            ? { index: n.index, open: false }
            : n
        )
      };
    case ActionType.HANDLE_RESERVATION_ANOTHER:
      return {
        ...state,
        reservationAnotherOpens: state.reservationAnotherOpens.map((n) =>
          n.index === action.payload.index
            ? { index: n.index, open: action.payload.open }
            : n
        )
      };
    case ActionType.ADD_REMOVE_ORDER_ITEM_ID:
      return {
        ...state,
        removeOrderItemIds: state.removeOrderItemIds.concat(action.payload.id)
      };
    case ActionType.RESET:
      return {
        reservationAnotherOpens: [],
        removeOrderItemIds: []
      };
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
