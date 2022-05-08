import {
  FC,
  createContext,
  useReducer,
  Dispatch,
  ReactNode,
  useContext
} from 'react';
import _ from 'lodash';
import type { OrderEvent, Resource } from 'src/models/calendar';

export type OrderCalendarStateType = {
  events: OrderEvent[];
  resources: Resource[];
  isDrawerOpen: boolean;
  selectedEventId: string | null;
  selectedRange: {
    start: Date;
    end: Date;
  } | null;
};

const initialState: Readonly<OrderCalendarStateType> = {
  events: [],
  resources: [],
  isDrawerOpen: false,
  selectedEventId: null,
  selectedRange: null
};

type SET_ORDER_CALENDAR = 'SET_ORDER_CALENDAR';
type SET_ORDER_CALENDAR_TIME_LINE = 'SET_ORDER_CALENDAR_TIME_LINE';
type UPDATE_ORDER_CALENDAR = 'UPDATE_ORDER_CALENDAR';
type REMOVE_ORDER_CALENDAR = 'REMOVE_ORDER_CALENDAR';
type ADD_ORDER_CALENDAR = 'ADD_ORDER_CALENDAR';

const ActionType: {
  SET: SET_ORDER_CALENDAR;
  SET_TIME_LINE: SET_ORDER_CALENDAR_TIME_LINE;
  UPDATE: UPDATE_ORDER_CALENDAR;
  REMOVE: REMOVE_ORDER_CALENDAR;
  ADD: ADD_ORDER_CALENDAR;
} = {
  SET: 'SET_ORDER_CALENDAR',
  SET_TIME_LINE: 'SET_ORDER_CALENDAR_TIME_LINE',
  UPDATE: 'UPDATE_ORDER_CALENDAR',
  REMOVE: 'REMOVE_ORDER_CALENDAR',
  ADD: 'ADD_ORDER_CALENDAR'
};

export const setOrderCalendar = (events: OrderEvent[]) => ({
  type: ActionType.SET,
  payload: {
    events
  }
});

export const setOrderCalendarTimeLine = (
  events: OrderEvent[],
  resources: Resource[]
) => ({
  type: ActionType.SET_TIME_LINE,
  payload: {
    events,
    resources
  }
});

export const updateOrderCalendar = (
  selectedEventId: string,
  selectedRange: { start: Date; end: Date }
) => ({
  type: ActionType.UPDATE,
  payload: {
    selectedEventId,
    selectedRange
  }
});

export const removeOrderCalendar = (selectedEventId: string) => ({
  type: ActionType.REMOVE,
  payload: {
    selectedEventId
  }
});

export const addOrderCalendar = (event: OrderEvent) => ({
  type: ActionType.ADD,
  payload: {
    event
  }
});

type OrderCalendarActionType =
  | ReturnType<typeof setOrderCalendar>
  | ReturnType<typeof setOrderCalendarTimeLine>
  | ReturnType<typeof updateOrderCalendar>
  | ReturnType<typeof removeOrderCalendar>
  | ReturnType<typeof addOrderCalendar>;

const OrderCalendarReducer = (
  state: OrderCalendarStateType,
  action: OrderCalendarActionType
) => {
  switch (action.type) {
    case ActionType.SET:
      return {
        ...state,
        events: action.payload.events
      };
    case ActionType.SET_TIME_LINE:
      return {
        ...state,
        events: action.payload.events,
        resources: action.payload.resources
      };
    case ActionType.UPDATE:
      return {
        ...state,
        events: state.events.map((event) => {
          if (event.id == action.payload.selectedEventId) {
            return {
              ...event,
              start: action.payload.selectedRange.start,
              end: action.payload.selectedRange.end
            };
          } else return event;
        })
      };
    case ActionType.REMOVE:
      return {
        ...state,
        events: _.reject(state.events, { id: action.payload.selectedEventId })
      };
    case ActionType.ADD:
      return {
        ...state,
        events: [...state.events, action.payload.event]
      };
    default:
      throw new Error('Invalid action type');
  }
};

type OrderCalendarDispatchType = Dispatch<OrderCalendarActionType>;
const OrderCalendarStateContext = createContext(
  initialState as OrderCalendarStateType
);
const OrderCalendarDispatchContext = createContext<OrderCalendarDispatchType>(
  () => {
    throw new Error('Context not provided');
  }
);

type Props = {
  children: ReactNode;
};

export const OrderCalendarProvider: FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(OrderCalendarReducer, initialState);

  return (
    <OrderCalendarDispatchContext.Provider value={dispatch}>
      <OrderCalendarStateContext.Provider value={state}>
        {children}
      </OrderCalendarStateContext.Provider>
    </OrderCalendarDispatchContext.Provider>
  );
};

export const useOrderCalendarState = () =>
  useContext(OrderCalendarStateContext);
export const useOrderCalendarDispatch = () =>
  useContext(OrderCalendarDispatchContext);
