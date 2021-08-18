const express = require('express');
const axios = require('axios');
const {WebhookClient} = require('dialogflow-fulfillment');
const intent = require("./intent");
const qanaryComponents = require('./components'); 
let intentMap = new Map() 
const app = express()
app.use(express.json())



intentMap.set('Default Welcome Intent', intent.welcomeIntent)
intentMap.set('DBpedia Info Intent', intent.dbpediaInfoIntent)
intentMap.set('DBpedia contribute Intent', intent.dbpediaContributeIntent)
intentMap.set('Show component list Intent', intent.activeComponentsIntent)
intentMap.set('Reset list of components Intent', intent.resetComponentsListIntent)
intentMap.set('Deactivate component Intent', intent.deactivateComponentIntent)
intentMap.set('Activate component Intent', intent.activateComponentIntent) 
intentMap.set('Active Qanary components', intent.activeQanaryIntent) 
intentMap.set('Activate profile component', intent.activateProfileIntent) 
intentMap.set('Component startwith intent', intent.componentStartwithIntent) 
intentMap.set('show rdf visualization', intent.show_RdfgraphIntent) 
intentMap.set('Create profile intent', intent.createProfileIntent) 
intentMap.set('Add components to profile', intent.addComponentsToProfile) 
intentMap.set('Remove component from profile', intent.removeComponentFromProfile) 
intentMap.set('Component information from profile', intent.componentInformationFromProfile) 
intentMap.set('Help Intent', intent.helpIntent)
intentMap.set('Empty component list', intent.Emptycomponentlist) 
intentMap.set('sparqltest', intent.sparqltest)
intentMap.set('Default Fallback Intent', intent.fallBack)

app.post('/webhook', (request, response) => {    
    // get agent from request
    let agent = new WebhookClient({
        request: request,
        response: response
    })   
    agent.handleRequest(intentMap)
});


(async function(){
    await qanaryComponents.getQanaryComponents() 
    app.listen(process.env.PORT || 3000, () => {
    qanaryComponents.updateComponents() 
    console.log('Server is Running on port 3000')
   })
})()
