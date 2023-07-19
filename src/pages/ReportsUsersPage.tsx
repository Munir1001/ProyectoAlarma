import React, { useEffect, useRef, useState, useContext } from 'react';
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonSelectOption,
  IonSelect,
} from '@ionic/react';
import Chart, { ChartConfiguration } from 'chart.js/auto';
import { UserContext } from './UserContext';

interface Usuario {
  Cedula: string;
  Nombre: string;
  Apellido: string;
  Latitud: number;
  Longitud: number;
  Sector: string;
  Telefono?: string;
  CallePrincipal?: string;
  CalleSecundaria?: string;
}

const ReportesUsuarios: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [descriptions, setDescriptions] = useState<string[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { usuarioActual } = useContext(UserContext);
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

    const fetchDescriptions = async () => {
      try {
        const response = await fetch('http://proyectocastrogalarza.somee.com/api/Descripciones');
        const jsonDescriptions = await response.json();
        const descriptionOptions = jsonDescriptions.map((desc: any) => desc.Descripcion);
        setDescriptions(descriptionOptions);
      } catch (error) {
        console.log('Error al obtener las descripciones:', error);
      }
    };

    fetchDescriptions();
  }, []);

  

  const changeGraph = (selectedDescription: string) => {
    if (!selectedDescription) {
      console.log('No description selected.');
      return;
    }

    if (!usuarioActual) {
      console.log('No user data available.');
      return;
    }
  
    const filteredData = data.filter((d) => d.Sector === usuarioActual.Sector);
  
    if (filteredData.length === 0) {
      console.log(`No data available for sector: ${usuarioActual.Sector}`);
      return;
    }

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
          labels: filteredData.map((d) => d.Sector),
          datasets: [
            {
              label: 'Cantidad de Alarmas',
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
          labels: filteredData.map((d) => d.Sector),
          datasets: [
            {
              label: 'Cantidad de Alarmas',
              data: filteredData.map((d) => d.Cantidad),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
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
          labels: filteredData.map((d) => d.Sector),
          datasets: [
            {
              label: 'Cantidad de Alarmas',
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
          labels: filteredData.map((d) => d.Sector),
          datasets: [
            {
              label: 'Cantidad de Alarmas',
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
          labels: filteredData.map((d) => d.Sector),
          datasets: [
            {
              label: 'Cantidad de Alarmas',
              data: filteredData.map((d) => d.Cantidad),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
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
          labels: filteredData.map((d) => d.Sector),
          datasets: [
            {
              label: 'Cantidad de Alarmas',
              data: filteredData.map((d) => ({ x: d.Cantidad, y: d.Cantidad, r: d.Cantidad })),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
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
          labels: filteredData.map((d) => d.Sector),
          datasets: [
            {
              label: 'Cantidad de Alarmas',
              data: filteredData.map((d) => ({ x: d.Cantidad, y: d.Cantidad })),
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
          ],
        },
        options: options,
      });

      setChartInstance(newChartInstance);
    }
  };

  const handleChartTypeChange = (event: any) => {
    setChartType(event.detail.value);
  };


  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Reportes</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonSelect
                value={usuarioActual?.Sector}
                placeholder="Seleccionar Descripción"
                onIonChange={(e) => changeGraph(e.detail.value)}
              >
                {descriptions.map((desc) => (
                  <IonSelectOption key={desc} value={desc}>
                    {desc}
                  </IonSelectOption>
                ))}
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

export default ReportesUsuarios;
