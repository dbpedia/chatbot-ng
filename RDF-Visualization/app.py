from flask import Flask, render_template
import os
import rdflib.graph as g
from rdflib.extras.external_graph_libs import rdflib_to_networkx_graph
from pyvis.network import Network
app = Flask('testapp')
#right now code is messy 
#read data
graph = g.Graph()
graph.parse('data/qanary_urn_graph_558646f1-e64e-47b0-b0e8-daef79cb8984.rdfxml', format='xml')
print(graph.serialize(format='pretty-xml'))
#query data
qres = graph.query(
    """# Expand From IRIs
CONSTRUCT {
  ?iri ?predicate ?object .
  ?object a ?object_type .
  ?object <tag:stardog:studio:label> ?object_label_0 .
  ?object rdfs:label ?object_label_1 .
  ?object <http://purl.org/dc/elements/1.1/title> ?object_label_2 .
  ?subject ?predicate_2 ?iri .
  ?subject a ?subject_type .
  ?subject <tag:stardog:studio:label> ?subject_label_0 .
  ?subject rdfs:label ?subject_label_1 .
  ?subject <http://purl.org/dc/elements/1.1/title> ?subject_label_2 .
} WHERE {
  VALUES (?iri) {
    (<tag:stardog:api:0.44585392708185767>)
  }
  { 
    ?iri ?predicate ?object . 
    OPTIONAL { ?object a ?object_type . }
    OPTIONAL { ?object <tag:stardog:studio:label> ?object_label_0 . }
    OPTIONAL { ?object rdfs:label ?object_label_1 . }
    OPTIONAL { ?object <http://purl.org/dc/elements/1.1/title> ?object_label_2 . }
  }
  UNION {
    ?subject ?predicate_2 ?iri .
    OPTIONAL { ?subject a ?subject_type . }
    OPTIONAL { ?subject <tag:stardog:studio:label> ?subject_label_0 . }
    OPTIONAL { ?subject rdfs:label ?subject_label_1 . }
    OPTIONAL { ?subject <http://purl.org/dc/elements/1.1/title> ?subject_label_2 . }
  }
}
LIMIT 1000

""")

#rdflib to network graph
rg = qres
G = rdflib_to_networkx_graph(rg)
print("networkx Graph loaded successfully with length {}".format(len(G)))


#visualization 
def generatehtmlpage():
    net = Network(height="750px", width="100%")
    net.from_nx(G)
    net.show_buttons(filter_=['physics'])
    net.force_atlas_2based(gravity=-90,spring_length = 175, central_gravity = 0)
    save = net.show("example.html")
    return save


@app.route('/')
def index(): 
    return render_template('/example.html', variable=generatehtmlpage())

if __name__ == '__main__':
    #port = int(os.environ.get("PORT", 5000))
    #app.run(host='0.0.0.0', port=port)
    app.run()