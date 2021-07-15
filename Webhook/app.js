const express = require('express')
const axios = require('axios');
const {WebhookClient} = require('dialogflow-fulfillment')
const FuzzySet = require('fuzzyset')
const {Payload, Platforms, Suggestion} = require('dialogflow-fulfillment');
const app = express()
app.use(express.json())
app.get('/', (req, res) => {
    res.send("ok Server Is Working.....")
})

var session 
var kbquestion
var body   
var listofqanarycomponent = [];
var defaultcomponents = ["NED-DBpediaSpotlight", "QueryBuilderSimpleRealNameOfSuperHero", "SparqlExecuter", "OpenTapiocaNED", "BirthDataQueryBuilder", "WikidataQueryExecuter"];
const welcome_message_data = ['Hi! I am the DBpedia bot, How are you doing?','Hello! I am the DBpedia bot,  How can I help you?','Greetings! I am the DBpedia bot,  How can I assist?','Good day! I am the DBpedia bot,  What can I do for you today?']
//Define profiles
var coronabotprofile = ["coronabot-answer-generation","coronabot-data-acquisition"]
//End
let sessionidmanagement = new Map() 
let askqanarycount = new Map() 
a = FuzzySet();


/**
 * on this route dialogflow send the webhook request
 * For the dialogflow we need POST Route.
 * */
app.post('/webhook', (request, response) => {
    // get agent from request
    let agent = new WebhookClient({
        request: request,
        response: response
    })
   
    // create intentMap for handle intent
    let intentMap = new Map();
    body = request.body 
    session = request.body.session.split('/')[4]
    if(request.body.queryResult.intent.displayName == "Default Fallback Intent"){
    kbquestion = request.body.queryResult.queryText
    }
    // add intent map 2nd parameter pass function 
    intentMap.set('Default Welcome Intent', Welcome_Intent)
    intentMap.set('Show component list Intent', Active_components_Intent)
    intentMap.set('Reset list of components Intent', Reset_components_list_Intent)
    intentMap.set('Deactivate component Intent', Deactivate_component_Intent)
    intentMap.set('Activate component Intent', Activate_component_Intent) 
    intentMap.set('Active Qanary components', Activate_Qanary_Intent) 
    intentMap.set('Activate profile component', Activate_profile_Intent) 
    intentMap.set('Component startwith intent', Component_startwith_Intent) 
    intentMap.set('show rdf visualization', Show_RDFGraph_Intent) 
    intentMap.set('Default Fallback Intent', fallback);
    //now agent is handle request and pass intent map 
    agent.handleRequest(intentMap)
})


app.get('/question', (req, res) => {   
    //console.log(wordCount)  
    res.send(kbquestion)  
})

function myFunction() {
  setInterval(function(){ 
    axios.get('https://webengineering.ins.hs-anhalt.de:43740/components')
    .then(function (response) {
        let body = response.data
        global.listofqanarycomponent = [];
        global.a 
        for (var i = 0; i < body.length; i++){  
          listofqanarycomponent.push(JSON.stringify(body[i]["name"]))
          a.add(JSON.stringify(body[i]["name"]))
         }   
        //complete(listofqanarycomponent) 
        compare(a) 
        console.log("15 seconds done")
   }) }, 15000);
}

myFunction()

//axios.get('https://webengineering.ins.hs-anhalt.de:43740/components')
//    .then(function (response) { 
//        let body = response.data
//        global.listofqanarycomponent = [];
//        global.a 
//        for (var i = 0; i < body.length; i++){  
//          listofqanarycomponent.push(JSON.stringify(body[i]["name"]))
//          a.add(JSON.stringify(body[i]["name"]))
//         }    
//        compare(a)
//    })

function compare(a) {  
    global.a   
    return a
}  



function Welcome_Intent(agent) {
        if(!sessionidmanagement.has(session)){
        sessionidmanagement.set(session,defaultcomponents)
        askqanarycount.set(session,0)
        }
        const welcomeMessageArr = welcome_message_data;
        const textindex = Math.floor(Math.random() * welcomeMessageArr.length);
        const out = welcomeMessageArr[textindex];
        const speechOutput =  out; 
        agent.add(speechOutput)
        console.log(sessionidmanagement.get(session)) 
        //test code below
        //var fuzzy = compare(a)  
        //var testtt = a.get("tapioned")
        //var score = testtt[0][0]
        //var name = testtt[0][1]
        //console.log(score)
        //console.log(name)
        //console.log(testtt)
        //if (score<.49){
        //    console.log("added")
        //} else {
        //    console.log("not added please speak again")
        //}  
}

 
function Active_components_Intent(agent) {
    if (!sessionidmanagement.has(session)) {
        agent.add("currently, there are no active components")
    } else {
        agent.add("currently, active components are " + sessionidmanagement.get(session))
    } 
    console.log(sessionidmanagement)
}


function Reset_components_list_Intent(agent) {
    sessionidmanagement.set(session, "")
    sessionidmanagement.set(session,defaultcomponents)
    agent.add("Components list are now empty") 
    console.log(sessionidmanagement)
}


