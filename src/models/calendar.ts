export interface OrderEvent {
  id: string;
  resourceId?: string;
  allDay: boolean;
  color?: string;
  description: string;
  end: Date;
  start: Date;
  title: string;
}

export interface Resource {
  id: string;
  title: string;
}

export type View = 'dayGridMonth' | 'timeGridWeek' | 'timeGridDay' | 'listWeek';
