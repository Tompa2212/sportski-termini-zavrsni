import React from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ChartOptions,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import styled from 'styled-components';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface SportChartProps {
  name: string;
  won: number;
  lost: number;
  played: number;
}

export const SportChart: React.FC<SportChartProps> = React.memo(
  ({ name, won, lost, played }) => {
    const data = {
      labels: ['Pobjede', 'Porazi'],
      datasets: [
        {
          data: [won, lost],
          backgroundColor: ['rgb(28, 155, 28)', 'rgb(235, 87, 87)'],
        },
      ],
    };

    const options: ChartOptions<'pie'> = {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: name,
          align: 'center',
          padding: {
            bottom: 10,
          },
          font: {
            size: 20,
          },
        },
        legend: {
          display: true,
          position: 'top',
        },
      },
    };

    return (
      <div>
        <Pie data={data} updateMode="resize" options={options} />
        <DataFooter>
          <div>
            UKUPNO: <span className="bold">{played}</span>
          </div>
          <div className="bold highlight">
            <span className="clr--green">{won}</span> /
            <span className="clr--red"> {lost}</span>
          </div>
        </DataFooter>
      </div>
    );
  }
);

const DataFooter = styled.footer`
  margin-top: 1rem;
  text-align: center;

  div {
    padding: 0.3rem;
    border-top: 1px solid var(--gray-light);
  }

  .highlight {
    font-size: 1.4rem;
  }
`;
