const route = require("express").Router();
const Conversation = require("../models/Conversation");
route.route("/:ids").get(async (req, res) => {
  try {
    const users = req.params.ids.split(",");
    let conversation = await Conversation.find({
      members: { $all: users },
    });
    if (!conversation.length) {
      conversation = await Conversation.create({ members: users });
    }
    res.status(200).json({ conversation });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = route;
