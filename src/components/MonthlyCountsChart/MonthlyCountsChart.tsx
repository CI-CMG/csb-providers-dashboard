import "./styles.css"
import * as Plot from "@observablehq/plot"
import { useRef, useEffect } from "react"

type AppProps = {
    data: Array<{label:string, count: number}>
}


export default function BarChart({ data }: AppProps ) {
  const plotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!plotRef.current) { return }
    const barChart = Plot.plot({
        width: 1200,
        x: {
            tickRotate: -30,
            label: null,
            ticks: data.map((elem) => elem.label).filter((_, idx) => idx % 12 === 0) 
          },
      marks: [
        Plot.barY(data, {
          x: "label",
          y: "count",          
        })
      ],
      y: {
        label: 'Soundings (millions)',
        grid: true,
        tickFormat: (i)=>i/1000000
      },
      marginTop: 50,
      marginBottom: 50,
      marginLeft: 50,    
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