function Deactivate_component_Intent(agent) {
    const deactivate = agent.parameters.componentname;  
    deletecomponent = sessionidmanagement.get(session)
    var fuzzy = compare(a)  
    var deactivateresult = a.get(deactivate);
    if (deactivateresult == null){
        agent.add(deactivate + "   not available to know more about active components use command 'list of active qanary components'")
    }else{
    var deactivatecomponent = deactivateresult[0][1]     
    finalcomponentadd = deactivatecomponent.replace(/['"]+/g, '') 
    console.log(finalcomponentadd) 
    var duplicatearray = sessionidmanagement.get(session)
    var n = duplicatearray.includes(finalcomponentadd)
    if(n == false){
        agent.add(finalcomponentadd + " do not exists in the list of active components to know more about active components use command 'list of active components'")
    }else{
    deletecomponent = deletecomponent.toString().replace("," + finalcomponentadd, "")
    sessionidmanagement.set(session,deletecomponent) 
    agent.add("successfully removed " + deactivatecomponent + " from components list")
    console.log(sessionidmanagement)
       }  
    }
}


function Activate_component_Intent(agent) {
    var activate = agent.parameters.activatecomponent; 
    var activate_component = JSON.stringify(activate)
    var fuzzy = compare(a) 
    //console.log(fuzzy.values())
    var compareresult = a.get(activate_component);
    if (compareresult == null){
        agent.add(activate_component + " not available to know more about active components use command 'list of active qanary components'")
    }else{  
    var addcomponent = compareresult[0][1] 
    finalcomponentadd = addcomponent.replace(/['"]+/g, '') 
    var duplicatearray = sessionidmanagement.get(session)
    var n = duplicatearray.includes(finalcomponentadd); 
    if(n == true){
        agent.add(finalcomponentadd + " already exists in the list to know more about active components use command 'list of active qanary components")
    }else{
    sessionidmanagement.set(session, sessionidmanagement.get(session) + "," +  finalcomponentadd)
    agent.add("successfully Added " + finalcomponentadd + " you can add more components by saying Add and then name of the component")
    console.log(sessionidmanagement)
     }
    }
}


function Activate_Qanary_Intent(agent) { 
    if (askqanarycount.get(session) == 10){
         agent.add("Limit reached! You can ask again after 5 minutes")
         setTimeout(function(){  
            askqanarycount.set(session,0)
            console.log("reset done")
         }, 300000)
    }else{
         var fuzzy = compare(a)  
         askqanarycount.set(session, askqanarycount.get(session) + 1)
         agent.add("Total Active components are " + fuzzy.length() + " and components are " + fuzzy.values() )  
         console.log(askqanarycount.get(session))
    }
}

 
function Activate_profile_Intent(agent) {
    var profile = agent.parameters.profilename;
    if(profile == "coronabot"){
    finalcomponentadd = "coronabot-answer-generation"
    var duplicatearray = sessionidmanagement.get(session)
    var n = duplicatearray.includes(finalcomponentadd); 
    if(n == true){
        agent.add("this profile already exists in the list to know more about active components use command 'list of active qanary components")
    } else{
    sessionidmanagement.set(session, sessionidmanagement.get(session) + "," +  coronabotprofile)
    agent.add(profile + " Profile added successfully") 
    } }else{
        agent.add(profile + " Profile not defined by admin contact admin to add profile!")   
    }
    console.log(sessionidmanagement.get(session))  
}

 
function Component_startwith_Intent(agent) {
    var startwithname = agent.parameters.startwith; 
    var fuzzy = compare(a) 
    var startwithcompare = fuzzy.values()
    var filteredlist = startwithcompare.map(s => s.slice(1)); 
    var newfilteredlist = filteredlist.map(u => u.slice(0, -1)); 
    const startsWith = newfilteredlist.filter((componentname) => componentname[0]===startwithname.toUpperCase())
    console.log(startsWith)  
    if(startsWith.length === 0){
        agent.add("Component name starting with " + startwithname + " are not available") 
    }else{
        const str = startsWith.toString();
        agent.add("Components starting with " + startwithname + " are " + str)  
    } 
}


  

function Show_RDFGraph_Intent(agent) { 
    return axios.get('https://rdfgraphvisualizations.herokuapp.com/updategraphvalue')
    .then(function (response) { 
        let graphid = response.data
        console.log(graphid)
        outputlink = "Go to this link to see RDF Visualization - https://rdfgraphvisualizations.herokuapp.com/visualize/" + graphid
        agent.add(outputlink)      
    }).catch(function(error) {
            console.log(error)
            agent.add("No visualization could be loaded. Try again? or you can ask for help!")
        });
}



function fallback(agent) {


    return axios.post('https://webengineering.ins.hs-anhalt.de:43740/gerbil-execute/' + sessionidmanagement.get(session)  + '?query=' + kbquestion, {
            headers: {
                'content-type': 'text/plain'
            }
        })
        .then(function(response) {
            let body = response.data.questions
            let status = response.status
            result = JSON.stringify(body[0])
            result = result.replace(/(^\[)/, '');
            result = result.replace(/(\]$)/, '');
            var resultObj = JSON.parse(result);
            var my_value = resultObj["question"]["answers"];
            var infolist = JSON.parse(my_value);
            var infoone = infolist["head"]["vars"][0]
            var infotwo = infolist["head"]["vars"][1]
            var infothree = infolist["head"]["vars"][2]
            var answerinfo = infolist["results"]["bindings"]
            var answerone = answerinfo[0][infoone]["value"]
            var answertwo = answerinfo[0][infotwo]["value"]
            var answerthree = answerinfo[0][infothree]["value"]
            var output = infoone + ":" + answerone + " " + infotwo + ":" + answertwo + " " + infothree + ":" + answerthree
            //console.log(response)
            agent.add(output) 

        }).catch(function(error) {
            console.log(error)
            agent.add("No answer could be loaded. Try again? or you can ask for help!")
        });
}

app.listen(process.env.PORT || 3000, () => {
    console.log("Server is Running on port 3000")
})