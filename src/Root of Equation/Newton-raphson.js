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
      title: "Error",
      key: "error",
      dataIndex: "error"
    }
];
  const xValues = math.range(-10, 10, 0.5).toArray();
  var fx = " ";
class Newton extends Component {
    
    constructor() {
        super();
        this.state = {
            fx: "",
            x0: 0,
            showOutputCard: false,
            showGraph: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.newton_raphson = this.newton_raphson.bind(this);
    }

    newton_raphson(xold) {
        fx = this.state.fx;
        var xnew = 0;
        var epsilon= parseFloat(0.000000);
        var n=0;
        var data  = []
        data['x'] = []
        data['error'] = []
        do{ 
            xnew = xold - (this.func(xold)/this.funcDiff(xold));
            epsilon = this.error(xnew, xold)
            data['x'][n] =  xnew.toFixed(8);
            data['error'][n] = Math.abs(epsilon).toFixed(8);
            n++;  
            xold = xnew;
        }while(Math.abs(epsilon)>0.000001);

        this.createTable(data['x'], data['error']);
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
    funcDiff(X) {
        var expr = math.derivative(this.state.fx, 'x');
        let scope = {x:parseFloat(X)};
        return expr.eval(scope); 
    }
    error(xnew, xold) {
        return Math.abs((xnew-xold) / xnew);
    }
    createTable(x, error) {
        dataInTable = []
        for (var i=0 ; i<x.length ; i++) {
            dataInTable.push({
                iteration: i+1,
                x: x[i],
                error: error[i]
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
                <h2 style={{color: "black", fontWeight: "bold"}}>Newton Raphson</h2>
                <div>
                    <Card
                    bordered={true}
                    style={{ width: 300, background: "#b39eb5", color: "#FFFFFFFF", float:"left"}}
                    onChange={this.handleChange}
                    >
                        <h2>f(x)</h2><Input size="large" name="fx" style={InputStyle}></Input>
                        <h2>X<sub>0</sub></h2><Input size="large" name="x0" style={InputStyle}></Input>
                        <Button id="submit_button" onClick= {
                                ()=>this.newton_raphson(parseFloat(this.state.x0))
                            }  
                        style={{background: "#4caf50", color: "white", fontSize: "20px"}}>Submit</Button>
                        
                    </Card>
                    {this.state.showGraph &&
                        <Card
                        title={"Graph"}
                        bordered={true}
                        style={{ width: 500,height: "75vmin",  border:"2px solid black", background: "#f44aaa6", color: "#FFFFFFFF", float:"left"}}
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
                                
                                style={{width: "100%"}}
                            />  
                        </Card>                        
                    }
                    {this.state.showOutputCard && 
                        <Card
                        title={"Output"}
                        bordered={true}
                        style={{width: "100%", background: "#b39eb5", color: "#FFFFFFFF", float:"inline-start"}}
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
export default Newton;