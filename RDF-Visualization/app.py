from flask import *  
import os
import rdflib.graph as g
from rdflib.extras.external_graph_libs import rdflib_to_networkx_graph
from pyvis.network import Network
from flask import Flask, render_template
from SPARQLWrapper import SPARQLWrapper, JSON , XML, N3, RDF, CSV, TSV, RDFXML 
import requests
from qanary_helpers import qanary_queries
app = Flask('testapp')
app.config['TEMPLATES_AUTO_RELOAD'] = True
#right now code is messy 
 
#visualization

global graphid 

@app.route('/updategraphvalue')
def generategraphid():
    global graphid   
    req = requests.get("https://dbpediachatbot.herokuapp.com/question").content
    req = req.decode("utf-8") 
    print(type(req))
    print(req)
    r = requests.post('https://webengineering.ins.hs-anhalt.de:43740/startquestionansweringwithtextquestion',
            params={
                    "question": req,
                    "componentlist[]": ["NED-DBpediaSpotlight",
                    "QueryBuilderSimpleRealNameOfSuperHero",
                    "SparqlExecuter",
                    "OpenTapiocaNED",
                    "BirthDataQueryBuilder",
                    "WikidataQueryExecuter"]
    })
    res = r.json()   
    graphid = res['inGraph']
    print(graphid) 
    return graphid


@app.route('/showgraph')
def showgraph(): 
    global graphid        
    #read data 
    sparql = SPARQLWrapper("https://webengineering.ins.hs-anhalt.de:40159/qanary/query")
    sparql.setCredentials("admin", "admin")
    sparql_query = """ 
    DESCRIBE *
    FROM <""" + graphid  + """>
    WHERE {
            ?s a qa:AnnotationOfAnswerSPARQL.
            ?s oa:hasBody ?sparqlQueryOnDBpedia .
            ?s oa:annotatedBy ?annotatingService .
            ?s oa:annotatedAt ?time .
        }
        """  
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(XML)
    sparql.setMethod("POST")
    results = sparql.query().convert() 
    print(results)
    #rdflib to  networkgraph
    rg = results 
    G = rdflib_to_networkx_graph(rg)
    print("networkx Graph loaded successfully with length {}".format(len(G)))
    net = Network(height="750px", width="100%")
    net.from_nx(G)
    net.show_buttons(filter_=['physics'])
    net.force_atlas_2based(gravity=-90,spring_length = 175, central_gravity = 0) 
    save = net.show("templates/index.html")
    return render_template('index.html')

@app.route('/graphidnumber')
def graphidnumber():
    global graphid
    print(graphid)
    return graphid


@app.route('/visualize/<name>')  
def user(name):  
    global graphid
    if name == graphid:
        return redirect(url_for('showgraph')) 
    else:
        errorpage = "Visualization Page not found Try Again... GraphID invalid"
        return errorpage

@app.route('/visualize/example')
def htmlpage(): 
    #Get Graphid
    r = requests.post('https://webengineering.ins.hs-anhalt.de:43740/startquestionansweringwithtextquestion',
            params={
                    "question": "What is the real name of hulk?",
                    "componentlist[]": ["NED-DBpediaSpotlight",
                    "QueryBuilderSimpleRealNameOfSuperHero",
                    "SparqlExecuter",
                    "OpenTapiocaNED",
                    "BirthDataQueryBuilder",
                    "WikidataQueryExecuter"]
    })
    res = r.json()   
    graphidtest = res['inGraph']
    print(graphidtest)  
    #read data 
    sparql = SPARQLWrapper("https://webengineering.ins.hs-anhalt.de:40159/qanary/query")
    sparql.setCredentials("admin", "admin")
    sparql_query = """ 
    DESCRIBE *
    FROM <""" + graphidtest  + """>
    WHERE {
            ?s a qa:AnnotationOfAnswerSPARQL.
            ?s oa:hasBody ?sparqlQueryOnDBpedia .
            ?s oa:annotatedBy ?annotatingService .
            ?s oa:annotatedAt ?time .
        }
        """  
    sparql.setQuery(sparql_query)
    sparql.setReturnFormat(XML)
    sparql.setMethod("POST")
    results = sparql.query().convert() 
    print(results)
    #rdflib to  networkgraph
    rg = results 
    G = rdflib_to_networkx_graph(rg)
    print("networkx Graph loaded successfully with length {}".format(len(G)))
    net = Network(height="750px", width="100%")
    net.from_nx(G)
    net.show_buttons(filter_=['physics'])
    net.force_atlas_2based(gravity=-90,spring_length = 175, central_gravity = 0) 
    save = net.show("templates/exampleviz.html")
    return render_template('/exampleviz.html')


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
    app.run()