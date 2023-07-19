import React, { useEffect, useRef, useState } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
} from '@ionic/react';
import Chart, { ChartConfiguration } from 'chart.js/auto';

const ReportesAdmin: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<Chart<'pie' | 'bar' | 'doughnut' | 'polarArea' | 'radar' | 'bubble' | 'scatter', any[], any> | null>(null);
  const [chartType, setChartType] = useState<'pie' | 'bar' | 'doughnut' | 'polarArea' | 'radar' | 'bubble' | 'scatter'>('pie');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://proyectocastrogalarza.somee.com/api/ViewAdmin');
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.log('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    changeGraph();
  }, [data, chartType]);

  const changeGraph = () => {
    const selectedSector = (document.getElementById('sector') as HTMLSelectElement)?.value;

    if (!selectedSector || !data) return;

    const filteredData = data.filter((d) => d.Sector === selectedSector);

    const canvas = canvasRef.current;
    if (!canvas) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const options: ChartConfiguration<'pie' | 'bar' | 'doughnut' | 'polarArea' | 'radar' | 'bubble' | 'scatter', any[], any>['options'] = {
      responsive: true,
      maintainAspectRatio: false,
    };

    if (chartType === 'pie') {
      const newChartInstance = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: filteredData.map((d) => d.Descripcion),
          datasets: [
            {
              label: 'Cantidad Por Descripción',
              data: filteredData.map((d) => d.Cantidad),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: options,
      });

      setChartInstance(newChartInstance);
    } else if (chartType === 'bar') {
      const newChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: filteredData.map((d) => d.Descripcion),
          datasets: [
            {
              label: 'Cantidad Por Descripción',
              data: filteredData.map((d) => d.Cantidad),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: options,
      });

      setChartInstance(newChartInstance);
    } else if (chartType === 'doughnut') {
      const newChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: filteredData.map((d) => d.Descripcion),
          datasets: [
            {
              label: 'Cantidad Por Descripción',
              data: filteredData.map((d) => d.Cantidad),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: options,
      });

      setChartInstance(newChartInstance);
    } else if (chartType === 'polarArea') {
      const newChartInstance = new Chart(ctx, {
        type: 'polarArea',
        data: {
          labels: filteredData.map((d) => d.Descripcion),
          datasets: [
            {
              label: 'Cantidad Por Descripción',
              data: filteredData.map((d) => d.Cantidad),
              backgroundColor: [
                'rgba(255, 99, 132, 0.2)',
                'rgba(54, 162, 235, 0.2)',
                'rgba(255, 206, 86, 0.2)',
                'rgba(75, 192, 192, 0.2)',
                'rgba(153, 102, 255, 0.2)',
                'rgba(255, 159, 64, 0.2)',
              ],
              borderColor: [
                'rgba(255, 99, 132, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
                'rgba(153, 102, 255, 1)',
                'rgba(255, 159, 64, 1)',
              ],
              borderWidth: 1,
            },
          ],
        },
        options: options,
      });

      setChartInstance(newChartInstance);
    } else if (chartType === 'radar') {
      const newChartInstance = new Chart(ctx, {
        type: 'radar',
        data: {
          labels: filteredData.map((d) => d.Descripcion),
          datasets: [
            {
              label: 'Cantidad Por Descripción',
              data: filteredData.map((d) => d.Cantidad),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: options,
      });

      setChartInstance(newChartInstance);
    } else if (chartType === 'bubble') {
      const newChartInstance = new Chart(ctx, {
        type: 'bubble',
        data: {
          labels: filteredData.map((d) => d.Descripcion),
          datasets: [
            {
              label: 'Cantidad Por Descripción',
              data: filteredData.map((d) => ({
                x: d.Cantidad,
                y: d.Cantidad,
                r: d.Cantidad,
              })),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: options,
      });

      setChartInstance(newChartInstance);
    } else if (chartType === 'scatter') {
      const newChartInstance = new Chart(ctx, {
        type: 'scatter',
        data: {
          labels: filteredData.map((d) => d.Descripcion),
          datasets: [
            {
              label: 'Cantidad Por Descripción',
              data: filteredData.map((d) => ({
                x: d.Cantidad,
                y: d.Cantidad,
              })),
              backgroundColor: 'rgba(54, 162, 235, 0.2)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: options,
      });

      setChartInstance(newChartInstance);
    }
  };

  const handleChartTypeChange = (event: CustomEvent) => {
    setChartType(event.detail.value);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Reportes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonSelect id="sector" interface="popover" onIonChange={changeGraph}>
                <IonSelectOption value="San Bartolomé">San Bartolomé</IonSelectOption>
                <IonSelectOption value="Quisapincha">Quisapincha</IonSelectOption>
                <IonSelectOption value="Atocha">Atocha</IonSelectOption>
                <IonSelectOption value="Huachi Grande">Huachi Grande</IonSelectOption>
                <IonSelectOption value="La Matriz">La Matriz</IonSelectOption>
                <IonSelectOption value="Las Virtudes">Las Virtudes</IonSelectOption>
                <IonSelectOption value="La Merced">La Merced</IonSelectOption>
                <IonSelectOption value="La Vicentina">La Vicentina</IonSelectOption>
                <IonSelectOption value="Ingahurco">Ingahurco</IonSelectOption>
                <IonSelectOption value="Pishilata">Pishilata</IonSelectOption>
                <IonSelectOption value="Santa Rosa">Santa Rosa</IonSelectOption>
                <IonSelectOption value="La Pradera">La Pradera</IonSelectOption>
                <IonSelectOption value="Pinllo">Pinllo</IonSelectOption>
                <IonSelectOption value="Quinta Chica">Quinta Chica</IonSelectOption>
                <IonSelectOption value="Santa Clara">Santa Clara</IonSelectOption>
                <IonSelectOption value="Unamuncho">Unamuncho</IonSelectOption>
                <IonSelectOption value="Montalvo">Montalvo</IonSelectOption>
                <IonSelectOption value="Atahualpa">Atahualpa</IonSelectOption>
              </IonSelect>
            </IonCol>
            <IonCol>
              <IonSelect value={chartType} onIonChange={handleChartTypeChange}>
                <IonSelectOption value="pie">Pie Chart</IonSelectOption>
                <IonSelectOption value="bar">Bar Chart</IonSelectOption>
                <IonSelectOption value="doughnut">Doughnut Chart</IonSelectOption>
                <IonSelectOption value="polarArea">Polar Area Chart</IonSelectOption>
                <IonSelectOption value="radar">Radar Chart</IonSelectOption>
                <IonSelectOption value="bubble">Bubble Chart</IonSelectOption>
                <IonSelectOption value="scatter">Scatter Chart</IonSelectOption>
              </IonSelect>
            </IonCol>
          </IonRow>
        </IonGrid>
        <IonCard>
          <IonCardContent>
            <div id="grafica">
              <canvas ref={canvasRef} width={400} height={300}></canvas>
            </div>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default ReportesAdmin;
