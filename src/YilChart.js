import { Component } from 'react';
import {
  PieChart,
  Pie,
  Sector,
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

  handleData(data){
    const _arr = [];
    this.setState({data: data.results});
    const result = data.results.reduce((acc, d) => {
    const found = acc.find(a => a.oid === d.oid);
    const value = { value: d.ptitle};
    if (!found) {
        acc.push({oid:d.oid, data: [value]})
    }
    else {
        found.data.push(value)
    }
    return acc;
    }, []);
    const temp_arr = result.map(function(item){
      return {'name':item.oid,'value': item.data.length};
    });
    const url_org = 'https://mdsa.bipad.gov.np/api/v1/organization';

    fetch(url_org,{
      method: 'GET',
    })
    .then(res=> res.json())
    .then(data=>this.createData(data, temp_arr));

    console.log(data.results);
    console.log(temp_arr);
  }

  createData(data,temp_arr) {
    const result = temp_arr.map(function(item){
      const oid = parseInt(item.name);
      const convdata = [...data.results];
      const name =  convdata.filter(function(entry){
        return entry.oid === oid;
      });
      return {'name':name[0].oname, 'value': item.value };
    });
    this.setState({data: result});
    console.log(data.results);
  }

  componentDidMount() {
    const url_proj = 'https://mdsa.bipad.gov.np/api/v1/project';

    fetch(url_proj,{
      method: 'GET',
    })
    .then(res=> res.json())
    .then(data=>this.handleData(data));
  }

  render() {
    const data = this.state.data;
    return (
      <div>
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

      </div>
    );
  }
}

export default YilChart;
