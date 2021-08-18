# DBpedia Chatbot - New Generation
The Modern DBpedia chatbot with functionality of the Qanary framework including its plug-and-play components and their optimization.  <br>

This repository will provide the implementation of the project proposed using the title ['Modular DBpedia Chatbot'](https://forum.dbpedia.org/t/modular-dbpedia-chatbot-gsoc-2021/953) that is funded by the [Google Summer of Code program](https://summerofcode.withgoogle.com/projects/#5922382260207616). Please find [more information in the DBpedia forum](https://forum.dbpedia.org/t/modular-dbpedia-chatbot-gsoc-2021/953) and in the [blog of the project](https://jayeshdesai4520.github.io/DBpedia-GSoC-2021/about).

The project is carried out by [Jayesh Desai](https://github.com/jayeshdesai4520). 

The project Supervision and support is done by:

* [Andreas Both](https://github.com/anbo-de)
* [Alexander Perevalov](https://github.com/Perevalov)
* [Ricardo Usbeck](https://github.com/RicardoUsbeck)
* [Ram Athreya](https://github.com/ram-g-athreya)

## Quick Links
- [Qanary Framework](https://github.com/WDAqua/Qanary)
- [Question Answer Components](https://github.com/WDAqua/Qanary-question-answering-components)
___
[Final Application](https://tacoaccounttest.github.io/) <br> 
[How to use DBpedia Chatbot](https://jayeshdesai4520.github.io/DBpedia-GSoC-2021/about) <br> 
For more information about this project and **GSoC Progress** please refer to [GSoC Wiki](https://github.com/jayeshdesai4520/chatbot-ng-internal/wiki) and [Progress](https://jayeshdesai4520.github.io/DBpedia-GSoC-2021/)

## Folder Structure

    ├── Dialogflow-Agent        # Chatbot code
    ├── Zip File                # Import zip file in dialogflow
    ├── Webhook                 # Webhook code
    ├── RDF-Visualization       # RDF visualization code
    
    

## Getting Started

You will need to register a free account on [Dialogflow](https://dialogflow.cloud.google.com/). After that you need to create an agent. <br> <br>

### Installation

- Download or clone the repository, Navigate to the directory named zip file <br> <br>
- Next, select the gear icon to go to settings <br> <br>
![](https://imgur.com/kXBTaEr.png)  <br> <br>
- After that, select the export and import tab.  <br> <br>
![](https://imgur.com/Gr5VVBj.png)  <br> <br>
- Now, click on import zip file and select the zip file  <br> <br>
![](https://imgur.com/dd59yCh.png)  <br> <br>
Dialogflow will import the entire agent from the zip file for you. 

### Setup webhook in heroku 

- Sign up for Heroku <br> <br>
- Create new app and follow the instruction given in Heroku website <br> <br>
- Now, click on open app and copy the url and add /webhook at the end of the url <br> <br>
![](https://imgur.com/M8PnbnO.png)  <br> <br>
- Last step is to click on fulfillment section in dialogflow and click save. <br> <br>
![](https://imgur.com/LlDxjLW.png)  <br> <br>
 
## Embed Code
```
<script src="https://www.gstatic.com/dialogflow-console/fast/messenger/bootstrap.js?v=1"></script>
<df-messenger
  intent="WELCOME"
  chat-title="DBpediaChatbotNG"
  agent-id="ad6b7d53-5823-4d2a-a540-529c4259cb7a"
  language-code="en"
></df-messenger>
```
 
## Contributing

Contributions are always welcome!

See `contributing.md` for ways to get started.
 
## Feedback

Feedback is appreciated! submit a new issue!


## License

[MIT](/LICENSE)

    
