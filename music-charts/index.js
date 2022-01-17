const getCharts = () => {
  const urls = [
    {
      url: "https://billboard-api2.p.rapidapi.com/hot-100?range=1-10&date=2019-05-11",
      name: "billboard",
    },
  ];

  urls.forEach((elem) => getChart(elem));
};

const getChart = async ({ url, name }) => {
  const data = await fetch(url, {
    method: "GET",
    headers: {
      "x-rapidapi-host": "billboard-api2.p.rapidapi.com",
      "x-rapidapi-key": "SIGN-UP-FOR-KEY",
    },
  });
  const chartData = await data.json();

  console.log(chartData);
};

getCharts();
