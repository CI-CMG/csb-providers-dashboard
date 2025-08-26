import "./styles.css"
import * as Plot from "@observablehq/plot"
import { useRef, useEffect } from "react"
import { timeMonth } from "d3-time"

type AppProps = {
    data: Array<{label:string, month: Date, count: number}>
    yAxisLabel: string
    yTickFunction: (i:number) => number
}


export default function BarChart({ data, yAxisLabel, yTickFunction }: AppProps ) {
  const plotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!plotRef.current) { return }
    const barChart = Plot.plot({
        // caption: 'Sounding Counts by Submission Date',
        width: 1000,
        x: {
            tickRotate: -30,
            label: null,
            // remove tick marks which aligned to the right of the bar rather than center
            tickSize: 0
            // ticks: data.map((elem) => elem.month.getUTCMonth()).filter((m) => m === 0) ,
            // ticks: data.map((elem) => elem.label).filter((_, idx) => idx % 12 === 0) ,
            // following supresses a warning about using strings rather than dates for month
            // type: 'band'

          },
      y: {
        label: yAxisLabel,
        grid: true,
        tickFormat: yTickFunction
      },
      marginTop: 50,
      marginBottom: 50,
      marginLeft: 50,
      marks: [
        Plot.rectY(data, {
          x: "month",
          y: "count",
          interval: timeMonth
        }),
        Plot.text(["Sounding Counts by Submission Date"], {
      frameAnchor: "top",
      dy: -30,
      fontSize: 16,
      fontWeight: "bold",
      lineAnchor: "bottom",
      text: (d) => d
    })
      ]
      // marks: [
      //   Plot.barY(data, {
      //     x: "label",
      //     y: "count",          
      //   })
      // ],
    });

    plotRef.current.append(barChart);
    return () => barChart.remove();
  }, [data]);

  return (
    <>
      <div style={{width:'100%'}} ref={plotRef}></div>
    </>
  );
}

