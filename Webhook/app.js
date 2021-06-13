const express = require('express')
const axios = require('axios');
const {WebhookClient} = require('dialogflow-fulfillment')
const app = express()
app.use(express.json())
app.get('/', (req, res) => {
    res.send("Server Is Working......")
})
/**
* on this route dialogflow send the webhook request
* For the dialogflow we need POST Route.
* */
app.post('/webhook', (req, res) => {
    // get agent from request
    let agent = new WebhookClient({request: req, response: res})
    // create intentMap for handle intent
    let intentMap = new Map();
    // add intent map 2nd parameter pass function
    intentMap.set('webhook_test_intent',weatherIntent)
    intentMap.set('show_active_component_list',active_components_Intent)
    intentMap.set('reset_list_of_components',reset_components_list_Intent)
    intentMap.set('Deactivate_component_intent',Deactivate_component_intent)
    intentMap.set('Activate_component_intent',Activate_component_intent)
    // now agent is handle request and pass intent map
    agent.handleRequest(intentMap)
})

var activecomponents = ["one","two"];



// just for API test
function weatherIntent(agent){ 
    const apiKey = "23756992e06787aa9225e9b361dfcd66"
    const city = agent.parameters.city; 
    const url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=imperial`
    return axios.get(url)
      .then(function (response) {
        // handle success
        console.log(response.data); 
        agent.add("Temp in " + city +  " is " + response.data.main.temp)
        
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .then(function () {
        // always executed
      });
}


// adding info soon in comments 

function active_components_Intent(agent){ 
    if (activecomponents.length === 0){
        agent.add("currently, there are no active components")     
    } else {
        agent.add("currently, active components are " + activecomponents) 
    }
}


function reset_components_list_Intent(agent){ 
        activecomponents = []
        agent.add("Components list are now empty")  
        console.log(activecomponents)   
}


function Deactivate_component_intent(agent){ 
        const deactivate = agent.parameters.componentname; 
        activecomponents.pop(deactivate); 
        agent.add("succesfully deactivated " + deactivate)        
}


function Activate_component_intent(agent){ 
        //agent.add("To add the components in order you can say Add and then name of the components")
        const activate = agent.parameters.activatecomponent; 
        activecomponents.push(activate); 
        agent.add("succesfully Added " + activate + " you can add more components by saying Add and then name of the components")       
}


/**
* now listing the server on port number 3000 :)
* */
app.listen(3000, () => {
    console.log("Server is Running on port 3000")
})