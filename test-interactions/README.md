# Script for Testing the Dialogflow Functionality

The script is executing all tests defined in the JSON files stored in the directory `test-cases`.
The test cases in the files are executed in the defined order.
For each test file, a new Dialogflow session is created.

## How to define tests?

A test case file is a JSON file.
It consists of a JSON array that will contain JSON objects.
Each object needs an `input` field.
The `input` field hold the text that will be sent to the Dialogflow API.
It might be defined as a string or as an array of strings.
If it is defined as string, then each value is considered as an independent input.
Additionally, several optional fields can be stored defining test requirements the script will validate:

* `description`: some additional explanation regarding the test case
* `intent`: the name of the intent that is expected for the current input
* `response_text`: if true, then the response needs to contain a text message
* `response_text_regex`: a regular expression that will be matched on `response_text`, it might be a string or an array of strings (in the latter case each RegEx will be matched on the `response_text`)
* `response_rich`: if true, then the response needs to contain at least one rich message
* `number_of_parameters`: the number of parameters that should be recognized by Dialogflow while processing the input

Remark: You might create as many JSON files as you like in the directory `test-cases`.

### Best Practice

Each test file might tell a "story" (like `profile-story.json`), i.e., the test cases could establish a state within the current session.

## Execution

### Preparation

* install the [Google Cloud SDK](https://cloud.google.com/sdk/docs/install)
* login via `gcloud init`to the DBpedia Chatbot project
* generate a private key file using the dedicated service account:

```bash
gcloud iam service-accounts keys create service-account-tests.json \
    --iam-account=service-account-tests@dbpediachatbotng-rqyp.iam.gserviceaccount.com
```

Remark: The file `service-account-tests.json` needs to be stored in the current directory (next to the file `run_tests.py`.

### Run the Test Script

execute `python3 run_tests.py`
