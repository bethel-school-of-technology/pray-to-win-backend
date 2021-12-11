exports.sendResponse = function (success, message, data) {
  let returnData = {
    success: success,
    message: message,
    data: data,
  };
  return returnData;
};
