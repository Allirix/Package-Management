export const countHours = (arr) => {
  return arr
    ?.map((e) => new Date(e.deliveredAt).getHours())
    .reduce((acc, e) => {
      acc[e] = acc[e] ? acc[e] + 1 : 1;
      return acc;
    }, {});
};

export const timed = (f) => {
  let start = performance.now();
  let ret = f();
  console.log(`function ${f.name} took ${performance.now() - start}ms`);
  return ret;
};

export function getUrlParamsFromPlace(to, place) {
  const params = Object.keys(place)
    .filter((e) => place[e])
    .map((e) => `${e}=${JSON.stringify(place[e])}`);
  return to.toString() + "?" + params.join("&");
}
