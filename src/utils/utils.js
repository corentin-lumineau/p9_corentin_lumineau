import DashboardFormUI from "../views/DashboardFormUI.js";

export const descendingSortedHash = (hash) => {
  hash.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  return hash;
};

export const validationFileFormat = (fileName) => {
  if (fileName != null) {
    const format = fileName.split(".")[1];
  
    if (format !== "jpg" && format !== "jpeg" && format !== "png") {
      return false;
    }
    return true;
  }

};

export function showError(data) {
  if (data) {
    data.closest(".col-half").dataset.errorVisible = "true";
  }
}

export function hideError(data) {
  if (data) {
    data.closest(".col-half").dataset.errorVisible = "false";
  }
}

export function displayDashboardUI(bill, bills, counter) {
  bills.forEach((b) => {
    $(`#open-bill${b.id}`).css({ background: "#0D5AE5" });
  });
  $(`#open-bill${bill.id}`).css({ background: "#2A2B35" });
  $(".dashboard-right-container div").html(DashboardFormUI(bill));
  $(".vertical-navbar").css({ height: "150vh" });
  counter++;
}