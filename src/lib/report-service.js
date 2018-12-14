import axios from 'axios';

class Report {
  constructor() {
    this.auth = axios.create({
      baseURL: `${process.env.REACT_APP_API_URL}`,
      withCredentials: true
    });
  }

  create(report) {
    const { title, dev, description } = report;
    return this.auth.post('/reports', {title, dev, description})
      .then(({ data }) => {console.log(data)});
  }

  getList(){
    return this.auth.get('/reports')
      .then(({ data}) => data);
  }

  getReport(reportId){
    return this.auth.get('/reports/'+reportId)
      .then(({data}) => data);
  }
}

const report = new Report();

export default report