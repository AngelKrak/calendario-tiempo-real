const Events = require('../../models/Events');

export default async function handler(req, res) {
  const events = await Events.findAll({ raw: true, nest: true });
  res.status(200).json(events);
}
