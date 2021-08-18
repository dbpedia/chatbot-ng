const qanaryComponents = require('./components');
const axios = require('axios');
const fuzzySet = require('fuzzyset');
const SparqlClient = require('sparql-http-client');
const {WebhookClient,Card,Suggestion,Payload,Platforms} = require('dialogflow-fulfillment');
const {LinkOutSuggestion,Suggestions} = require('actions-on-google'); 
const defaultComponents = ['NED-DBpediaSpotlight', 'QueryBuilderSimpleRealNameOfSuperHero', 'SparqlExecuter', 'OpenTapiocaNED', 'BirthDataQueryBuilder', 'WikidataQueryExecuter']
const profileComponents = []
const welcomeMessageData = ['Hi! I am the DBpedia bot, How are you doing?','Hello! I am the DBpedia bot,  How can I help you?','Greetings! I am the DBpedia bot,  How can I assist?','Good day! I am the DBpedia bot,  What can I do for you today?']
let sessionIdManagement = new Map()  
let lastKbquestion = new Map() 
let lastGraphId = new Map() 
let profiles = new Map() 


function welcomeIntent(agent) {
        let conv = agent.conv()    
        if(!sessionIdManagement.has(agent.session.split('/')[4])){
            sessionIdManagement.set(agent.session.split('/')[4] , {
            components: defaultComponents
         })
        }
        const welcomeMessageArr = welcomeMessageData;
        const textindex = Math.floor(Math.random() * welcomeMessageArr.length);
        const output = welcomeMessageArr[textindex];
        console.log(sessionIdManagement)
        if(agent.requestSource == "ACTIONS_ON_GOOGLE"){
            conv.ask(output)
            conv.ask(new Suggestions("What is dbpedia?"))
            conv.ask(new Suggestions("How to contribute to dbpedia?"))
            conv.ask(new LinkOutSuggestion({
                name: 'Tutorial',
                url: 'https://jayeshdesai4520.github.io/DBpedia-GSoC-2021/about'
            })) 
            agent.add(conv)
        }else{
            agent.add(output)    
            const payload = {
                      "richContent": [
                        [
                          {
                            "options": [
                              { 
                                "text": "What is dbpedia?",
                              },
                              { 
                                "text": "How to contribute to dbpedia?",
                              },
                              {
                                "link": 'https://jayeshdesai4520.github.io/DBpedia-GSoC-2021/about',
                                "text": "Check Tutorial",
                                "image": {
                                  "src": {
                                    "rawUrl": "https://i.postimg.cc/hjks7bXp/DBpedia-Logo.png"
                                  }
                                }
                              }
                            ],
                            "type": "chips"
                          }
                        ]
                      ]
                    }
            agent.add(
              new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
            )
            }  

}

function dbpediaInfoIntent(agent) { 
        let conv = agent.conv()  
        if(agent.requestSource == "ACTIONS_ON_GOOGLE"){
            conv.ask('DBpedia is a crowd-sourced community effort to extract structured information from Wikipedia and make this information available on the Web.')
            conv.ask(new LinkOutSuggestion({
                name: 'Learn More',
                url: 'https://www.dbpedia.org/about/',
            }))
            agent.add(conv)
        }else{ 
            agent.add('DBpedia is a crowd-sourced community effort to extract structured information from Wikipedia and make this information available on the Web.')    
            const payload = {
                      "richContent": [
                        [
                          {
                            "type": "chips",
                            "options": [
                              {
                                "image": {
                                  "src": {
                                    "rawUrl": "https://i.postimg.cc/hjks7bXp/DBpedia-Logo.png"
                                  }
                                },
                                "link": "https://www.dbpedia.org/about/",
                                "text": "Learn More"
                              },
                              {
                                "text": "Getting Started",
                                "link": "https://www.dbpedia.org/",
                                "image": {
                                  "src": {
                                    "rawUrl": "https://i.postimg.cc/hjks7bXp/DBpedia-Logo.png"
                                  }
                                }
                              }
                            ]
                          }
                        ]
                      ]
                    } 
            agent.add(
              new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
            )
        }
     
}

