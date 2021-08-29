# Preparation: gcloud init
project_id = "dbpediachatbotng-rqyp"
language_code = "en-US"
test_directory = "test-cases"

from google.cloud import dialogflow
import random 
import os
import json
import time
from pathlib import Path
import re
from pprint import pprint
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = './service-account-tests.json'


class Statstics:
    def __init__(self, number_of_tests, number_of_errors) -> None:
        self.__number_of_tests = number_of_tests
        self.__number_of_errors = number_of_errors
    
    def get_number_of_tests(self) -> int:
        return self.__number_of_tests

    def get_number_of_errors(self) -> int:
        return self.__number_of_errors



def run_test(session_client, session_id, text, language_code):
    """ 
        execute one test
    """
    text_input = dialogflow.TextInput(text=text, language_code=language_code)
    query_input = dialogflow.QueryInput(text=text_input)
    session = session_client.session_path(project_id, session_id)
    response = session_client.detect_intent(
        request={"session": session, "query_input": query_input}
    )
    return response

def run_tests(test_cases_file, language_code) -> Statstics:
    """ 
        execute all tests in the provided file, returns a statistics object
    """

    random.seed(time.time())
    session_id = random.random()
    session_client = dialogflow.SessionsClient()
    test_cases = json.load(open(test_cases_file, "r"))
    count_errors = 0
    count_tests = 0

    for number, test_case in enumerate(test_cases):
        texts = test_case.get("input", None)
        expected_intent = test_case.get("intent", None)
        expected_response_text_available = interpret_as_bool(test_case.get("response_text", None))
        expected_response_rich_available = interpret_as_bool(test_case.get("response_rich", None))
        description = test_case.get("description", None)
        response_text_regexs = test_case.get("response_text_regex", None)
        expected_number_of_parameters = test_case.get("number_of_parameters", None)

        if texts == None:
            raise Exception(f"In file '{test_cases_file}' no input was found for the {number}. test case.")
        
        # check if the input is defined as array or plain text, make array
        if not isinstance(texts, list):
            texts = [texts]
        
        # check if the RegEx is defined as array or plain text, make array
        if not isinstance(response_text_regexs, list):
            if response_text_regexs != None:
                response_text_regexs = [response_text_regexs]
            else:
                response_text_regexs = []

        for text in texts:
            count_tests += 1
            print(f"\n{test_cases_file} -- {number}. testcase: {text}")
            response = run_test(session_client=session_client, session_id=session_id, text=text, language_code=language_code)
            
            computed_intent = get_computed_intent(response)
            computed_response_text_available = get_computed_response_text_available(response)
            computed_response_rich_available = get_computed_response_rich_available(response)
            computed_response_text_value = get_computed_response_text_value(response)
            computed_response_parameter_number = get_computed_response_parameter_number(response)

            error_messages = []

            # check received intent
            if expected_intent != None and not (expected_intent == computed_intent):
                error_messages.append(f"intent not correctly recognized: expected='{expected_intent}' received='{computed_intent}'")

            #  check if at least one text message was received 
            if expected_response_text_available != None and not (computed_response_text_available == expected_response_text_available):
                if expected_response_text_available:
                    error_messages.append(f"fulfillment_messages->text expected to be available, however the result does NOT contain a text.")
                else:
                    error_messages.append(f"fulfillment_messages->text expected to be NOT available, however the result does contain a text.")
            
            #  check if the defined RegExs march the received text message 
            count_response_text_regexs = len(response_text_regexs)
            if count_response_text_regexs > 0 and not computed_response_text_value: # RegEx defined, but no value was received --> error
                error_messages.append(f"There are {count_response_text_regexs} RegEx defined, but no text was available in the received message.")
            elif count_response_text_regexs > 0:
                for response_text_regex in response_text_regexs:
                    match = re.search(response_text_regex, computed_response_text_value)
                    if not match:
                        error_messages.append(f"The RegEx \'{response_text_regex}\' could not be match on the text \'{computed_response_text_value}\'.")

            #  check if at least one rich message was received 
            if expected_response_rich_available != None and not (computed_response_rich_available == expected_response_rich_available):
                if expected_response_rich_available:
                    error_messages.append(f"fulfillment_messages->richContent expected to be available, however the result does NOT contain a rich content.")
                else:
                    error_messages.append(f"fulfillment_messages->richContent expected to be NOT available, however the result does contain a rich content.")

            # check if the expected number of parameters was recognized in the sent input
            if expected_number_of_parameters != None and expected_number_of_parameters > 0 and not (computed_response_parameter_number == expected_number_of_parameters):
                error_messages.append(f"{expected_number_of_parameters} parameters expected in the Dialogflow response, however, {computed_response_parameter_number} parameters were computed.")


            #  print error output
            if len(error_messages) > 0:

                if description: # print description of test case if available
                    print("\tDESCRIPTION: " + description)
                
                for error_message in error_messages:
                    print("\t" + error_message)
                count_errors += 1

    return Statstics(number_of_tests=count_tests, number_of_errors=count_errors)

def get_computed_intent(response):
    """ 
        extracts the computed intent from the Dialogflow response, fallback: None
    """
    try:
        return response.query_result.intent.display_name
    except Exception as e:
        return None

def get_computed_response_text_available(response):
    """ 
        extract fulfillment messages and check if at least one is a text, fallback: False
    """
    try:
        text = get_computed_response_text_value(response)
        if text == None:
            return False
        elif len(text) > 0:
            return True
        else:
            return False
    except Exception as e:
        return False

def get_computed_response_text_value(response):
    """ 
        extract the text message from the Dialogflow response, fallback: None
    """
    try:
        if len(response.query_result.fulfillment_text):
            return response.query_result.fulfillment_text
        elif len(response.query_result.fulfillment_messages[0].text.text[0]):
            return response.query_result.fulfillment_messages[0].text.text[0]
        else:
            return None
    except Exception as e:
        return None

def get_computed_response_rich_available(response):
    """  
        extract fulfillment messages and check if at least one is a complex one (hack to determine the rich messages), fallback: False
    """
    messages = response.query_result.fulfillment_messages
    for counter, message in enumerate(messages):
        value = None
        try:
            value = message.payload.values()
            if value != None: # is None if text message
                return True
        except Exception as e:
            pass

    return False

def get_computed_response_parameter_number(response):
    """  
        extract the number of parameters from the Dialogflow response, fallback: 0
    """
    try:
        return len(response.query_result.parameters)
    except:
        return 0

def interpret_as_bool(value) -> bool:
    """ 
        computes boolean from text, different forms are allowed, fallback: False
    """
    return value.lower() in ['true', 't', 'y', 'yes', 'yeah']

def run_all_tests(project_id, test_directory, language_code) -> None:
    """ 
        read files in provided directory and execute all tests, a statistics is shown thereafter
    """
    test_cases_files = [test_directory + "/" + f for f in os.listdir(test_directory) if os.path.isfile(os.path.join(test_directory, f))]
    
    count_tests = 0
    count_errors = 0

    for test_cases_file in test_cases_files:
        result = run_tests(test_cases_file=test_cases_file, language_code=language_code)
        count_tests += result.get_number_of_tests()
        count_errors += result.get_number_of_errors()

    print("*" * 40)
    print(f"Executed tests: \t{count_tests}\nObserved errors: \t{count_errors}")
    print("*" * 40)
    
if __name__ == "__main__":
    run_all_tests(project_id=project_id, test_directory=test_directory, language_code=language_code)
