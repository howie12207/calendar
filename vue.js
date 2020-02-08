new Vue({
  el: "#app",
  data() {
    return {
      nowDate: {
        year: "",
        month: "",
        day: "",
        date: "",
        hour: "",
        minute: "",
        second: ""
      },
      calendar: { year: "", month: "", day: "", date: "" },
      todos: {},
      todo: "",
      time: "",
      editModalShow: false,
      isNew: false,
      index: "",
      delShow: false,
      tmp: {
        y: "",
        m: "",
        d: ""
      }
    };
  },
  mounted() {
    this.todos = JSON.parse(localStorage.getItem("todos")) || {};
    this.getDate();
    this.getNow();
  },
  computed: {
    // --- 取得顯示第一天 ---
    firstday() {
      // --- 找出當月第一天 ---
      const mDate = new Date(this.calendar.year, this.calendar.month, 1);
      // --- 找出顯示第一天 ---
      const date = new Date(
        this.calendar.year,
        this.calendar.month,
        1 - mDate.getDay()
      );
      return {
        year: date.getFullYear(),
        month: date.getMonth(),
        day: date.getDay(),
        date: date.getDate()
      };
    },
    date() {
      let tmp = [];
      for (i = 0; i < 42; i++) {
        date = new Date(
          this.firstday.year,
          this.firstday.month,
          this.firstday.date + i
        );
        let d = {
          year: date.getFullYear(),
          month: date.getMonth(),
          day: date.getDay(),
          date: date.getDate()
        };
        let todos = this.getTodos(d);
        d.todos = [];
        if (todos.length > 0) {
          for (let i = 0; i < todos.length; i++) {
            d.todos.push(todos[i].title);
          }
        }
        tmp.push(d);
      }
      return tmp;
    }
  },
  methods: {
    delTodo() {
      let r = window.confirm("確認是否刪除?");
      if (r === true) {
        this.todos[this.tmp.y][this.tmp.m][this.tmp.d].splice(this.index, 1);
        localStorage.setItem("todos", JSON.stringify(this.todos));
        this.editModalShow = false;
      }
    },
    closeEditModal() {
      this.editModalShow = false;
    },
    openChoose() {
      this.chooseShow = true;
    },
    openEditModal(item, status, index) {
      this.delShow = false;
      this.editModalShow = true;
      this.tmp.y = item.year;
      this.tmp.m = item.month + 1;
      this.tmp.d = item.date;
      let year = item.year;
      let month = item.month < 9 ? "0" + (item.month + 1) : item.month + 1;
      let date = item.date < 10 ? "0" + item.date : item.date;
      this.time = `${year}-${month}-${date}`;
      if (status == true) {
        this.todo = "";
        this.isNew = true;
      } else {
        this.todo = item.todos[index];
        this.isNew = false;
        this.index = index;
        this.delShow = true;
      }
      // console.log(item);
    },
    update() {
      let tmp = this.time.split("-");
      if (tmp[1].indexOf("0") == 0) {
        tmp[1] = tmp[1][1];
      }
      if (tmp[2].indexOf("0") == 0) {
        tmp[2] = tmp[2][1];
      }
      let y = this.todos[tmp[0]] || {};
      let m = y[tmp[1]] || {};
      let d = m[tmp[2]] || [];
      // console.log(tmp[0], tmp[1], tmp[2]);
      // console.log(y, m, d);

      if (this.todo.trim()) {
        if (this.isNew) {
          d.push({
            title: this.todo.trim()
          });
        } else {
          this.todos[this.tmp.y][this.tmp.m][this.tmp.d].splice(this.index, 1);
          d.push({
            title: this.todo.trim()
          });
        }
        this.$set(this.todos, tmp[0], y);
        this.$set(y, tmp[1], m);
        this.$set(m, tmp[2], d);
        localStorage.setItem("todos", JSON.stringify(this.todos));
        this.editModalShow = false;
      } else {
        window.alert("請輸入內容");
      }
    },
    getTodos(d) {
      if (
        this.todos[d.year] &&
        this.todos[d.year][d.month + 1] &&
        this.todos[d.year][d.month + 1][d.date]
      ) {
        return this.todos[d.year][d.month + 1][d.date];
      } else {
        return [];
      }
      // this.todos[d.year] &&
      // this.todos[d.year][d.month + 1] &&
      // this.todos[d.year][d.month + 1][d.date]
      //   ? this.todos[d.year][d.month + 1][d.date]
      //   : [];
    },
    getDate() {
      let date = new Date();
      this.calendar.year = date.getFullYear();
      this.calendar.month = date.getMonth();
      this.calendar.day = date.getDay();
      this.calendar.date = date.getDate();
    },
    getNow() {
      // --- 取得現在日期時間 ---
      let date = new Date();
      this.nowDate.year = date.getFullYear();
      this.nowDate.month = date.getMonth();
      this.nowDate.day = date.getDay();
      this.nowDate.date = date.getDate();
      this.nowDate.hour = date.getHours();
      this.nowDate.minute = date.getMinutes();
      this.nowDate.second = date.getSeconds();
      // --- 未滿二位數補足 ---
      if (this.nowDate.hour < 10) {
        this.nowDate.hour = "0" + this.nowDate.hour;
      }
      if (this.nowDate.minute < 10) {
        this.nowDate.minute = "0" + this.nowDate.minute;
      }
      if (this.nowDate.second < 10) {
        this.nowDate.second = "0" + this.nowDate.second;
      }
      // ---即時更新---
      setTimeout(() => {
        this.getNow();
      }, 1000);
    },
    getYear(num) {
      this.calendar.year += num;
    },
    getMonth(num) {
      if (event.wheelDeltaY === 120) {
        num = -1;
      } else if (event.wheelDeltaY === -120) {
        num = 1;
      }
      this.calendar.month += num;
      if (this.calendar.month < 0) {
        this.calendar.month = 11;
        this.calendar.year += -1;
      } else if (this.calendar.month > 11) {
        this.calendar.month = 0;
        this.calendar.year += 1;
      } else {
        this.calendar.month = this.calendar.month;
      }
    },
    log(evt) {
      console.log(1, evt);
    },
    log2(evt) {
      console.log(2, evt);
    }
  },
  directives: {
    focus: {
      inserted: function(el, { value }) {
        if (value) {
          el.focus();
        }
      }
    }
  }
});
