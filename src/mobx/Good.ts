import { makeAutoObservable, autorun } from 'mobx';

class Good {
  name = "";
  count = 0;

  constructor(name: string) {
    makeAutoObservable(this, {}, {autoBind: true});
    this.name = name;
    autorun(() => {
      console.log('双倍商品数量:', this.double);
    })
  }

  get double() {
    return this.count * 2;
  }

  increment() {
    this.count++;
  }

  *getUserInfo() {
    const resp: Response = yield fetch('http://47.108.167.244:10010/user/query?id=123');
    console.log('返回值', resp);
  }

}

const good = new Good("名称");

export default good;
