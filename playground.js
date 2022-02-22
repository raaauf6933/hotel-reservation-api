const rooms = [
  {
    room_id: "61f28434d80888cefe9b4857",
    roomtype_id: "61f246467e11080afb1c802b",
    room_amount: 10,
    roomtype_name: "Queen Suite Room",
    room_num: "Queen Room A12",
  },
  {
    room_id: "61f287c1d80888cefe9b4895",
    roomtype_id: "61f246467e11080afb1c802b",
    room_amount: 10,
    roomtype_name: "Queen Suite Room",
    room_num: "Queen Room A13",
  },
  {
    room_id: "61f2c89b5e3ee143f00e1b61",
    roomtype_id: "61f246737e11080afb1c802e",
    room_amount: 300,
    roomtype_name: "Deluxe Room",
    room_num: "Deluxe A12 ",
  },
];

const getNoQuantity = (roomtype_id) => {
  return rooms.filter((obj) => obj.roomtype_id === roomtype_id).length;
};

const getRoomAmount = (roomtype_id, rate) => {
  const roomTotalAmount = parseInt(getNoQuantity(roomtype_id)) * rate;
  return roomTotalAmount;
};

const itembody = rooms.filter(
  (v, i, a) => a.findIndex((t) => t.roomtype_id === v.roomtype_id) === i
);

const countRooms = itembody.map((e) => {
  return {
    room_name: e.roomtype_name,
    rate: e.room_amount,
    qty: getNoQuantity(e.roomtype_id),
    amount: getRoomAmount(e.roomtype_id, e.room_amount),
  };
});

console.log(countRooms);
