const route = require("express").Router();
const Messages = require("../models/Messages");
const Conversation = require("../models/Conversation");

route.route("/:conversationId").get(async (req, res) => {
  try {
    const conversationId = req.params.conversationId;
    let messages = await Messages.find({
      conversationId,
    });
    if (!messages.length) {
      messages = await Messages.create(
        {
          conversationId,
        },
        { validateBeforeSave: false }
      );
    }
    res.status(200).json({ messages });
  } catch (err) {
    res.status(500).json(err);
  }
});
route.route("/").post(async (req, res) => {
  try {
    const addMessage = await Messages.findOneAndUpdate(
      { conversationId: req.body.conversationId },
      { $push: { message: req.body.message } }
    );
    res.status(200).json({ messages: addMessage });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = route;
