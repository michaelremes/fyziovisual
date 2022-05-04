import { Node, Edge } from './PipelineConfig_Model';

import Abstract_Module from '../modules/Abstracts/Abstract_Module';
import Input_Module from '../modules/Abstracts/Input_Module';
import InfluxDB_Module from '../modules/OutputModules/InfluxDB_Module';
import BPM_Module from '../modules/AnalyticalModules/BPM_Module';
import RespirationRate_Module from '../modules/AnalyticalModules/RespirationRate_Module';
import ECG_Module from '../modules/InputModules/ECG_Module';
import Respiration_Module from '../modules/InputModules/Respiration_Module';
import Temperature_Module from '../modules/InputModules/Temperature_Module';


class Pipeline_Builder {

    private pipeline_nodes: Node[];
    private pipeline_config: any[];
    private pipeline_edges: Edge[];
    private pipeline_tree: Abstract_Module[];
    private rootNode: Node = null;

    constructor(pipeline_config: any[]) {
        this.pipeline_tree = [];
        this.pipeline_nodes = [];
        this.pipeline_edges = [];

        this.pipeline_config = pipeline_config;

        for (let elem of this.pipeline_config) {
            /* separate pipeline_config to nodes and edges */
            if (elem.type === 'buttonedge')
                this.pipeline_edges.push(elem);
            else
                this.pipeline_nodes.push(elem);

            /* if node is output set it as root to the tree */
            if (elem.type === 'fv_output') {
                /*root can be set only once */
                if (this.rootNode === null)
                    this.rootNode = elem;
                else
                    console.error("Only one root node allowed");
            }
        }
        /* root for tree must be set */
        if (this.rootNode !== null) {
            this.buildTree(this.rootNode);
        }
        else {
            console.error("Output module missing");
        }
    }

    /* validatate saved configuration while building tree 

        only one output node allowed

        if node is already on the pipeline_tree array 
            it means there is a cycle in the configuration

        if node/nodes are left after the recursion 
            it means the configuration contains isolated nodes

        Last nodes(sources) in configuration has to be input ones    

    */

    /*recursive function to retrieve all children and build pipeline tree */
    buildTree(currentNode: Node): Input_Module {
        let nodeObj: any;
        switch (currentNode.type) {
            case 'fv_output':
                switch (currentNode.data.sub_type) {
                    case 'influx':
                        nodeObj = new InfluxDB_Module(currentNode);
                        break;
                }
                break;
            case 'fv_analytical':
                switch (currentNode.data.sub_type) {
                    case 'bpm':
                        nodeObj = new BPM_Module(currentNode);
                        break;
                    case 'resp_rate':
                        nodeObj = new RespirationRate_Module(currentNode);
                        break;
                }
                break;
            case 'fv_input':
                switch (currentNode.data.sub_type) {
                    case 'ecg':
                        nodeObj = new ECG_Module(currentNode);
                        break;
                    case 'respiration':
                        nodeObj = new Respiration_Module(currentNode);
                        break;
                    case 'temperature':
                        nodeObj = new Temperature_Module(currentNode);
                        break;
                }

                break;

            default:
                nodeObj = null;
        }

        /* get edges from current node */
        const edgesFromNode = this.pipeline_edges.filter(edge => edge.target === currentNode.id);

        /* get all children to curent node */
        for (let edge of edgesFromNode) {
            const childrenNode = this.pipeline_nodes.find(node => node.id === edge.source);
            nodeObj.addSource(this.buildTree(childrenNode));
        }
        this.pipeline_tree.push(nodeObj);


        return nodeObj;
    }

    getPipelineTree() {
        return this.pipeline_tree;
    }


    printTree() {
        console.log('Printing pipeline tree, size: ' + this.pipeline_tree.length);
        console.log('---------------------------------');

        for (let node of this.pipeline_tree) {
            console.log('{')
            node.print();
            console.log('}')
            console.log('-->')
        }
        console.log('---------------------------------');

    }


}



export default Pipeline_Builder;