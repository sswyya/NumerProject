import React, { Component } from 'react'
import {Card, Input, Button, Table} from 'antd';
import '../screen.css';
import 'antd/dist/antd.css';
import math from 'mathjs';
import Plot from 'react-plotly.js';

const InputStyle = {
    background: "#F690BB",
    color: "white", 
    fontWeight: "bold", 
    fontSize: "24px"

};
var dataInTable;
const columns = [
    {
      title: "Iteration",
      dataIndex: "iteration",
      key: "iteration"
    },
    {
        title: "X",
        dataIndex: "x",
        key: "x"
    },
    {
      title: "Y",
      key: "y",
      dataIndex: "y"
    }
  ];
const xValues = math.range(-10, 10, 0.5).toArray();
var fx = " ";
class Graphical extends Component {
    
    constructor() {
        super();
        this.state = {
            fx: "",
            start: 0,
            finish: 0,
            showOutputCard: false,
            showGraph: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.graphical = this.graphical.bind(this);
    }

    graphical() {
        fx = this.state.fx;
        var data  = []
        data['x'] = []
        data['y'] = []
        console.log(typeof(this.state.start))
        for (var i=parseInt(this.state.start) ; i<=parseInt(this.state.finish) ; i++) {
            data['x'].push(i);
            data['y'].push(this.func(i));
         
        }
        

        this.createTable(data['x'], data['y']);
        this.setState({
            showOutputCard: true,
            showGraph: true
        })

        
    }
    func(X) {
        var expr = math.compile(this.state.fx);
        let scope = {x:parseFloat(X)};
        return expr.eval(scope);        
    }
    createTable(x, y) {
        dataInTable = []
        for (var i=0 ; i<parseInt(this.state.finish-this.state.start) ; i++) {
            dataInTable.push({
                iteration: i+1,
                x: x[i],
                y: y[i]
            });
        }
    
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    render() {
        return(
            <div style={{ background: "#FFFF", padding: "30px" }}>
                <h2 style={{color: "black", fontWeight: "bold"}}>Graphical</h2>
                <div>
                    <Card
                    bordered={true}
                    style={{ width: 300, background: "#b39eb5", color: "#FFFFFFFF", float:"left"}}
                    onChange={this.handleChange}
                    >
                        <h2>f(x)</h2><Input size="large" name="fx" style={InputStyle}></Input>
                        <h2>Start</h2><Input size="large" name="start" style={InputStyle}></Input>
                        <h2>Finish</h2><Input size="large" name="finish" style={InputStyle}></Input><br/><br/>
                        <Button id="submit_button" onClick= {
                                ()=>this.graphical(parseFloat(this.state.start), parseFloat(this.state.finish))
                            }  
                        style={{background: "#4caf50", color: "white", fontSize: "20px"}}>Submit</Button>
                        
                    </Card>
                    {this.state.showGraph &&
                        <Card
                        bordered={true}
                        style={{ width: 500, height: "75vmin", border:"2px solid black", background: "#f44aaa6", color: "#FFFFFFFF", float:"left"}}
                        >
                            <Plot
                                data={[
                                {
                                    x: math.range(-10, 10, 0.5).toArray(),
                                    y: xValues.map(function (x) {
                                        return math.compile(fx).eval({x: x})
                                    }),
                                    type: 'scatter',
                                    marker: {color: 'red'},
                                },
                                ]}
                                layout={ {title: 'A Fancy Plot'} }
                                
                                style={{width: "100%", float:"left"}}
                            />  
                        </Card>                        
                    }
                    {this.state.showOutputCard && 
                        <Card
                        title={"Output"}
                        bordered={true}
                        style={{width: "100%", background: "#b39eb5", color: "#FFFFFFFF", float:"inline-start", marginBlockStart:"2%"}}
                        id="outputCard"
                        >
                            <Table columns={columns} bordered={true} dataSource={dataInTable} bodyStyle={{fontWeight: "bold", fontSize: "18px", color: "black"}}
                            ></Table>
                        </Card>
                    }                    
                </div>

                
            </div>
        );
    }
}
export default Graphical;