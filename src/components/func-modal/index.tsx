/**
 * 函数式弹窗：给弹窗组件外层在嵌套一个方法来处理
 * 优势：对于调用方，集成后的 funcModal 它不是一个组件，不需要写在 render 里；不需要控制 visible，获取值也不需要通过 onCancel 等回调；而是通过函数式呼起弹层，await 的形式获取值。
 */

import React from 'react';
import ReactDOM from 'react-dom/client';

const FuncModel = <Result = any, Props = any>({
  Component,
  props,
}: {
  Component:
    | React.FC<Props>
    | React.ComponentClass<Props>
    | ((p: Props) => JSX.Element);
  props?: object;
}) => {
  const cacheContainer = document.createElement('div');
  let element = ReactDOM.createRoot(cacheContainer);

  return new Promise<Result>((resolve) => {
    const unmountFuncModal = (val: Result) => {
      element.unmount();
      resolve(val);
    };

    element.render(
      React.createElement<any>(Component, {
        ...props,
        onClose: unmountFuncModal,
      })
    );

    // element.render(
    //   React.cloneElement(<Component />, {
    //     ...props,
    //     onClose: unmountFuncModal,
    //   })
    // );
  });
};

export default FuncModel;
