export const onlyUnique = (value, index, self) => self.indexOf(value) === index;

export function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(console.log);
  } else {
    console.error("Geolocation is not supported by this browser.");
  }
}
// address=24%20Sussex%20Drive%20Ottawa%20ON
export async function getLatLong({ number, name, type, suburb }) {
  console.warn("Request made to Google Maps API for ", {
    number,
    name,
    type,
    suburb,
  });
  const addressString = `${number} ${name} ${type} ${suburb} Queensland Australia`;
  const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${addressString}&key=AIzaSyDYWeSF4f4A-3gVJtrZdaRy7vfBF3Xq6TY`;
  let data = "ERROR";

  try {
    data = await (await fetch(url)).json();
    return data.results[0].geometry.location;
  } catch (e) {
    console.error(e);
    return data;
  }
}

export function getDistance(location1, location2) {
  const { lat: lat1, lng: lon1 } = location1;
  const { lat: lat2, lng: lon2 } = location2;

  var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(lat2 - lat1); // deg2rad below
  var dLon = deg2rad(lon2 - lon1);
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c; // Distance in km
  return (1000 * Math.round(d * 1000)) / 1000;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const a = "abcdefghijklmnopqrstuvwxyz".split("");

export function groupByAlphabet(s, n = 10) {
  const l = a.map((e) => {
    let count = 0;
    s.forEach((st) => {
      if (st.name[0].toUpperCase() === e.toUpperCase()) count++;
    });
    return { letter: e.toUpperCase(), count };
  });
  let str = new Array(n).fill(""),
    count = 0,
    i = 0;
  const max = Math.floor(s.length / n);
  l.forEach((e) => {
    const add = () => {
      str[i] += e.letter.toUpperCase();
      count += e.count;
    };
    if (count < max) add();
    else {
      i++;
      count = 0;
      add();
    }
  });

  return str.filter((e) => e);
}

export const cancelBubbleUp = (fn) => (e) => {
  e.stopPropagation();
  return fn();
};

export const hammingDistance = (s1 = "", s2 = "") => {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();
  const [l1, l2] = [s1.length, s2.length];
  if (l1 !== l2) return Infinity;
  let d = 0;
  for (let i = 0; i < l1; i += 1) if (s1[i] !== s2[i]) d++;

  return d;
};
