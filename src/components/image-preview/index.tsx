import React, { useEffect, useRef, useState } from "react";
import {
  PlusCircleOutlined,
  MinusCircleOutlined,
  LeftCircleOutlined,
  RightCircleOutlined,
  RedoOutlined,
} from "@ant-design/icons";
// import getFixScaleEleTransPosition from "./utils";
import "./index.less";

interface Position {
  x: number;
  y: number;
}

interface OriginPosition {
  deltaX: number;
  deltaY: number;
  originX: number;
  originY: number;
}

const ImagePreview = () => {
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
  const [isMoving, setMoving] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  const originPositionRef = useRef<OriginPosition>({
    originX: 0,
    originY: 0,
    deltaX: 0,
    deltaY: 0,
  });

  useEffect(() => {
    window.addEventListener("mouseup", onMouseUp, false);
    window.addEventListener("mousemove", onMouseMove, false);
    return () => {
      window.removeEventListener("mouseup", onMouseUp, false);
      window.removeEventListener("mousemove", onMouseMove, false);
    };
  }, [isMoving]);

  // 鼠标弹起触发
  const onMouseUp = () => {
    if (isMoving) {
      // const width = imgRef.current.offsetWidth * scale;
      // const height = imgRef.current.offsetHeight * scale;
      // // eslint-disable-next-line @typescript-eslint/no-shadow
      // const { left, top } = imgRef.current.getBoundingClientRect();
      // const isRotate = rotate % 180 !== 0;

      setMoving(false);

      // const fixState = getFixScaleEleTransPosition(
      //   isRotate ? height : width,
      //   isRotate ? width : height,
      //   left,
      //   top
      // );

      // if (fixState) {
      //   setPosition({ ...fixState } as Position);
      // }
    }
  };

  // 鼠标按下触发
  const onMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    originPositionRef.current.deltaX = event.pageX - position.x;
    originPositionRef.current.deltaY = event.pageY - position.y;
    originPositionRef.current.originX = position.x;
    originPositionRef.current.originY = position.y;
    setMoving(true);
  };

  // 鼠标移动触发
  const onMouseMove = (event: MouseEvent) => {
    if (isMoving) {
      const { deltaX, deltaY } = originPositionRef.current;
      setPosition({
        x: event.pageX - deltaX,
        y: event.pageY - deltaY,
      });
    }
  };

  // 顶部图片滚动
  const handleScrollHeader = (e: React.WheelEvent) => {
    if (e.deltaY > 0) {
      changeTranslate("small", 0.5);
    } else {
      changeTranslate("big", 0.5);
    }
  };

  // 设置放大
  const changeTranslate = (action: "big" | "small", num: number) => {
    if (action === "small" && scale === 0.5) {
      return;
    }
    setScale(action === "big" ? scale + num : scale - num);
  };

  // 设置旋转
  const changeRotate = (action: "left" | "right", num: number) => {
    setRotate(action === "left" ? rotate - num : rotate + num);
  };

  // 复原图片显示
  const handleRestore = () => {
    setScale(1);
    setRotate(0);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div className="image-preview">
      <div className="image-preview-wrap">
        <ul className="image-preview-wrap-operations">
          <li>
            <PlusCircleOutlined onClick={() => changeTranslate("big", 0.5)} />
          </li>
          <li>
            <MinusCircleOutlined
              onClick={() => changeTranslate("small", 0.5)}
            />
          </li>
          <li>
            <LeftCircleOutlined onClick={() => changeRotate("left", 90)} />
          </li>
          <li>
            <RightCircleOutlined onClick={() => changeRotate("right", 90)} />
          </li>
          <li>
            <RedoOutlined onClick={handleRestore} />
          </li>
        </ul>
        <div className="image-preview-wrap-header">
          <div
            className="image-preview-wrap-header-img"
            style={{
              transform: `translate3d(${position.x}px, ${position.y}px, 0px)`,
            }}
          >
            <img
              src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
              ref={imgRef}
              onMouseDown={(e) => onMouseDown(e)}
              onWheel={(e) => handleScrollHeader(e)}
              style={{
                transform: `
                  scale3d(${scale}, ${scale}, 1)
                  rotate(${rotate}deg)
                `,
              }}
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePreview;
