import { Component } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

const COLORS = ['#F26000', '#00F330'];

class YilChart extends Component {
  constructor(props){
    super(props);
    this.state = {
      data: []
    }
  }

  componentDidMount() {
    const url_proj = 'https://mdsa.bipad.gov.np/api/v1/project';
    fetch(url_proj,{
        method: 'GET',
    })
    .then(res => res.json())
    .then(data => this.handleProjData(data.results));
  }

  handleProjData(data){
    const url_org = 'https://mdsa.bipad.gov.np/api/v1/organization';
    const repeatedObjs = data.reduce((acc, d) => {
        const found = acc.find(a => a.oid === d.oid);
        const value = {value: d.ptitle};
        if (!found){
            acc.push({oid:d.oid, data:[value]})
        }
        else{
            found.data.push(value)
        }
        return acc;
    }, []);

    const dataCount = repeatedObjs.map((item) => {
        return {'name':item.oid,'value':item.data.length};
    });

    fetch(url_org,{
        method: 'GET',
    })
    .then(res => res.json())
    .then(orgData => this.createFinalObj(orgData, dataCount));
  }

  createFinalObj(data,temp_arr) {
    const result = temp_arr.map((item) => {
      const oid = parseInt(item.name);
      const convdata = [...data.results];
      const name =  convdata.filter(function(entry){
        return entry.oid === oid;
      });
      return {'name':name[0].oname, 'value': item.value };
    });
    this.setState({data: result});
  }

  render() {
    const data = this.state.data;
    return (
      <PieChart width={800} height={400} onMouseEnter={this.onPieEnter}>
        <Pie
          data={data}
          cx={300}
          cy={100}
          innerRadius={60}
          outerRadius={70}
          fill="#8884d8"
          paddingAngle={0}
          dataKey="value"
          nameKey="name"
          legendType="rect"
          label="true"
        >
        {
          data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)
        }
        </Pie>
        <Legend verticalAlign="bottom" height={36}/>
      </PieChart>
    );
  }
}

export default YilChart;
