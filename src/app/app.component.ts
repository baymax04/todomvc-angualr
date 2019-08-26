import { Component } from '@angular/core';

const todos = [
  {
    id: 1,
    title: '吃饭',
    done: true
  },
  {
    id: 2,
    title: '睡觉',
    done: false
  },
  {
    id: 3,
    title: '打豆豆',
    done: true
  }
];

// 根组件
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  // 列表数组，在html中进行遍历显示
  // 强类型转换
  public todos: {
    id: number,
    title: string,
    done: boolean
  }[] = JSON.parse(window.localStorage.getItem('todos') || '[]') ;
  // window.localStorage.getItem('todos')   取得的是字符串，，需要转为对象
  // 如果拿到数据，就转为相应的字符串；
  // }[] = todos; 固定数据


  public visibility = 'all';

  // 中间变量 当前双击编辑任务项
  public currentEditing: {
    id: number,
    title: string,
    done: boolean
  } = null;

  // ngOnInit函数是一个特殊的Angular 生命周期钩子函数
  // 它会在 Angular 应用初始化的时候执行一次
  // tslint:disable-next-line:use-life-cycle-interface
  ngOnInit() {
    this.hashchangeHandler();
    // 绑定组件类实例bind this,,,,否则 this 指向window,
    window.onhashchange = this.hashchangeHandler.bind(this);
  }

  // 当Angular组件数据发生改变的时候，该ngNoCheck 就会被触发
  // 我们要做的就是在这个钩子函数中去持久化存储我们的todos数据
  // tslint:disable-next-line:use-life-cycle-interface
  ngDoCheck() {
    // 把组件实例中的todos 转成字符串，持久化存储到todos数组中
    window.localStorage.setItem('todos', JSON.stringify(this.todos));
  }
  get filterTodos() {
    if (this.visibility === 'all') {
      return this.todos;
    } else if (this.visibility === 'active') {
      return this.todos.filter(t => !t.done);
    } else if (this.visibility === 'completed') {
      return this.todos.filter(t => t.done);
    }
  }

  // 实现导航切换数据过滤的功能
  // 1、提供一个属性，该属性会根据当前点击的链接返回过滤的数据
  //  filterTodos
  // 2、提供一个属性，用来存储当前点击的链接标识
  //  visibility是一个字符串  all,active,completed
  // 3、为链接添加点击事件，当点击导航链接的时候，改变

  addTodo(e): void {
    const titleTxt = e.target.value;  // 定义一个变量来接收输入框中的输入的值
    if (!titleTxt.length) {  // 如果输入框为空，则返回
      return;
    }
    const last = this.todos[this.todos.length - 1]; // 获取todos数组长度
    this.todos.push({ // 否则，把输入框中的值存入到todos数组中
      id: last ? last.id + 1 : 1,
      title: titleTxt,
      done: false
    });
    e.target.value = ''; // 清空输入框数据
  }

  // 如果所有任务都完成了，返回值就是true；否则 false。
  get toggleAll() {
    return this.todos.every(t => t.done);
  }

  // 循环所有任务项，根据input的值，是否被check，，来遍历列表选项是否done
  set toggleAll(val) {
    this.todos.forEach(t => t.done = val);
  }

  // 删除单个任务项
  removeTodo(index: number) {
    // console.log(index);
    // 根据索引从数组中删除
    this.todos.splice(index, 1);
  }

  // 保存编辑,并去除编辑样式
  saveEdit(todo, e) {
    // 保存编辑
    todo.title = e.target.value;
    // 去除编辑样式
    this.currentEditing = null;
  }

  // event 事件对象
  handleEditKeyUp(e) {
    const { keyCode, target } = e;
    if (keyCode === 27) {
      // 取消编辑，去掉编辑样式
      // 同时把文本框的值恢复为原来的值
      target.value = this.currentEditing.title;
      this.currentEditing = null;
    }
  }

  // 未完成的数量
  get remainingCount() {
    return this.todos.filter(t => !t.done).length;
  }

  //
  hashchangeHandler() {
    // 当用户点击了锚点的时候，我们需要获取当前的锚点链接(标识)
    // 然后动态的将根组件中的visibility 设置为当前点击的锚点标识
    const hash = window.location.hash.substr(1);
    switch (hash) {
      case '/':
        this.visibility = 'all';
        break;
      case '/active':
        this.visibility = 'active';
        break;
      case '/completed':
        this.visibility = 'completed';
        break;
    }
  }

  // 清除所有已完成任务项(留下所有未完成任务项)
  clearAllDone() {
    this.todos = this.todos.filter(t => !t.done);
  }
}
