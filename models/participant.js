const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema(
  {
    firstname: { String, required: true },
    lastname: { String, required: true },
    companyname: { String, required: true },
    email: { String, required: true },
    address: { String, required: true },
    postcode: { String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Participant", ParticipantSchema);
