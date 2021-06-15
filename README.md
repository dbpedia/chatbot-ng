# DBpedia Chatbot -- The Next Generation 

This repository will provide the implementation of the project proposed using the title ['Modular DBpedia Chatbot'](https://forum.dbpedia.org/t/modular-dbpedia-chatbot-gsoc-2021/953) that is funded by the [Google Summer of Code program](https://summerofcode.withgoogle.com/projects/#5922382260207616). Please find [more information in the DBpedia forum](https://forum.dbpedia.org/t/modular-dbpedia-chatbot-gsoc-2021/953) and in the [blog of the project](https://jayeshdesai4520.github.io/DBpedia-GSoC-2021/).

The project is carried out by [Jayesh Desai](@jayeshdesai4520). 

The project Supervision and support is done by:

* [Andreas Both](https://github.com/anbo-de)
* [Alexander Perevalov](https://github.com/Perevalov)
* [Ricardo Usbeck](https://github.com/RicardoUsbeck)
* [Ram Athreya](https://github.com/ram-g-athreya)



### Folder Structure

    ├── Dialogflow-Agent        # chatbot code
    ├── Zip File                # import zip file in dialogflow
    ├── Webhook code            # heroku Webhook code
    
    
## Getting Started

You will need to register a free account on ['dialogflow'](https://dialogflow.cloud.google.com/). After that you need to create an agent. <br> <br>

### Installation

Step one - Download or Clone the repo, Navigate to the directory named zip file <br> <br>
Step two - Next, select the gear icon to go to settings <br> <br>
![](https://i.imgur.com/jCtS0Fi.png)  <br> <br>
Step three - Next, select the Export and Import tab.  <br> <br>
![](https://imgur.com/SQ9WxMP.png)  <br> <br>
Step four - Now, select the local zip file  <br> <br>
![](https://imgur.com/KsfBpU8.png)  <br> <br>
Dialogflow will import the entire agent from the zip file for you. 

### Setup webhook in heroku 

Step one - make account in heroku <br> <br>
Step two - create new app and follow the given instruction in heroku website <br> <br>
Step three - click on open app and copy the url and add /webhook at the last of the url <br> <br>
![](https://imgur.com/QonOn2M.png)  <br> <br>
Step four - go to fulfillment section in dialogflow and click save. <br> <br>
![](https://imgur.com/CPGs1Xa.png)  <br> <br>
 
### Information about some main Intents <br> <br>
[] Gives information about component

example commands/questions:
what is Name Entity Recognition ?

expected outcome:
It uses rule base grammar to extract entities in a text.


### Demo 
Check out new live link demo here it also supports Suggestion chip response [Link](https://tacoaccounttest.github.io/)



    
