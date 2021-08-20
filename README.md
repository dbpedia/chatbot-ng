# DBpedia Chatbot - New Generation

This modern [DBpedia](https://dbpedia.org/) chatbot provides access to a self-configurable Question Answering (QA) system.
The chatbot is encapsulating the functionality of the [Qanary framework](https://github.com/WDAqua/Qanary) including its plug-and-play components (cf. the [list of available components](https://github.com/WDAqua/Qanary-question-answering-components)). 
This project is dedicated to enabling regular users and researchers to define their own QA system by combining components just by interacting with the provided chatbot. Hence, no technical skills are required to create and test a new QA system.

This repository provides the implementation of the chatbot. 
It was initially implemented funded by the [Google Summmer of Code program](https://summerofcode.withgoogle.com/projects/#5922382260207616) (GSoC). 
Originally it was proposed in the DBpedia forum: ['Modular DBpedia Chatbot'](https://forum.dbpedia.org/t/modular-dbpedia-chatbot-gsoc-2021/953). 
Please find more information in the [blog of the project](https://jayeshdesai4520.github.io/DBpedia-GSoC-2021/about).

## Team

The GSoC project was carried out by [Jayesh Desai](https://github.com/jayeshdesai4520). 

The project is supervised and supported by:

* [Andreas Both](https://github.com/anbo-de)
* [Aleksandr Perevalov](https://github.com/Perevalov)
* [Ricardo Usbeck](https://github.com/RicardoUsbeck)
* [Ram Athreya](https://github.com/ram-g-athreya)

## Quick Links

- the [DBpedia chatbot](https://tacoaccounttest.github.io/)
- [How to use DBpedia Chatbot](https://jayeshdesai4520.github.io/DBpedia-GSoC-2021/about) <br> 
For more information about this project and **GSoC progress** please refer to [GSoC Wiki](https://github.com/dbpedia/chatbot-ng/wiki) and the [progress report](https://jayeshdesai4520.github.io/DBpedia-GSoC-2021/)

## Used Technology

- [Google Dialogflow](https://dialogflow.cloud.google.com/)
- [Qanary Framework](https://github.com/WDAqua/Qanary)
- [Qanary Question Answer Components](https://github.com/WDAqua/Qanary-question-answering-components)

## Folder Structure

    ├── Dialogflow-Agent        # Chatbot code
    ├── Zip File                # Import zip file in dialogflow
    ├── Webhook                 # Webhook code
    ├── RDF-Visualization       # RDF visualization code

## Getting Started

You will need to register a free account on [Dialogflow](https://dialogflow.cloud.google.com/) if you want to run the chatbot by yourself. 
After that you need to create an agent. 

### Installation

- Download or clone the repository, navigate to the directory named zip file 
- Next, select the gear icon to go to settings <br> <br>
![](https://imgur.com/kXBTaEr.png)  <br> <br>
- After that, select the export and import tab.  <br> <br>
![](https://imgur.com/Gr5VVBj.png)  <br> <br>
- Now, click on import zip file and select the zip file. <br> <br>
![](https://imgur.com/dd59yCh.png)  <br> <br>
- Dialogflow will import the entire agent from the zip file for you. 
- Now, you have the complete DBpedia chatbot in your own project.

### Setup webhook in Heroku 

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

Feedback is appreciated! [Do not hesitate to submit a new issue!](https://github.com/dbpedia/chatbot-ng/issues/new)


## License

[MIT](/LICENSE)

    
