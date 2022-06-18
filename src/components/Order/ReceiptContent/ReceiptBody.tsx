import { VFC, useState, createRef, useCallback } from 'react';
import { Stage, Layer, Image, Group } from 'react-konva';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import useImage from 'use-image';
import { KonvaEventObject } from 'konva/lib/Node';
import TextUsage from 'src/components/KonvaText/TextUsage';
import { Vector2d } from 'konva/lib/types';
import {
  INIITAL_TEXT_WIDTH,
  INITIAL_TEXT_HEIGHT,
  INITIAL_IMAGE_WIDTH,
  INITIAL_IMAGE_HEIGHT
} from 'src/constant/index';
import { textHtmlProps } from './types';

interface ReceiptContentProps {
  texts: textHtmlProps[];
  handleSetTexts: (text: textHtmlProps) => void;
  handleCHangeWidth: (id: number, width: number, height: number) => void;
  handleChangePosition: (id: number, x: number, y: number) => void;
}

const BaseImage = () => {
  const [image] = useImage('/static/images/recipt_base.JPG');
  return <Image image={image} height={350} width={850} />;
};

const ReceiptContent: VFC<ReceiptContentProps> = ({
  texts,
  handleSetTexts,
  handleCHangeWidth,
  handleChangePosition
}) => {
  const [selectedId, setSelectedId] = useState<number>(0);
  const [editingId, setEditingId] = useState<number>(0);

  const handleSelectedId = useCallback((id: number) => setSelectedId(id), []);

  const clickText = (position: Vector2d) => {
    return texts.find(
      (text) =>
        text.x <= position.x &&
        position.x <= text.x + text.width &&
        text.y <= position.y &&
        position.y <= text.y + text.height
    );
  };

  const onDblClick = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const position = stage.getPointerPosition();

    const currentText = clickText(position);

    if (currentText !== undefined) {
      setEditingId(currentText.id);
    } else {
      addText(position);
    }
  };

  const addText = (position: Vector2d) => {
    const id = texts.length + 1;
    setEditingId(id);
    setSelectedId(id);
    handleSetTexts({
      x: position.x - INIITAL_TEXT_WIDTH / 2,
      y: position.y - INITIAL_TEXT_HEIGHT / 2,
      id,
      width: INIITAL_TEXT_WIDTH,
      height: INITIAL_TEXT_HEIGHT,
      htmlRef: createRef()
    });
  };

  const selectText = (e: KonvaEventObject<MouseEvent>) => {
    const stage = e.target.getStage();
    const position = stage.getPointerPosition();
    const currentText = clickText(position);

    if (currentText === undefined) {
      setSelectedId(null);
      setEditingId(null);
    } else {
      setSelectedId(currentText.id);
    }
  };

  const changeWidth = useCallback(
    (width: number, height: number) => {
      handleCHangeWidth(selectedId, width, height);
    },
    [selectedId]
  );
  const changePosition = useCallback(
    (x: number, y: number) => {
      handleChangePosition(selectedId, x, y);
    },
    [selectedId]
  );

  return (
    <Stage
      width={INITIAL_IMAGE_WIDTH}
      height={INITIAL_IMAGE_HEIGHT}
      style={{ backgroundColor: 'white' }}
      onDblClick={(e) => onDblClick(e)}
      onClick={(e) => selectText(e)}
    >
      <Layer>
        <Group>
          <BaseImage />
          {texts &&
            texts.map((text) => {
              return (
                <TextUsage
                  key={text.id}
                  textProps={text}
                  selected={text.id === selectedId}
                  handleSelectedId={handleSelectedId}
                  isEditing={text.id === editingId}
                  changeWidth={changeWidth}
                  changePosition={changePosition}
                />
              );
            })}
        </Group>
      </Layer>
    </Stage>
  );
};

export default ReceiptContent;
