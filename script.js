// This Google Sheets script will post to a slack channel when a user submits data to a Google Forms Spreadsheet
// View the README for installation instructions. Don't forget to add the required slack information below.

/////////////////////////
// Begin customization //
/////////////////////////

// Alter this to match the incoming webhook url provided by Slack
var slackIncomingWebhookUrl = 'https://hooks.slack.com/services/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';
var postIcon = ":mailbox_with_mail:";
var postUser = "Form Bot";
var postColor = "#0000DD";
var messagePretext = "OT form for VA";
var messageFallback = "The attachment must be viewed as plain text.";


///////////////////////
// End customization //
///////////////////////

// In the Script Editor, run initialize() at least once to make your code execute on form submit
function initialize() {
  // Fix for TypeError: Cannot call method "getItemResponses" of undefined. error.
  // If you encounter the above mentioned error in the email, then re-authorize script by running function, Run > Run Function > initialize
  // This will prompt the authorization of the code.
  // Leave this commented code here, it's used to trigger the re-authorization of the script.
  // FormApp.getActiveForm();
}

// Running the code in initialize() will cause this function to be triggered this on every Form Submit
function submitValuesToSlack(e) {
  var attachments = constructAttachments(e.response);

  var payload = {
    "username": postUser,
    "icon_emoji": postIcon,
    "attachments": attachments
  };

  var options = {
    'method': 'post',
    'payload': JSON.stringify(payload)
  };

  var response = UrlFetchApp.fetch(slackIncomingWebhookUrl, options);
}

// Creates Slack message attachments which contain the data from the Google Form
// submission, which is passed in as a parameter
// https://api.slack.com/docs/message-attachments
var constructAttachments = function(formResponse) {
  var fields = makeFields(formResponse);

  var attachments = [{
    "fallback" : messageFallback,
    "pretext" : messagePretext,
    "mrkdwn_in" : ["pretext"],
    "color" : postColor,
    "fields" : fields
  }]

  return attachments;
}

// Creates an array of Slack fields containing the questions and answers
var makeFields = function(formResponse) {
  var fields = [];

  var itemResponses = formResponse.getItemResponses();
  for (var j = 0; j < itemResponses.length; j++) {
    var itemResponse = itemResponses[j];
    var question = itemResponse.getItem().getTitle();
    var answer = itemResponse.getResponse();
    // Logger.log('Response to the question "%s" was "%s"', question, answer);
    fields.push(makeField(question, answer));
  }

  return fields;
}

// Creates a Slack field for your message
// https://api.slack.com/docs/message-attachments#fields
var makeField = function(question, answer) {
  var field = {
    "title" : question,
    "value" : answer,
    "short" : false
  };
  return field;
}
