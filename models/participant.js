const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema(
  {
    firstname: { type: String, required: true },
    lastname: { type: String, required: true },
    companyname: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    postcode: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Participant", ParticipantSchema);
