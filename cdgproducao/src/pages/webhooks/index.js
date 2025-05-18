// filepath: c:\Users\Arthur Reis\Documents\CDGPRODUCAOFRONT\cdgproducao\src\pages\webhooks\index.js
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MainLayout from "../../components/MainLayout";
import Table from "../../components/Table";
import Card, { CardHeader, CardTitle } from "../../components/Card";
import api from "../../services/api";

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  margin: 0;
`;

const BadgeContainer = styled.div`
  display: inline-block;
`;

const StatusBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  border-radius: 1rem;
  text-transform: uppercase;
  background-color: ${({ status, theme }) => {
    switch (status) {
      case "active":
        return theme.colors.success + "20";
      case "inactive":
        return theme.colors.secondary + "20";
      case "error":
        return theme.colors.danger + "20";
      default:
        return theme.colors.info + "20";
    }
  }};
  color: ${({ status, theme }) => {
    switch (status) {
      case "active":
        return theme.colors.success;
      case "inactive":
        return theme.colors.secondary;
      case "error":
        return theme.colors.danger;
      default:
        return theme.colors.info;
    }
  }};
`;

const WebhookList = () => {
  const [webhooks, setWebhooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWebhooks();
  }, []);
  
  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      // Buscamos os dados diretamente da API sem transformações
      const response = await api.get("/webhooks/pedidos/");
      console.log("Dados recebidos da API:", response.data);
      
      // Usamos os dados exatamente como vêm da API
      setWebhooks(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar webhooks:", error);
      console.error("Detalhes do erro:", error.response?.data || error.message);
      setLoading(false);
    }
  };

  const columns = [
    { header: "Nº Pedido", accessor: "numero_pedido" },
    { header: "SKU", accessor: "sku" },
    { 
      header: "Data Emissão", 
      accessor: "criado_em",
      render: (row) => {
        if (!row.criado_em) return "-";
        const date = new Date(row.criado_em);
        return date.toLocaleDateString("pt-BR");
      }
    },
    { header: "Método de Envio", accessor: "metodo_envio" },
    { 
      header: "Situação", 
      accessor: "status_nome",
      render: (row) => (
        <BadgeContainer>
          <StatusBadge status={
            row.status_nome === "Pedido Novo" ? "active" : 
            row.status_nome === "Erro" ? "error" : "inactive"
          }>
            {row.status_nome || "-"}
          </StatusBadge>
        </BadgeContainer>
      )
    }
  ];

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>Listagem de Pedidos</PageTitle>
      </PageHeader>

      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recebidos</CardTitle>
        </CardHeader>
        {loading ? (
          <div style={{ padding: "1rem" }}>Carregando...</div>
        ) : (
          <Table columns={columns} data={webhooks} />
        )}
      </Card>
    </MainLayout>
  );
};

export default WebhookList;
