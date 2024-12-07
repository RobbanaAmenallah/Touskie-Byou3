import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import "./Css/UserStatistics.css";

// Enregistrement des éléments nécessaires de Chart.js
ChartJS.register(BarElement, CategoryScale, LinearScale);

function UserStatistics() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) throw new Error("Utilisateur non authentifié");

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const response = await axios.get(
          "http://localhost:4000/announcement/user/statistics",
          config
        );
        setStats(response.data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Erreur lors de la récupération des statistiques."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return <div className="loading">Chargement des statistiques...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (
    !stats ||
    (stats.announcementCount === 0 &&
      stats.totalQuantity === 0 &&
      stats.totalRevenue === 0)
  ) {
    return (
      <div className="no-stats">
        <h2>Pas de statistiques disponibles</h2>
        <p>Vous n'avez encore créé aucune annonce.</p>
      </div>
    );
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <div className="stats-container">
      <h2 className="title">Statistiques utilisateur</h2>
      <div className="charts-container">
        {/* Graphique pour le nombre d'annonces */}
        <div className="chart-box">
          <h3 className="chart-title">Nombre d'annonces</h3>
          <Bar
            data={{
              labels: ["Nombre d'annonces"],
              datasets: [
                {
                  label: "Nombre d'annonces",
                  data: [stats.announcementCount],
                  backgroundColor: ["#4CAF50"],
                },
              ],
            }}
            options={options}
          />
        </div>

        {/* Graphique pour la quantité totale */}
        <div className="chart-box">
          <h3 className="chart-title">Quantité totale</h3>
          <Bar
            data={{
              labels: ["Quantité totale"],
              datasets: [
                {
                  label: "Quantité totale",
                  data: [stats.totalQuantity],
                  backgroundColor: ["#2196F3"],
                },
              ],
            }}
            options={options}
          />
        </div>

        {/* Graphique pour les revenus totaux */}
        <div className="chart-box">
          <h3 className="chart-title">Revenus totaux (DT)</h3>
          <Bar
            data={{
              labels: ["Revenus totaux (DT)"],
              datasets: [
                {
                  label: "Revenus totaux (DT)",
                  data: [stats.totalRevenue],
                  backgroundColor: ["#FF5722"],
                },
              ],
            }}
            options={options}
          />
        </div>
      </div>
    </div>
  );
}

export default UserStatistics;
