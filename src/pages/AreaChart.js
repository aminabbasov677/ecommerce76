import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const AreaChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    // Sample data (replace with localStorage data)
    const data = [
      { date: '2025-05-23', avg: 300 },
      { date: '2025-05-24', avg: 320 },
      { date: '2025-05-25', avg: 280 },
      { date: '2025-05-26', avg: 350 },
      { date: '2025-05-27', avg: 310 },
      { date: '2025-05-28', avg: 330 },
      { date: '2025-05-29', avg: 340 },
    ];

    const width = 500;
    const height = 400;
    const margin = { top: 20, right: 20, bottom: 50, left: 50 };

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'visible');

    const x = d3
      .scaleBand()
      .domain(data.map((d) => d.date))
      .range([margin.left, width - margin.right])
      .padding(0.1);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(data, (d) => d.avg) * 1.2])
      .range([height - margin.bottom, margin.top]);

    const area = d3
      .area()
      .x((d) => x(d.date) + x.bandwidth() / 2)
      .y0(height - margin.bottom)
      .y1((d) => y(d.avg))
      .curve(d3.curveCatmullRom);

    // Clear previous content
    svg.selectAll('*').remove();

    // Add area
    svg
      .append('path')
      .datum(data)
      .attr('fill', 'rgba(0, 255, 195, 0.5)')
      .attr('d', area)
      .attr('class', 'area');

    // Add axes
    svg
      .append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('fill', '#00d1ff')
      .style('font-family', 'Orbitron, sans-serif');

    svg
      .append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(y))
      .selectAll('text')
      .style('fill', '#00d1ff')
      .style('font-family', 'Orbitron, sans-serif');

    // Initial animation
    svg
      .select('.area')
      .transition()
      .duration(2000)
      .ease(d3.easeCubic)
      .attrTween('d', () => {
        const interpolator = d3.interpolateArray(
          data.map((d) => ({ date: d.date, avg: 0 })),
          data
        );
        return (t) => area(interpolator(t));
      });
  }, []);

  return (
    <div className="chart-wrapper">
      <svg ref={svgRef} className="chart"></svg>
    </div>
  );
};

export default AreaChart;