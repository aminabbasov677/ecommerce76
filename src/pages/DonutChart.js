import { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const DonutChart = () => {
  const svgRef = useRef();

  useEffect(() => {
    // Sample data (replace with localStorage data)
    const data = [
      { label: 'View', value: 300 },
      { label: 'Cart', value: 120 },
      { label: 'Checkout', value: 60 },
    ];

    const width = 500;
    const height = 400;
    const radius = Math.min(width, height) / 2 - 50;

    const svg = d3
      .select(svgRef.current)
      .attr('width', width)
      .attr('height', height)
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    const arc = d3
      .arc()
      .innerRadius(radius * 0.6)
      .outerRadius(radius);

    const pie = d3
      .pie()
      .value((d) => d.value)
      .sort(null);

    const colors = ['#00ffc3', '#ff00ff', '#00d1ff'];

    // Clear previous content
    svg.selectAll('*').remove();

    // Draw donut
    svg
      .selectAll('path')
      .data(pie(data))
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', (d, i) => colors[i])
      .attr('class', 'arc')
      .transition()
      .duration(2000)
      .ease(d3.easeCubic)
      .attrTween('d', function (d) {
        const i = d3.interpolate({ startAngle: 0, endAngle: 0 }, d);
        return (t) => arc(i(t));
      });

    // Add labels
    svg
      .selectAll('text')
      .data(pie(data))
      .enter()
      .append('text')
      .attr('transform', (d) => `translate(${arc.centroid(d)})`)
      .attr('dy', '0.35em')
      .style('text-anchor', 'middle')
      .style('fill', '#00d1ff')
      .style('font-family', 'Orbitron, sans-serif')
      .text((d) => d.data.label);
  }, []);

  return (
    <div className="chart-wrapper">
      <svg ref={svgRef} className="chart"></svg>
    </div>
  );
};

export default DonutChart;