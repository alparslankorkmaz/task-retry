(function () {
  "use strict";

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  var forms = document.querySelectorAll(".needs-validation");

  // Loop over them and prevent submission
  Array.prototype.slice.call(forms).forEach(function (form) {
    form.addEventListener(
      "submit",
      function (event) {
        if (!form.checkValidity()) {
          event.preventDefault();
          event.stopPropagation();
        }

        form.classList.add("was-validated");
      },
      false
    );
  });
})();

// calendar script

const config = {
  name: "Stack Overflow Happy Hour",
  startDate: "2023-03-30",
  startTime: "17:00",
  endTime: "19:00",
  location:
    "https://stackoverflow.zoom.us/i/87327075536?pwd=cDIzTmtYM09MNDc1c2VVYkdHUWtsUT09",
  options: ["Apple", "Google", "iCal", "Outlook.com", "Yahoo"],
  timeZone: "Europe/Paris",
};
const button = document.getElementById("my-default-button");
if (button) {
  button.addEventListener("click", () => atcb_action(config, button));
}
