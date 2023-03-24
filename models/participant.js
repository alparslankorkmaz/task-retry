const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ParticipantSchema = new Schema({
  firstname: String,
  lastname: String,
  companyname: String,
  email: String,
  address: String,
  postcode: String,
});

module.exports = mongoose.model("Participant", ParticipantSchema);
