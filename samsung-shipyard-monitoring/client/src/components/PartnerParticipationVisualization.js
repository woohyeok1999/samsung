import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

const PartnerParticipationVisualization = ({ data, designType }) => {
  const svgRef = useRef();

  useEffect(() => {
    if (!data || data.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 800;
    const height = 450;
    const margin = { top: 100, right: 30, bottom: 80, left: 60 };
    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`)
       .attr('preserveAspectRatio', 'xMidYMid meet');

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // dpbom_details 순서 정의
    const structureOrder = ['가공', '공작', '족장', '의장', '재마킹', '철의장', '도장'];
    const outfittingOrder = ['계획', '목의', 'Supp 제작', '제작', '의장', '의장(설치)', '철의장'];
    const order = designType === 'structure' ? structureOrder : outfittingOrder;

    // 데이터 구조화 및 partner_code가 가장 많은 dpbom_details 찾기
    const nestedData = Array.from(d3.group(data, d => d.dpbom_details), ([key, value]) => ({ key, value }));
    const maxPartnerCount = Math.max(...nestedData.map(d => d.value.length));
    
    // X 축 (dpbom_details)
    const x0 = d3.scaleBand()
      .domain(order.filter(d => nestedData.some(nd => nd.key === d)))
      .rangeRound([0, graphWidth])
      .paddingInner(0.1);

    // X 축 (partner_code)
    const x1 = d3.scaleBand()
      .domain(d3.range(maxPartnerCount))
      .rangeRound([0, x0.bandwidth()])
      .padding(0.05);

    // Y 축 (작업 비율)
    const y = d3.scaleLinear()
      .domain([0, 100])
      .range([graphHeight, 0]);

    // 색상 스케일 (회색 그라데이션)
    const color = d3.scaleLinear()
      .domain([0, 100])
      .range(['#cccccc', '#666666']);

    // X 축 그리기
    g.append("g")
      .attr("class", "axis")
      .attr("transform", `translate(0,${graphHeight})`)
      .call(d3.axisBottom(x0))
      .selectAll("text")  
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-45)");

    // X 축 제목
    g.append("text")
      .attr("transform", `translate(${graphWidth/2},${graphHeight + margin.bottom - 10})`)
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("D/P&BOM 내역");

    // Y 축 그리기
    g.append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y).ticks(null, "s"));

    // Y 축 제목
    g.append("text")
      .attr("transform", "rotate(-90)")  // This rotates the text
      .attr("y", 0 - margin.left + 15)   // Adjust y to place the label correctly
      .attr("x", 0 - (graphHeight / 2))  // Center the label along the y-axis
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "12px")
      .text("작업 비율(%)");

    // 막대 그래프 그리기
    const dpbomGroup = g.selectAll(".dpbom-group")
      .data(nestedData.sort((a, b) => order.indexOf(a.key) - order.indexOf(b.key)))
      .enter().append("g")
      .attr("class", "dpbom-group")
      .attr("transform", d => `translate(${x0(d.key)},0)`);

    dpbomGroup.each(function(d) {
      const element = d3.select(this);
      const dpbomData = d.value.sort((a, b) => b.work_percentage - a.work_percentage);
      
      const centerOffset = (maxPartnerCount - dpbomData.length) / 2 * x1.bandwidth();

      element.selectAll(".bar")
        .data(dpbomData)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", (d, i) => x1(i) + centerOffset)
        .attr("y", d => y(d.work_percentage))
        .attr("width", x1.bandwidth())
        .attr("height", d => graphHeight - y(d.work_percentage))
        .attr("fill", (d, i) => i === 0 ? '#36A2EB' : color(d.work_percentage));

      // 레이블 추가
      element.selectAll(".bar-text")
        .data(dpbomData)
        .enter().append("text")
        .attr("class", "bar-text")
        .attr("x", (d, i) => x1(i) + x1.bandwidth() / 2 + centerOffset)
        .attr("y", (d, i) => i === 0 ? y(d.work_percentage) - 10 : y(d.work_percentage) - 5)
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .each(function(d, i) {
          const text = d3.select(this);
          if (i === 0) {
            text.append("tspan")
              .attr("x", (d, i) => x1(i) + x1.bandwidth() / 2 + centerOffset)
              .attr("dy", "-1.2em")
              .text(d => d.partner_code);
            text.append("tspan")
              .attr("x", (d, i) => x1(i) + x1.bandwidth() / 2 + centerOffset)
              .attr("dy", "1.2em")
              .text(d => `${d.work_percentage.toFixed(1)}%`);
          } else {
            text.text(d => d.partner_code);
          }
        });
    });

    // 제목 추가
    svg.append("text")
      .attr("x", width / 2)
      .attr("y", 30)
      .attr("text-anchor", "middle")
      .style("font-size", "13px")
      .style("font-weight", "bold")
      .text("D/P&BOM 내역별 협력사 참여 비중");

  }, [data, designType]);

  return (
    <div style={{width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
      <svg ref={svgRef} style={{width: '100%', height: '100%', background: 'white'}} />
    </div>
  );
};

export default PartnerParticipationVisualization;
