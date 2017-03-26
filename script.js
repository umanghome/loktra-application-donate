var defaultValues = {
  totalAmount: 1000,
  donatedAmount: 50,
  totalDonors: 1,
  daysLeft: 5
};

var currentValues = $.extend(true, {}, defaultValues); // Deep copy

$(function () {
  refreshData(); // Set data initially

  // Listen for changes in data in other open tabs
  $(window).bind('storage', function (e) {

    // Get the new data
    currentValues = JSON.parse(e.originalEvent.newValue);

    // In case localStorage was cleared
    if (!currentValues) {
      currentValues = $.extend(true, {}, defaultValues);
    }

    // Update DOM with new data
    updateData(currentValues);
  });
});

// Function to get data from localStorage to populate UI. Uses default data in case it does not exist in loca)Storage.
function refreshData () {
  var data = localStorage.getItem('data');
  if (!data) {
    data = JSON.stringify(defaultValues);
  }
  currentValues = $.extend(true, {}, JSON.parse(data));
  updateData(currentValues);  
}

// Function to update the DOM with passed data
function updateData (data) {
  var remaining = data.totalAmount - data.donatedAmount;
  if (remaining <= 0) remaining = 0;
  $('#remainingamount').html(remaining);

  var sliderWidth = data.donatedAmount / data.totalAmount;
  if (sliderWidth > 1.0) sliderWidth = 1.0;
  sliderWidth = parseInt(sliderWidth * 100);

  $('#progressbar .progress').css({
    width: sliderWidth + '%'
  })

  var trianglePosition;
  if (sliderWidth > 85) {
    trianglePosition = 90;
  } else {
    trianglePosition = sliderWidth + 3;
  }
  $('#triangle').css({
    left: trianglePosition + '%'
  })

  $('#daysleft').html(data.daysLeft);

  $('#donorcount').html(data.totalDonors);

  if (data.totalDonors > 1) {
    $('#donorstring').html('donors who have');
  } else {
    $('#donorstring').html('donor who has');
  }
}

// Event listener for when an amount is donated.
$('#givenow').click(function (e) {
  if ($('#amount').val() == '') return;

  var amountDonated = parseInt($('#amount').val());
  currentValues.donatedAmount += amountDonated;

  currentValues.totalDonors++;

  localStorage.setItem('data', JSON.stringify(currentValues));

  refreshData();
});

// When localStorage is cleared, reset everything.
$('#clearlocalstorage').click(function (e) {
  localStorage.clear();
  currentValues = $.extend(true, {}, defaultValues);
  refreshData();
});

// Alert for when Save for Later is clicked.
$('#saveforlater').click(function (e) {
  $('#saved').css({
    opacity: 1
  });

  setTimeout(function () {
    $('#saved').css({
      opacity: 0
    });
  }, 2000);
});