module.exports = class Func {
  static indexItem(arr, id) {
    const index = arr.findIndex((el) => el.id === Number(id));
    return index;
  };
}