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
var dataInTable = []
const columns = [
    {
      title: "Iteration",
      dataIndex: "iteration",
      key: "iteration"
    },
    {
        title: "Y",
        dataIndex: "y",
        key: "y"
    },
    {
      title: "Error",
      key: "error",
      dataIndex: "error"
    }
  ];
  const xValues = math.range(-10, 10, 0.5).toArray();
  var fx = " ";
class Secant extends Component {
    
    constructor() {
        super();
        this.state = {
            fx: "",
            x0: 0,
            x1: 0,
            showOutputCard: false,
            showGraph: false
        }
        this.handleChange = this.handleChange.bind(this);
        this.secant = this.secant.bind(this);
    }
    secant(x0, x1) {
        fx = this.state.fx;
        var x = [], y=0, epsilon = parseFloat(0.000000);
        var n=1, i=1;
        var data  = []
        data['y'] = []
        data['error'] = []
        x.push(x0);
        x.push(x1);
        data['y'][0] = x0;
        data['error'][0] = "---";

        do{ 
            y = x[i] - (this.func(x[i])*((x[i]-x[i-1])))/(this.func(x[i])-this.func(x[i-1]));
            x.push(y);
            epsilon = this.error(y,x[i]);
            data['y'][n]   =   y.toFixed(8);
            data['error'][n] =   Math.abs(epsilon).toFixed(8);
            
            n++;  
            i++;

        }while(Math.abs(epsilon)>0.000001);
        this.createTable(data['y'], data['error']);
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
    error(xnew, xold) {
        return Math.abs((xnew-xold) / xnew);
    }
    createTable(y, error) {
        dataInTable = []
        for (var i=0 ; i<y.length ; i++) {
            dataInTable.push({
                iteration: i+1,
                y: y[i],
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
                <h2 style={{color: "black", fontWeight: "bold"}}>Secant Method</h2>
                <div>
                    <Card
                    bordered={true}
                    style={{ width: 300, background: "#b39eb5", color: "#FFFFFFFF", float:"left"}}
                    onChange={this.handleChange}
                    >
                        <h2>f(x)</h2><Input size="large" name="fx" style={InputStyle}></Input>
                        <h2>X<sub>0</sub></h2><Input size="large" name="x0" style={InputStyle}></Input>
                        <h2>X<sub>1</sub></h2><Input size="large" name="x1" style={InputStyle}></Input><br/><br/>
                        <Button id="submit_button" onClick= {
                                ()=>this.secant(parseFloat(this.state.x0), parseFloat(this.state.x1))
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
                        style={{width: "100%", background: "#b39eb5", color: "#FFFFFFFF", float:"inline-start", marginBlockStart:"2%"}}
                        id="outputCard"
                        >
                            <Table columns={columns} dataSource={dataInTable} bodyStyle={{fontWeight: "bold", fontSize: "18px", color: "black"}}
                            ></Table>
                        </Card>
                    }                    
                </div>

                
            </div>
        );
    }
}
export default Secant;




