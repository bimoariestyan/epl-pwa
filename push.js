var webPush = require('web-push');

const vapidKeys = {
  "publicKey": "BFXZmz30TOaYJEu3P8A_js-3skpCcbTT-1b6_ZyZnpJkgGX-rKCsbZhWxHYetm4fUuB9opytYdVR-gYbOHsTQkU",
  "privateKey": "GpfzmrFwZOfW21YDtQdvUVJJSp9FR7ZDF8wKMt2DUY0"
};

webPush.setVapidDetails(
  'mailto:example@yourdomain.org',
  vapidKeys.publicKey,
  vapidKeys.privateKey
)

var pushSubscription = {
  "endpoint": "https://fcm.googleapis.com/fcm/send/eU_v5szBEZI:APA91bG19n4PTRIEuaDxifi4UIt_1elC7J2sYc3HtGkp67GAckHj6c1LPOPzJRn5ra-JN_q_APxMp_Xy7rcgR4TWrN4jK-kq5zrSNOJYPvnFPhQLyBI_gKgfqLdy2sgOvy9ghaa2iM3h",
  "keys": {
    "p256dh": "BItwm4ooW2LIjcc/roZ43rhlL4ocoK+6ivYxpWZNdqkWGDZNWvjG5+9BUP+B9Ec2epOhWQZzEy0rB8456tN+ufE=",
    "auth": "LaqjaO8D0mRNd74APerATw=="
  }
};

var payload = 'Halloo... Ini push notification dari Premier League';

var options = {
  gcmAPIKey: '790105131640',
  TTL: 60
};

webPush.sendNotification(
  pushSubscription,
  payload,
  options
)