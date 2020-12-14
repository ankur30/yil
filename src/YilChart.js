import { Component } from 'react';
import _ from 'lodash';
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
    const orgCount = _.countBy(data,"oid");
    const urlOrg = 'https://mdsa.bipad.gov.np/api/v1/organization';
    fetch(urlOrg,{
        method: 'GET',
    })
    .then(res => res.json())
    .then(orgData => this.createChartObj(orgCount, orgData));
  }

  createChartObj(orgCount, data,temp_arr) {
     const orgNameOids = _.keys(orgCount);
     const orgNames = orgNameOids.map((item) => {
         const convdata = [...data.results];
         const name =  convdata.filter((entry) => {
           return  entry.oid === parseInt(item);
         });
         return {'name':name[0].oname, 'value': orgCount[item] };
     });
    this.setState({data: orgNames});
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
