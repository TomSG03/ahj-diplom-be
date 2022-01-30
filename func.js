module.exports = class Func {
  static indexItem(arr, id) {
    const index = arr.findIndex((el) => el.id === Number(id));
    return index;
  };

  static getTime() {
    const time = new Date().toLocaleString([], {
      hour: '2-digit', minute: '2-digit',
    }).replace(/,/, '');
    const date = new Date().toLocaleString([], {
      day: '2-digit', month: '2-digit', year: '2-digit',
    }).replace(/,/, '');
    return `${date}, ${time}`;
  }
}