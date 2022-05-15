import {
  VFC,
  createContext,
  useReducer,
  Dispatch,
  ReactNode,
  useContext
} from 'react';
import type { OrderEvent } from 'src/models/calendar';

export type CalendarStateType = {
  isEasyOrderCreationOpen: boolean;
  isDrawerOpen: boolean;
  selectDate: string;
  selectTime?: string;
  events: OrderEvent[];
};

const initialState: Readonly<CalendarStateType> = {
  isEasyOrderCreationOpen: false,
  isDrawerOpen: false,
  selectDate: '',
  selectTime: '',
  events: []
};

type OPEN_EASY_ORDER_CREATION = 'OPEN_EASY_ORDER_CREATION';
type CLOSE_EASY_ORDER_CREATION = 'CLOSE_EASY_ORDER_CREATION';
type SET_SELECT_DATE = 'SET_SELECT_DATE';
type SET_SELECT_TIME = 'SET_SELECT_TIME';
type OPEN_DRAWER = 'OPEN_DRAWER';
type CLOSE_DRAWER = 'CLOSE_DRAWER';
type SET_EVENTS = 'SET_EVENTS';
type ADD_ORDER_EVENT = 'ADD_ORDER_EVENT';
type REMOVE_ORDER_EVENT = 'REMOVE_ORDER_EVENT';
type UPDATE_ORDER_EVENT = 'UPDATE_ORDER_EVENT';

const ActionType: {
  OPEN_EASY_ORDER_CREATION: OPEN_EASY_ORDER_CREATION;
  CLOSE_EASY_ORDER_CREATION: CLOSE_EASY_ORDER_CREATION;
  SET_SELECT_DATE: SET_SELECT_DATE;
  SET_SELECT_TIME: SET_SELECT_TIME;
  OPEN_DRAWER: OPEN_DRAWER;
  CLOSE_DRAWER: CLOSE_DRAWER;
  SET_EVENTS: SET_EVENTS;
  ADD_ORDER_EVENT: ADD_ORDER_EVENT;
  REMOVE_ORDER_EVENT: REMOVE_ORDER_EVENT;
  UPDATE_ORDER_EVENT: UPDATE_ORDER_EVENT;
} = {
  OPEN_EASY_ORDER_CREATION: 'OPEN_EASY_ORDER_CREATION',
  CLOSE_EASY_ORDER_CREATION: 'CLOSE_EASY_ORDER_CREATION',
  SET_SELECT_DATE: 'SET_SELECT_DATE',
  SET_SELECT_TIME: 'SET_SELECT_TIME',
  OPEN_DRAWER: 'OPEN_DRAWER',
  CLOSE_DRAWER: 'CLOSE_DRAWER',
  SET_EVENTS: 'SET_EVENTS',
  ADD_ORDER_EVENT: 'ADD_ORDER_EVENT',
  REMOVE_ORDER_EVENT: 'REMOVE_ORDER_EVENT',
  UPDATE_ORDER_EVENT: 'UPDATE_ORDER_EVENT'
};

export const openEasyOrderCreation = () => ({
  type: ActionType.OPEN_EASY_ORDER_CREATION
});

export const closeEasyOrderCreation = () => ({
  type: ActionType.CLOSE_EASY_ORDER_CREATION
});

export const setSelectDate = (selectDate: string) => ({
  type: ActionType.SET_SELECT_DATE,
  payload: {
    selectDate
  }
});

export const setSelectTime = (selectTime: string) => ({
  type: ActionType.SET_SELECT_TIME,
  payload: {
    selectTime
  }
});

export const openDrawer = () => ({
  type: ActionType.OPEN_DRAWER
});

export const closeDrawer = () => ({
  type: ActionType.CLOSE_DRAWER
});

export const setEvents = (events: OrderEvent[]) => ({
  type: ActionType.SET_EVENTS,
  payload: {
    events
  }
});

export const addOrderEvent = (event: OrderEvent) => ({
  type: ActionType.ADD_ORDER_EVENT,
  payload: {
    event
  }
});

export const removeOrderEvent = (eventId: string) => ({
  type: ActionType.REMOVE_ORDER_EVENT,
  payload: {
    eventId
  }
});

export const updateOrderEvent = (
  id: string,
  date: { start: Date; end: Date }
) => ({
  type: ActionType.UPDATE_ORDER_EVENT,
  payload: {
    id,
    date
  }
});

type CalendarActionType =
  | ReturnType<typeof openEasyOrderCreation>
  | ReturnType<typeof closeEasyOrderCreation>
  | ReturnType<typeof setSelectDate>
  | ReturnType<typeof setSelectTime>
  | ReturnType<typeof openDrawer>
  | ReturnType<typeof closeDrawer>
  | ReturnType<typeof setEvents>
  | ReturnType<typeof addOrderEvent>
  | ReturnType<typeof removeOrderEvent>
  | ReturnType<typeof updateOrderEvent>;

const CalendarReducer = (
  state: CalendarStateType,
  action: CalendarActionType
) => {
  switch (action.type) {
    case ActionType.OPEN_EASY_ORDER_CREATION:
      return {
        ...state,
        isEasyOrderCreationOpen: true
      };
    case ActionType.CLOSE_EASY_ORDER_CREATION:
      return {
        ...state,
        isEasyOrderCreationOpen: false
      };
    case ActionType.SET_SELECT_DATE:
      return {
        ...state,
        selectDate: action.payload.selectDate
      };
    case ActionType.SET_SELECT_TIME:
      return {
        ...state,
        selectTime: action.payload.selectTime
      };
    case ActionType.OPEN_DRAWER:
      return {
        ...state,
        isDrawerOpen: true
      };
    case ActionType.CLOSE_DRAWER:
      return {
        ...state,
        isDrawerOpen: false
      };
    case ActionType.SET_EVENTS:
      return {
        ...state,
        events: action.payload.events
      };
    case ActionType.ADD_ORDER_EVENT:
      return {
        ...state,
        events: [...state.events, action.payload.event]
      };
    case ActionType.REMOVE_ORDER_EVENT:
      return {
        ...state,
        events: state.events.filter((e) => e.id !== action.payload.eventId)
      };
    case ActionType.UPDATE_ORDER_EVENT:
      return {
        ...state,
        events: state.events.map((e) => {
          if (e.id == action.payload.id) {
            return {
              ...e,
              start: action.payload.date.start,
              end: action.payload.date.end
            };
          } else return e;
        })
      };
    default:
      throw new Error('Invalid action type');
  }
};

type CalendarDispatchType = Dispatch<CalendarActionType>;
const CalendarStateContext = createContext(initialState as CalendarStateType);
const CalendarDispatchContext = createContext<CalendarDispatchType>(() => {
  throw new Error('Context not provided');
});

type Props = {
  children: ReactNode;
};

export const CalendarProvider: VFC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(CalendarReducer, initialState);

  return (
    <CalendarDispatchContext.Provider value={dispatch}>
      <CalendarStateContext.Provider value={state}>
        {children}
      </CalendarStateContext.Provider>
    </CalendarDispatchContext.Provider>
  );
};

export const useCalendarState = () => useContext(CalendarStateContext);
export const useCalendarDispatch = () => useContext(CalendarDispatchContext);