function dbpediaContributeIntent(agent) {
        let conv = agent.conv()  
        if(agent.requestSource == "ACTIONS_ON_GOOGLE"){
            conv.ask('There are multiple ways to contribute to DBpedia, You can: 1 - Look at open issues if you want to contribute to the codebase 2 - Improve Documentation 3 - Join the discussion on upcoming features, releases, and issues')
            conv.ask(new LinkOutSuggestion({
                name: 'Get Involved',
                url: 'https://www.dbpedia.org/community/improve/',
            }))
            agent.add(conv)
        }else{ 
            agent.add('There are multiple ways to contribute to DBpedia, You can: 1 - Look at open issues if you want to contribute to the codebase 2 - Improve Documentation 3 - Join the discussion on upcoming features, releases, and issues')    
            const payload = {
                  "richContent": [
                    [
                      {
                        "options": [
                          {
                            "text": "Get Involved",
                            "link": "https://www.dbpedia.org/community/improve/",
                            "image": {
                              "src": {
                                "rawUrl": "https://i.postimg.cc/hjks7bXp/DBpedia-Logo.png"
                              }
                            }
                          },
                          {
                            "image": {
                              "src": {
                                "rawUrl": "https://i.postimg.cc/hjks7bXp/DBpedia-Logo.png"
                              }
                            },
                            "link": "https://sourceforge.net/projects/dbpedia/lists/dbpedia-discussion",
                            "text": "Mailing List"
                          },
                          {
                            "link": "https://dbpedia.slack.com/",
                            "image": {
                              "src": {
                                "rawUrl": "https://i.postimg.cc/hjks7bXp/DBpedia-Logo.png"
                              }
                            },
                            "text": "Slack"
                          }
                        ],
                        "type": "chips"
                      }
                    ]
                  ]
                }
            agent.add(
              new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
            )
        }
}

function activeComponentsIntent(agent) {
    let conv = agent.conv()
    if (!sessionIdManagement.has(agent.session.split('/')[4])) {
        agent.add('Currently, there are no active components, you can add components by saying Add and then name of the component.')
    }else{
        const getComponent = sessionIdManagement.get(agent.session.split('/')[4]) 
        const show = getComponent.components
        let output = 'Currently, active components are ' + show
        if(agent.requestSource == "ACTIONS_ON_GOOGLE"){
                conv.ask(output) 
                conv.ask(new Suggestions("Reset component list"));
                agent.add(conv)
            }else{ 
                agent.add(output)    
                const payload =  {
                      "richContent": [
                        [
                          {
                            "options": [
                               { 
                                "text": "Reset component list",
                               }
                            ],
                            "type": "chips"
                          }
                        ]
                      ]
                    }
                agent.add(
                new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
                )
            }   
    } 
    console.log(sessionIdManagement)
}

function resetComponentsListIntent(agent) { 
    sessionIdManagement.set(agent.session.split('/')[4], {
            components: ['NED-DBpediaSpotlight', 'QueryBuilderSimpleRealNameOfSuperHero', 'SparqlExecuter', 'OpenTapiocaNED', 'BirthDataQueryBuilder', 'WikidataQueryExecuter']
         })
    agent.add('Reset Successfully, Components list are now empty.') 
    console.log(sessionIdManagement)
}
 
function Emptycomponentlist(agent) { 
    sessionIdManagement.set(agent.session.split('/')[4], {
            components: []
         })
    agent.add('Components list are now empty.') 
    console.log(sessionIdManagement)
}


