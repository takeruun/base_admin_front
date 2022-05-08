import {
  FC,
  createContext,
  useReducer,
  Dispatch,
  ReactNode,
  useContext
} from 'react';
import { FileDataType } from 'src/models/fileData';

export type ImageStateType = {
  imageList: FileDataType[];
  totalCount: number;
};

const initialState: Readonly<ImageStateType> = {
  imageList: [],
  totalCount: 0
};

type SET_IMAGE = 'SET_IMAGE';
type UPDATE_IMAGE = 'UPDATE_IMAGE';

const ActionType: {
  SET: SET_IMAGE;
  UPDATE: UPDATE_IMAGE;
} = {
  SET: 'SET_IMAGE',
  UPDATE: 'UPDATE_IMAGE'
};

export const setImageList = (
  imageList: FileDataType[],
  totalCount: number
) => ({
  type: ActionType.SET,
  payload: {
    imageList,
    totalCount
  }
});

export const updateImage = (image: FileDataType) => ({
  type: ActionType.UPDATE,
  payload: {
    image
  }
});

type ImageActionType =
  | ReturnType<typeof setImageList>
  | ReturnType<typeof updateImage>;

const ImageReducer = (state: ImageStateType, action: ImageActionType) => {
  switch (action.type) {
    case ActionType.SET:
      return {
        ...state,
        imageList: action.payload.imageList,
        totalCount: action.payload.totalCount
      };
    case ActionType.UPDATE:
      return {
        ...state,
        imageList: state.imageList.map((image) => {
          if (image.id == action.payload.image.id) return action.payload.image;
          else return image;
        })
      };
    default:
      throw new Error('Invalid action type');
  }
};

type ImageDispatchType = Dispatch<ImageActionType>;
const ImageStateContext = createContext(initialState as ImageStateType);
const ImageDispatchContext = createContext<ImageDispatchType>(() => {
  throw new Error('Context not provided');
});

type Props = {
  children: ReactNode;
};

export const ImageProvider: FC<Props> = ({ children }: Props) => {
  const [state, dispatch] = useReducer(ImageReducer, initialState);

  return (
    <ImageDispatchContext.Provider value={dispatch}>
      <ImageStateContext.Provider value={state}>
        {children}
      </ImageStateContext.Provider>
    </ImageDispatchContext.Provider>
  );
};

export const useImageState = () => useContext(ImageStateContext);
export const useImageDispatch = () => useContext(ImageDispatchContext);
