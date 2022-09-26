import React from 'react';
import { observer } from 'mobx-react';
import Good from './Good';

const MobxText =  observer(function () {
  const good = Good;
  console.log(good);

  const onIncrement = () => {
    good.increment();
  }

  const onGetUserinfo = () => {
    good.getUserInfo();
  }

  return (
    <div>
      <div>数量：{good.count}</div>
      <div>双倍数量{good.double}</div>
      <button onClick={onIncrement}>新增数量</button>
      <button onClick={onGetUserinfo}>获取用户信息</button>
    </div>
  )
})

export default MobxText;