async function deactivateComponentIntent(agent) {
    const deactivate = agent.parameters.componentname   
    let qanaryComponentList = await qanaryComponents.getQanaryComponents()
    let deactivateResult = qanaryComponentList.get(deactivate)
    if (deactivateResult == null){
        agent.add(deactivate + ' not available to know more about active components use command \'list of active qanary components\'.')
    }else{
        let deactivateComponent = deactivateResult[0][1]     
        let finalComponentRemove = deactivateComponent.replace(/['"]+/g, '')
        const getComponent = sessionIdManagement.get(agent.session.split('/')[4]) 
        const localcomponentList = getComponent.components
        var index = localcomponentList.indexOf(finalComponentRemove);   
        if(index == -1){
            agent.add(finalComponentRemove + ' do not exists in the local list of active components to know more about active components use command \'list of active components\'.')
        }else{
            localcomponentList.splice(index,  1);
            sessionIdManagement.set(agent.session.split('/')[4], {
            components: localcomponentList
            })
            agent.add("Successfully removed " + finalComponentRemove + " from components list.")
            console.log(sessionIdManagement)
        }  
    }
}


async function activateComponentIntent(agent) {
    let activate = agent.parameters.activatecomponent;  
    let activateComponent = JSON.stringify(activate) 
    let qanaryComponentList = await qanaryComponents.getQanaryComponents()
    let activateResult = qanaryComponentList.get(activateComponent)
    if (activateResult == null){
        agent.add(activateComponent + ' not available to know more about active components use command \'list of active qanary components\'.')
    }else{  
        let addComponent = activateResult[0][1] 
        let finalComponentAdd = addComponent.replace(/['"]+/g, '') 
        const getComponent = sessionIdManagement.get(agent.session.split('/')[4]) 
        const localcomponentList = getComponent.components
        var index = localcomponentList.indexOf(finalComponentAdd);
        if(index == -1){
            localcomponentList.push(finalComponentAdd);
            sessionIdManagement.set(agent.session.split('/')[4], {
            components: localcomponentList
            })
            agent.add('Successfully Added ' + finalComponentAdd + ' you can add more components by saying Add and then name of the component.')
            console.log(sessionIdManagement)
        }else{
            agent.add(finalComponentAdd + ' already exists in the list to know more about active components use command \'list of active qanary components\'.')
        }
    }
}

async function activeQanaryIntent(agent) { 
         let fuzzy = await qanaryComponents.getQanaryComponents()  
         agent.add('Total Active components are ' + fuzzy.length() + ' and components are ' + fuzzy.values() )  
}

async function componentStartwithIntent(agent) {
    let startWithName = agent.parameters.startwith;  
    let fuzzy = await qanaryComponents.getQanaryComponents() 
    let startWithCompare = fuzzy.values()
    let filteredList = startWithCompare.map(s => s.slice(1)); 
    let newfilteredList = filteredList.map(u => u.slice(0, -1)); 
    let startsWith = newfilteredList.filter((componentName) => componentName[0]===startWithName.toUpperCase())
    console.log(startsWith)  
    if(startsWith.length === 0){
        agent.add('Component name starting with ' + startWithName + ' are not available.') 
    }else{
        const str = startsWith.toString();
        agent.add('Components starting with ' + startWithName + ' are ' + str)  
    } 
}



//Profile related Intents

function createProfileIntent(agent) {  
    let profileName = agent.parameters.newprofilename;
    if(profiles.has(agent.session.split('/')[4] + profileName)){
        agent.add(profileName + ' Profile already exists.'); 
    }else{  
        profiles.set(agent.session.split('/')[4] + profileName, {
            components: profileComponents
         }) 
        console.log(profiles)
        agent.add(profileName + ' Profile added successfully. Now to use this profile you can say start ' + profileName + ' to activate the profile.');      
    }
}



async function addComponentsToProfile(agent) {  
    let profileName = agent.parameters.profilename;
    if(profiles.has(agent.session.split('/')[4] + profileName)){
        let componentName = agent.parameters.newcomponentname;
        let qanaryComponentList = await qanaryComponents.getQanaryComponents()
        let checkComponents = qanaryComponentList.get(componentName) 
        if (checkComponents == null){
            agent.add(componentName + ' not available to know more about active components use command \'list of active qanary components\'.')
        }else{
            let addComponents = checkComponents[0][1]     
            let finalComponentAdd = addComponents.replace(/['"]+/g, '') 
            const getComponent = profiles.get(agent.session.split('/')[4] + profileName) 
            const localcomponentList = getComponent.components
            var index = localcomponentList.indexOf(finalComponentAdd);
            if(index == -1){
                localcomponentList.push(finalComponentAdd);
                profiles.set(agent.session.split('/')[4] + profileName, {
                components: localcomponentList
                })
                agent.add('Successfully Added ' + finalComponentAdd + ' to the ' + profileName + ' you can add more components by saying Add and then name of the component.')
                console.log(profiles)
            }else{
                agent.add(finalComponentAdd + ' already exists in the list.')
            } 
        } 
    }else{
         agent.add(profileName + ' does not exists, to create new profile you can say \'create profile and then profile name\' like create profile country.')
    }
}


async function removeComponentFromProfile(agent) { 
    let profileName = agent.parameters.profilename;
    let componentName = agent.parameters.newcomponentname;
    if(profiles.has(agent.session.split('/')[4] + profileName)){ 
        let qanaryComponentList = await qanaryComponents.getQanaryComponents()
        let checkComponents = qanaryComponentList.get(componentName)
        if (checkComponents == null){
            agent.add(componentName + ' not available to know more about active components use command \'list of active qanary components\'.')
        }else{      
            let removeComponents = checkComponents[0][1] 
            let finalComponentRemove = removeComponents.replace(/['"]+/g, '')   
            const getComponent = profiles.get(agent.session.split('/')[4] + profileName) 
            const localcomponentList = getComponent.components
            var index = localcomponentList.indexOf(finalComponentRemove);   
            if(index == -1){
                agent.add(finalComponentRemove + ' not available in list to know more about ' + profileName  + ' the component use command \'show components of ' + profileName + '\'')
            }else{
                localcomponentList.splice(index,  1);
                profiles.set(agent.session.split('/')[4] + profileName, {
                components: localcomponentList
                })
                agent.add("Successfully removed " + finalComponentRemove + " from components list of " +  profileName)
                console.log(profiles)
            }   
        }
    }else{
        agent.add(profileName + ' does not exists, to create new profile you can say \'create profile and then profile name\' like create profile country.')
    }
}


function componentInformationFromProfile(agent) {  
    let profileName = agent.parameters.profilename
    if(profiles.has(agent.session.split('/')[4] + profileName)){
        const getComponent = profiles.get(agent.session.split('/')[4] + profileName) 
        const show = getComponent.components 
        if(show == ""){
            agent.add(profileName + ' list is empty.') 
        }else{
            agent.add(profileName +  ' contains ' + show)
        }
    }else{
        agent.add(profileName + ' does not exists, to create new profile you can say \'create profile and then profile name\' like create profile country') 
    }
}


function activateProfileIntent(agent) {
    let profileName = agent.parameters.profilename
    let defaultcomponent = fuzzySet(); 
    defaultcomponent.add("default component")
    let checkProfile = defaultcomponent.get(profileName) 
    if(checkProfile == null){
        if(profiles.has(agent.session.split('/')[4] + profileName)){
            const getComponent = profiles.get(agent.session.split('/')[4] + profileName) 
            const show = getComponent.components
            sessionIdManagement.set(agent.session.split('/')[4], {
            components: show
            })
            console.log(sessionIdManagement)
            agent.add(profileName + ' Activated Successfully to know about active components use command \'list of active components\'.')  
        }else{
            agent.add(profileName + ' Profile not defined by you or by Admin.')   
        }  
   }else{ 
        sessionIdManagement.set(agent.session.split('/')[4], {
            components: ['NED-DBpediaSpotlight', 'QueryBuilderSimpleRealNameOfSuperHero', 'SparqlExecuter', 'OpenTapiocaNED', 'BirthDataQueryBuilder', 'WikidataQueryExecuter']
        })
        console.log(sessionIdManagement)
        agent.add(profileName + ' Activated Successfully to know about active components use command \'list of active components\'.')  
   }  
}

//End


function fallBack(agent) {
    let conv = agent.conv()  
    lastKbquestion.set(agent.session.split('/')[4],agent.query)
    console.log(lastKbquestion)
    const getComponent = sessionIdManagement.get(agent.session.split('/')[4]) 
    const show = getComponent.components
    return axios.post('https://webengineering.ins.hs-anhalt.de:43740/gerbil-execute/' + show  + '?query=' + lastKbquestion.get(agent.session.split('/')[4]), {
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
            let resultObj = JSON.parse(result);
            let myValue = resultObj["question"]["answers"];
            let infoList = JSON.parse(myValue);
            let infoOne = infoList["head"]["vars"][0]
            let infoTwo = infoList["head"]["vars"][1]
            let infoThree = infoList["head"]["vars"][2]
            let answerInfo = infoList["results"]["bindings"]
            let answerOne = answerInfo[0][infoOne]["value"]
            let answerTwo = answerInfo[0][infoTwo]["value"]
            let answerThree = answerInfo[0][infoThree]["value"]
            let output = infoOne + ':' + answerOne + ' ' + infoTwo + ':' + answerTwo + ' ' + infoThree + ':' + answerThree
            //console.log(response) 
            if(agent.requestSource == "ACTIONS_ON_GOOGLE"){
                conv.ask(output)
                conv.ask(new Suggestions("show rdf graph"));
                agent.add(conv)
            }else{ 
                agent.add(output)    
                const payload =  {
                      "richContent": [
                        [
                          {
                            "options": [
                              { 
                                "text": "show rdf graph",
                              }
                            ],
                            "type": "chips"
                          }
                        ]
                      ]
                    }
                agent.add(
                new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
                )
            }

        }).catch(function(error) {
            let output = 'No answer could be loaded. Try again? or you can ask for help!' 
            console.log(error) 
            if(agent.requestSource == "ACTIONS_ON_GOOGLE"){
                conv.ask(output)
                conv.ask(new Suggestions("Help"))
                conv.ask(new LinkOutSuggestion({
                name: 'Check Tutorial',
                url: 'https://jayeshdesai4520.github.io/DBpedia-GSoC-2021/about',
            }))
            agent.add(conv)
            }else{ 
                agent.add(output)    
                const payload =  {
                      "richContent": [
                        [
                          {
                            "options": [
                              { 
                                "text": "Help",
                              },
                              {
                                "link": 'https://jayeshdesai4520.github.io/DBpedia-GSoC-2021/about',
                                "text": "Check Tutorial",
                                "image": {
                                  "src": {
                                    "rawUrl": "https://i.postimg.cc/hjks7bXp/DBpedia-Logo.png"
                                  }
                                }
                              }
                            ],
                            "type": "chips"
                          }
                        ]
                      ]
                    }
                agent.add(
                new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
                )
            } 
        });
}


function show_RdfgraphIntent(agent) {  
    console.log(sessionIdManagement.get(agent.session.split('/')[4])) 
    const getComponent = sessionIdManagement.get(agent.session.split('/')[4]) 
    const show = getComponent.components 
    let params = {
                    "question": lastKbquestion.get(agent.session.split('/')[4]),
                    "componentlist": show
    }
    return axios.post('https://webengineering.ins.hs-anhalt.de:43740/startquestionansweringwithtextquestion', params)
    .then(function (response) { 
        let conv = agent.conv() 
        let graphId = response.data.inGraph 
        lastGraphId.set(agent.session.split('/')[4],graphId)
        console.log(lastGraphId) 
        let outputLink = 'Go to this link to see RDF Visualization - https://rdfgraphvisualizations.herokuapp.com/visualize/' + lastGraphId.get(agent.session.split('/')[4]) 
        let website = 'https://rdfgraphvisualizations.herokuapp.com/visualize/' + lastGraphId.get(agent.session.split('/')[4]) 
        if(agent.requestSource == "ACTIONS_ON_GOOGLE"){
            conv.ask('Go to this link to see RDF Visualization - https://rdfgraphvisualizations.herokuapp.com/visualize/' + graphId)
            conv.ask(new LinkOutSuggestion({
                name: 'Graph Visualization',
                url: website,
            }))
            agent.add(conv)
        }else{
            agent.add(outputLink)    
            const payload = {
                      "richContent": [
                        [
                          {
                            "options": [
                              {
                                "link": website,
                                "text": "Graph Visualization",
                                "image": {
                                  "src": {
                                    "rawUrl": "https://i.postimg.cc/hjks7bXp/DBpedia-Logo.png"
                                  }
                                }
                              },
                            ],
                            "type": "chips"
                          }
                        ]
                      ]
                    }
            agent.add(
              new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
            )
            }    
        }).catch(function(error) {
            console.log(error)
            agent.add('No visualization could be loaded. Try again? or you can ask for help!')
        });
}


function helpIntent(agent) {
        let conv = agent.conv()
        let output = 'Currently, You can ask me about what is DBpedia? or how to contribute to DBpedia? or you can ask me a question like What is the real name of Batman?'
            if(agent.requestSource == "ACTIONS_ON_GOOGLE"){
                conv.ask(output) 
                conv.ask(new LinkOutSuggestion({
                name: 'Tutorial',
                url: 'https://jayeshdesai4520.github.io/DBpedia-GSoC-2021/about',
            }))
            agent.add(conv)
            }else{ 
                agent.add(output)    
                const payload =  {
                      "richContent": [
                        [
                          {
                            "options": [
                              {
                                "link": 'https://jayeshdesai4520.github.io/DBpedia-GSoC-2021/about',
                                "text": "Check Tutorial",
                                "image": {
                                  "src": {
                                    "rawUrl": "https://i.postimg.cc/hjks7bXp/DBpedia-Logo.png"
                                  }
                                }
                              }
                            ],
                            "type": "chips"
                          }
                        ]
                      ]
                    }
                agent.add(
                new Payload(agent.UNSPECIFIED, payload, {rawPayload: true, sendAsMessage: true})
                )
            }    
}



async function sparqltest(agent) {   
      const query = `
        SELECT (COUNT(?s) as ?numTriples)
        WHERE {
        ?s ?p ?o .
        }`;
    const client = new SparqlClient({
          endpointUrl: 'https://webengineering.ins.hs-anhalt.de:40159/qanary/query',
          user: "admin",
          password: "admin"
        }) 
    const stream = await client.query.select(query)
    stream.on('data', row => {
      Object.entries(row).forEach(([key, value]) => { 
        console.log(`${key}: ${value.value} (${value.termType})`)
      })
    })

    stream.on('error', err => {
      console.log(err)
    })
    agent.add("hello")
}

 

module.exports = { sparqltest,welcomeIntent,dbpediaInfoIntent,dbpediaContributeIntent,activeComponentsIntent,resetComponentsListIntent,deactivateComponentIntent,activateComponentIntent,activeQanaryIntent,activateProfileIntent,componentStartwithIntent,show_RdfgraphIntent,createProfileIntent,addComponentsToProfile,removeComponentFromProfile,componentInformationFromProfile,helpIntent,Emptycomponentlist,fallBack  };