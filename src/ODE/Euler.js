import React, {Component} from 'react';
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
        title: "x",
        dataIndex: "x",
        key: "x"
    },
    {
      title: "y",
      key: "y",
      dataIndex: "y"
    }
];
var X = [], yE = [], exactEquation;
class Euler extends Component {
    constructor() {
        super();
        this.state = {
            fx: "",
            start: 0,
            finish: 0,
            x0: 0,
            y0: 0,
            h: 0,
            exactEquation: "",
            showOutputCard: false,
            showGraph: false
        }
        this.handleChange = this.handleChange.bind(this);
    }
    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });

    }
    euler(start, finish, x0, y0, h) {
        exactEquation = this.state.exactEquation
        X = []
        yE = []
        dataInTable = []
        var y = y0
        var xi = x0
        for (var i=start ; i<=finish ; i+=h) {
            y = y + this.func(xi, y)*h
            xi += h
            yE.push(y)
            X.push(i)

        }
        this.createTable(X, yE)
        this.setState({
            showOutputCard: true,
            showGraph: true
        })
    }

    func(X, Y) {
        var expr = math.compile(this.state.fx);
        let scope = {x:parseFloat(X), y:parseFloat(Y)};
        return expr.eval(scope);        
    }
    createTable(x, y) {
        dataInTable = []
        for (var i=0 ; i<x.length ; i++) {
            dataInTable.push({
                x: x[i],
                y: y[i]
            });
        }
    
    }
    render() {
        return(
            <div style={{padding: "30px" }}>
                <h2 style={{color: "black", fontWeight: "bold"}}>Euler's Method</h2>
                <div style={{float:"left"}}>
                    <Card
                    bordered={true}
                    style={{ width: 300, background: "#b39eb5", color: "#FFFFFFFF", float:"left"}}
                    onChange={this.handleChange}
                    id="inputCard"
                    >
                        <h2>f(x,y)</h2><Input size="large" name="fx" style={InputStyle}></Input>
                        <h2>X<sub>0</sub></h2><Input size="large" name="x0" style={InputStyle}></Input>
                        <h2>Y<sub>0</sub></h2><Input size="large" name="y0" style={InputStyle}></Input>
                        <h2>Start</h2><Input size="large" name="start" style={InputStyle}></Input>
                        <h2>Finish</h2><Input size="large" name="finish" style={InputStyle}></Input>
                        <h2>H</h2><Input size="large" name="h" style={InputStyle}></Input><br/><br/>
                        <h2>Exact Equation</h2><Input size="large" name="exactEquation" style={InputStyle}></Input><br/><br/>
                        <Button id="submit_button" onClick= {
                                ()=>this.euler(parseFloat(this.state.start),  parseFloat(this.state.finish),parseFloat(this.state.x0), parseFloat(this.state.y0), parseFloat(this.state.h))
                            }  
                        style={{background: "#4caf50", color: "white", fontSize: "20px"}}>Submit</Button>
                        
                    </Card>  
                    {this.state.showGraph &&
                        <Card
                        bordered={true}
                        style={{ width: 500, height:400, border:"2px solid black", background: "#f44aaa6", color: "#FFFFFFFF", float:"left"}}
                        >
                            <Plot
                                data={[
                                {
                                    x: X,
                                    y: yE,
                                    type: 'scatter',
                                    marker: {color: 'blue'},
                                    name: "Euler's"
                                },
                                {
                                    x: X,
                                    y: X.map(function (x) {
                                        return math.compile(exactEquation).eval({x: x})
                                    }),
                                    type: 'scatter',
                                    marker: {color: 'red'},
                                    name: "exact equation"
                                },
                                ]}
                                layout={ {title: 'Euler\'s'} }
                                
                                style={{width: "100%", float:"left", height: "370px"}}
                            />  
                        </Card>                        
                    }   
                    <br/>
                    {this.state.showOutputCard && 
                        <Card
                        title={"Output"}
                        bordered={true}
                        style={{width: "100%", background: "#b39eb5", color: "#FFFFFFFF", float:"left"}}
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
export default Euler;