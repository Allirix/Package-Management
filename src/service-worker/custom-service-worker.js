self.addEventListener("push", (event) => {
  let body;
  if (event.data) {
    //You can set an original message by passing it on the event.
    body = event.data.text();
  } else {
    body = "Default body";
  }

  const options = {
    body: body,
    icon: "/your icon image",
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
    },
  };
  event.waitUntil(
    self.registration.showNotification("Your Message Title", options)
  );
});
