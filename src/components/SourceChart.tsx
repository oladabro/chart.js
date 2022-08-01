import { Grid, Card, CardHeader, CardContent, Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import ReactDOM from "react-dom";
import useGetFakeData from "../hooks/useGetFakeData";

declare interface IParsedObject {
  datasets: unknown[];
  labels: string[];
}

const colorsObj = {
  pear: "#94cc04",
  apple: "#d43c3c",
  strawberry: "#ec5c44",
  cherry: "#ac243c",
  plum: "#7b639b",
};

const labels = {
  pear: "pear",
  apple: "apple",
  strawberry: "strawberry",
  cherry: "cherry",
  plum: "plum",
};

const generateRandomColor = () => {
  const randomColors = ["#4c7256", "#753577", "#964584", "#298d8d", "#519171"];

  return randomColors[Math.floor(Math.random() * randomColors.length)];
};

const SourceChart = (): JSX.Element => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);

  const [globalChart, setGlobalChart] = useState<any>(null);

  const getFakeDataQuery = useGetFakeData();

  const parseData = (data: any) => {
    console.log(data);
    const lablesArray = Object.keys(data).map(
      (key: string) => labels[key as keyof typeof labels] || key
    );

    const colorsArray = lablesArray.map(
      (label) =>
        colorsObj[label as keyof typeof labels] || generateRandomColor()
    );

    const formattedData = {
      labels: lablesArray,
      datasets: [
        {
          data: Object.values(data),
          backgroundColor: colorsArray,
          hoverOffset: 3,
        },
      ],
    };

    return formattedData;
  };

  const generateChart = (data: any): void => {
    if (chartRef.current) {
      const ctx = chartRef.current?.getContext("2d") as any;
      setGlobalChart(
        new Chart(ctx, {
          type: "doughnut",
          data: data,
          options: {
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
            },
          },
        })
      );
    }
  };

  const updateChart = (dataset: any) => {
    if (!globalChart) return;
    globalChart.data = dataset;
    setTimeout(() => {
      globalChart.update();
    }, 100);
  };

  const getIconForChart = (source: string) => {
    return (
      <>
        {colorsObj[source as keyof typeof labels] && (
          <Grid
            item
            width="25px"
            display="flex"
            margin="0 auto"
            sx={{ cursor: "pointer" }}
          >
            <img
              className="round"
              src={`/images/${source}.png`}
              alt={source}
              width={35}
              height={35}
            />
          </Grid>
        )}
        <Grid
          item
          textAlign="center"
          fontSize="14px"
          fontWeight="600"
          sx={{ cursor: "pointer" }}
        >
          {source.toUpperCase()}
        </Grid>
      </>
    );
  };

  const updateDataset = (index: number, elementsToStyle: HTMLDivElement) => {
    const color = elementsToStyle.dataset.color;

    globalChart.toggleDataVisibility(index);
    globalChart.update();
    if (elementsToStyle.style.cssText === `text-decoration: line-through;`) {
      elementsToStyle.style.cssText = `text-decoration: none; color: ${color}`;
    } else {
      elementsToStyle.style.cssText = `text-decoration: line-through`;
    }
  };

  const generateLegend = (chart: any, container: any) => {
    console.log(chart.data);
    chart.data?.labels.forEach((ds: string, index: number) => {
      if (!ds) return;

      const bgColor = `${chart.data.datasets[0].backgroundColor[index]}`;

      const border = `1px solid ${bgColor}`;

      const li = document.createElement("div");
      li.dataset.label = ds;
      li.style.marginBottom = "10px";
      li.style.width = "100%";

      const symbolSpan = document.createElement("div");
      if (!Object.keys(colorsObj).includes(ds) || ds === "direct") {
        symbolSpan.style.cssText = `display: block; margin: 0 auto; cursor: pointer; width: 25px; height: 25px; background-color: ${bgColor}; border: ${border};`;
        li.appendChild(symbolSpan);
      }

      const imageWrapper = document.createElement("div");
      imageWrapper.dataset.color = `${bgColor}`;
      ReactDOM.render(getIconForChart(ds), imageWrapper);
      imageWrapper.style.cssText = `color: ${bgColor}`;

      symbolSpan.onclick = () => updateDataset(index, imageWrapper);
      imageWrapper.onclick = () => updateDataset(index, imageWrapper);

      li.appendChild(imageWrapper);
      container.appendChild(li);
    });
  };

  useEffect(() => {
    if (!globalChart) return;
    generateLegend(globalChart, document.getElementById("chart_legend_circle"));
  }, [globalChart]);

  useEffect(() => {
    if (!getFakeDataQuery.data) return;

    const parsedData: IParsedObject = parseData(getFakeDataQuery.data?.data);

    if (globalChart === null) {
      generateChart(parsedData);
    } else {
      updateChart(parsedData);
    }
  }, [getFakeDataQuery.data]);

  return (
    <Card sx={{ height: "100%", width: "50%", margin: "0 auto" }} raised>
      <CardHeader
        title="My son's favourite fruits"
        titleTypographyProps={{ variant: "h6" }}
      />
      <CardContent>
        <Grid container justifyContent="center" spacing={2}>
          <>
            {getFakeDataQuery.isError && (
              <Typography>Problem fetching data</Typography>
            )}
            <Grid container width="300px" alignItems="center">
              <canvas
                ref={chartRef}
                aria-roledescription="image"
                aria-label="ShareLink stats"
                height="300px"
                width="300px"
              ></canvas>
            </Grid>
            <Grid item id="chart_legend_circle" />
          </>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default SourceChart;
