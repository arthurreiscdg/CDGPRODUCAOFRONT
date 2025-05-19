import React, { useState, useEffect } from "react";
import styled from "styled-components";
import MainLayout from "../../components/MainLayout";
import Table from "../../components/Table";
import Card, { CardHeader, CardTitle } from "../../components/Card";
import api from "../../services/api";
import { Button, Modal, Form, Row, Col } from "react-bootstrap";
import { formatCurrency } from "../../utils/format";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter, faTimes } from '@fortawesome/free-solid-svg-icons';

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
  background-color: ${({ bgColor }) => bgColor || "#e0e0e0"};
  color: ${({ color }) => color || "#333"};
`;

const DetailRow = styled.div`
  display: flex;
  margin-bottom: 0.75rem;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 0.75rem;
  
  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.div`
  font-weight: 600;
  width: 30%;
  color: #666;
`;

const DetailValue = styled.div`
  width: 70%;
  word-break: break-word;
`;

const DetailSection = styled.div`
  margin-bottom: 1.5rem;
  
  h5 {
    border-bottom: 2px solid #f0f0f0;
    padding-bottom: 0.5rem;
    margin-bottom: 1rem;
    color: #333;
  }
`;

const ViewButton = styled(Button)`
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
  margin-right: 0.25rem;
`;

const StatusButton = styled(Button)`
  padding: 0.25rem 0.5rem;
  font-size: 0.8rem;
`;

const BatchActionBar = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #f8f9fa;
  border-bottom: 1px solid #dee2e6;
  gap: 0.5rem;
  
  select {
    max-width: 200px;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 0.25rem;
`;

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ImagePreview = styled.img`
  max-width: 100%;
  max-height: 200px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-top: 0.5rem;
`;

const FilterContainer = styled.div`
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 4px;
  margin-bottom: 1rem;
  padding: 1rem;
`;

const FilterHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${({ expanded }) => expanded ? '1rem' : '0'};
  cursor: pointer;
`;

const FilterTitle = styled.h5`
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterBody = styled.div`
  display: ${({ show }) => show ? 'block' : 'none'};
`;

const FilterRow = styled(Row)`
  margin-bottom: 1rem;
`;

const FilterActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const FilterBadge = styled.span`
  display: inline-block;
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  border-radius: 1rem;
  background-color: #007bff;
  color: white;
  margin-left: 0.5rem;
`;

const ActiveFilterBadge = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
  margin-bottom: 0.5rem;
  background-color: #e9f5ff;
  color: #0066cc;
  border: 1px solid #b3d7ff;
  border-radius: 1rem;
  font-size: 0.75rem;

  .close {
    margin-left: 0.5rem;
    cursor: pointer;
    font-weight: bold;
  }
`;

const ActiveFiltersContainer = styled.div`
  margin-bottom: 1rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .title {
    font-weight: 600;
    margin-right: 0.5rem;
    color: #666;
  }
`;

const WebhookList = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedPedido, setSelectedPedido] = useState(null);
  const [statusList, setStatusList] = useState([]);
  const [selectedPedidos, setSelectedPedidos] = useState([]);
  const [selectedStatusBatch, setSelectedStatusBatch] = useState("");
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  
  // Estados para os filtros
  const [filters, setFilters] = useState({
    status: "",
    sku: "",
    numero_pedido: "",
    data_especifica: "",
    data_inicio: "",
    data_fim: ""
  });
  const [showFilters, setShowFilters] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState(false);

  useEffect(() => {
    fetchPedidos({});
    fetchStatusList();
  }, []);
  
  const fetchPedidos = async (filterParams = {}) => {
    try {
      setLoading(true);
      
      // Construir os parâmetros de consulta para a API
      const queryParams = new URLSearchParams();
      
      // Adiciona os filtros aos parâmetros da consulta
      if (filterParams.status) queryParams.append('status', filterParams.status);
      if (filterParams.sku) queryParams.append('sku', filterParams.sku);
      if (filterParams.numero_pedido) queryParams.append('numero_pedido', filterParams.numero_pedido);
      if (filterParams.data_especifica) {
        // Se data específica estiver preenchida, usar o mesmo valor para início e fim
        const formattedDate = formatDateForAPI(filterParams.data_especifica);
        queryParams.append('data_inicio', formattedDate);
        queryParams.append('data_fim', formattedDate);
      } else {
        // Caso contrário, usar o intervalo de datas, se fornecido
        if (filterParams.data_inicio) queryParams.append('data_inicio', formatDateForAPI(filterParams.data_inicio));
        if (filterParams.data_fim) queryParams.append('data_fim', formatDateForAPI(filterParams.data_fim));
      }
      
      const url = queryParams.toString() 
        ? `/webhooks/pedidos/?${queryParams.toString()}` 
        : "/webhooks/pedidos/";
        
      const response = await api.get(url);
      console.log("Dados recebidos da API:", response.data);
      setPedidos(response.data.results);
      setLoading(false);
    } catch (error) {
      console.error("Erro ao buscar pedidos:", error);
      console.error("Detalhes do erro:", error.response?.data || error.message);
      setLoading(false);
    }
  };
  
  // Busca a lista de status disponíveis
  const fetchStatusList = async () => {
    try {
      const response = await api.get("/webhooks/pedidos/status/");
      setStatusList(response.data);
    } catch (error) {
      console.error("Erro ao buscar lista de status:", error);
    }
  };
  
  // Atualiza o status de um único pedido
  const updatePedidoStatus = async (pedidoId, statusId) => {
    try {
      setStatusUpdateLoading(true);
      await api.patch(`/webhooks/pedidos/${pedidoId}/status/`, {
        status_id: statusId
      });
      // Atualiza a lista de pedidos após a alteração, mantendo os filtros aplicados
      await fetchPedidos(appliedFilters ? filters : {});
      setStatusUpdateLoading(false);
      return true;
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      setStatusUpdateLoading(false);
      return false;
    }
  };
  
  // Atualiza o status de múltiplos pedidos em lote
  const updatePedidosBatchStatus = async () => {
    if (selectedPedidos.length === 0 || !selectedStatusBatch) {
      alert("Selecione pelo menos um pedido e um status para continuar.");
      return;
    }
    
    try {
      setStatusUpdateLoading(true);
      const response = await api.post("/webhooks/pedidos/status/lote/", {
        pedido_ids: selectedPedidos,
        status_id: selectedStatusBatch
      });
      
      if (response.data.sucesso) {
        alert(`${response.data.atualizados} pedidos atualizados com sucesso.`);
        // Limpa seleções e atualiza lista, mantendo os filtros aplicados
        setSelectedPedidos([]);
        setSelectedStatusBatch("");
        setShowStatusModal(false);
        await fetchPedidos(appliedFilters ? filters : {});
      } else {
        alert(`Erro: ${response.data.mensagem}`);
      }
      
      setStatusUpdateLoading(false);
    } catch (error) {
      console.error("Erro ao atualizar status em lote:", error);
      alert("Erro ao atualizar status dos pedidos.");
      setStatusUpdateLoading(false);
    }
  };

  // Estado para controlar se os detalhes completos foram carregados
  const [detailsLoading, setDetailsLoading] = useState(false);

  // Primeiro apenas abre o modal com os dados básicos já carregados
  const handleViewDetails = (pedido) => {
    // Inicialmente, usamos apenas os dados que já temos
    setSelectedPedido(pedido);
    setShowModal(true);
    
    // Depois carregamos os detalhes completos em segundo plano
    loadFullDetails(pedido.id);
  };
  
  // Função para carregar detalhes completos somente quando necessário
  const loadFullDetails = async (id) => {
    try {
      setDetailsLoading(true);
      const response = await api.get(`/webhooks/pedidos/${id}/`);
      setSelectedPedido(response.data);
      setDetailsLoading(false);
    } catch (error) {
      console.error("Erro ao buscar detalhes completos do pedido:", error);
      setDetailsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPedido(null);
  };
  
  // Função para manipular seleção de checkboxes
  const handleSelectPedido = (pedidoId) => {
    setSelectedPedidos(prev => {
      if (prev.includes(pedidoId)) {
        return prev.filter(id => id !== pedidoId);
      } else {
        return [...prev, pedidoId];
      }
    });
  };
  
  // Função para selecionar/deselecionar todos os pedidos
  const handleSelectAll = () => {
    if (selectedPedidos.length === pedidos.length) {
      setSelectedPedidos([]);
    } else {
      setSelectedPedidos(pedidos.map(p => p.id));
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) {
      return "-";
    }
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR") + " " + date.toLocaleTimeString("pt-BR");
  };

  // Função para formatar data para a API (formato YYYY-MM-DD)
  const formatDateForAPI = (dateString) => {
    if (!dateString) return "";
    
    // Se já estiver no formato YYYY-MM-DD, retorna como está
    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return dateString;
    }
    
    // Converte de DD/MM/YYYY para YYYY-MM-DD
    const parts = dateString.split('/');
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    
    // Tenta converter de formato de data para YYYY-MM-DD
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (e) {
      console.error("Erro ao converter data:", e);
      return dateString;
    }
  };

  // Função para manipular alterações nos filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    // Limpa o outro campo de data se estiver manipulando um campo de data específica
    if (name === 'data_especifica' && value) {
      setFilters(prev => ({
        ...prev,
        [name]: value,
        data_inicio: "",
        data_fim: ""
      }));
    } 
    // Limpa o campo de data específica se estiver manipulando um intervalo de datas
    else if ((name === 'data_inicio' || name === 'data_fim') && value) {
      setFilters(prev => ({
        ...prev,
        [name]: value,
        data_especifica: ""
      }));
    } 
    // Caso contrário, apenas atualiza o campo normalmente
    else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Função para aplicar os filtros
  const applyFilters = () => {
    fetchPedidos(filters);
    setAppliedFilters(true);
  };

  // Função para limpar todos os filtros
  const clearFilters = () => {
    setFilters({
      status: "",
      sku: "",
      numero_pedido: "",
      data_especifica: "",
      data_inicio: "",
      data_fim: ""
    });
    fetchPedidos({});
    setAppliedFilters(false);
  };

  // Função para obter o nome de um status pelo ID
  const getStatusNameById = (statusId) => {
    const status = statusList.find(s => s.id.toString() === statusId.toString());
    return status ? status.nome : "Status Desconhecido";
  };

  // Renderiza os filtros ativos
  const renderActiveFilters = () => {
    if (!appliedFilters) return null;
    
    const activeFilters = [];
    
    if (filters.status) {
      activeFilters.push(
        <ActiveFilterBadge key="status">
          Status: {getStatusNameById(filters.status)}
          <span className="close" onClick={() => {
            setFilters(prev => ({ ...prev, status: "" }));
            applyFilters();
          }}>×</span>
        </ActiveFilterBadge>
      );
    }
    
    if (filters.sku) {
      activeFilters.push(
        <ActiveFilterBadge key="sku">
          SKU: {filters.sku}
          <span className="close" onClick={() => {
            setFilters(prev => ({ ...prev, sku: "" }));
            applyFilters();
          }}>×</span>
        </ActiveFilterBadge>
      );
    }
    
    if (filters.numero_pedido) {
      activeFilters.push(
        <ActiveFilterBadge key="numero_pedido">
          Número do Pedido: {filters.numero_pedido}
          <span className="close" onClick={() => {
            setFilters(prev => ({ ...prev, numero_pedido: "" }));
            applyFilters();
          }}>×</span>
        </ActiveFilterBadge>
      );
    }
    
    if (filters.data_especifica) {
      activeFilters.push(
        <ActiveFilterBadge key="data_especifica">
          Data: {new Date(filters.data_especifica).toLocaleDateString('pt-BR')}
          <span className="close" onClick={() => {
            setFilters(prev => ({ ...prev, data_especifica: "" }));
            applyFilters();
          }}>×</span>
        </ActiveFilterBadge>
      );
    } else {
      if (filters.data_inicio) {
        activeFilters.push(
          <ActiveFilterBadge key="data_inicio">
            Data Início: {new Date(filters.data_inicio).toLocaleDateString('pt-BR')}
            <span className="close" onClick={() => {
              setFilters(prev => ({ ...prev, data_inicio: "" }));
              applyFilters();
            }}>×</span>
          </ActiveFilterBadge>
        );
      }
      
      if (filters.data_fim) {
        activeFilters.push(
          <ActiveFilterBadge key="data_fim">
            Data Fim: {new Date(filters.data_fim).toLocaleDateString('pt-BR')}
            <span className="close" onClick={() => {
              setFilters(prev => ({ ...prev, data_fim: "" }));
              applyFilters();
            }}>×</span>
          </ActiveFilterBadge>
        );
      }
    }
    
    if (activeFilters.length === 0) {
      return null;
    }
    
    return (
      <ActiveFiltersContainer>
        <span className="title">Filtros ativos:</span>
        {activeFilters}
        <Button size="sm" variant="outline-secondary" onClick={clearFilters}>
          <FontAwesomeIcon icon={faTimes} /> Limpar todos
        </Button>
      </ActiveFiltersContainer>
    );
  };

  const columns = [
    {
      header: (
        <input 
          type="checkbox" 
          checked={selectedPedidos.length > 0 && selectedPedidos.length === pedidos.length}
          onChange={handleSelectAll} 
        />
      ),
      accessor: "select",
      width: "40px",
      render: (row) => (
        <CheckboxContainer>
          <input 
            type="checkbox" 
            checked={selectedPedidos.includes(row.id)} 
            onChange={() => handleSelectPedido(row.id)}
          />
        </CheckboxContainer>
      )
    },
    { 
      header: "Número", 
      accessor: "numero_pedido",
      render: (row) => `#${row.numero_pedido}` 
    },
    { header: "Nome", accessor: "nome_cliente" },
    { header: "SKU", accessor: "sku" },
    { 
      header: "Data Emissão", 
      accessor: "criado_em",
      render: (row) => formatDate(row.criado_em)
    },
    { 
      header: "Status", 
      accessor: "status_nome",
      render: (row) => (
        <BadgeContainer>
          <StatusBadge 
            bgColor={row.status_cor ? `${row.status_cor}20` : "#e0e0e0"} 
            color={row.status_cor || "#333"}
          >
            {row.status_nome || "-"}
          </StatusBadge>
        </BadgeContainer>
      )
    },
    {
      header: "Ações",
      accessor: "id",
      render: (row) => (
        <ActionButtons>
          <ViewButton 
            variant="primary" 
            onClick={() => handleViewDetails(row)}
          >
            Ver Detalhes
          </ViewButton>
          <StatusButton 
            variant="success" 
            onClick={() => {
              setSelectedPedido(row);
              setShowStatusModal(true);
            }}
          >
            Status
          </StatusButton>
        </ActionButtons>
      )
    }
  ];

  const renderDetailItem = (label, value) => {
    if (value === null || value === undefined) {
      value = "-";
    }
    
    // Verificar se é uma URL de imagem
    const isImageUrl = typeof value === 'string' && 
      (value.endsWith('.jpg') || value.endsWith('.jpeg') || 
       value.endsWith('.png') || value.endsWith('.gif') ||
       value.startsWith('http') && (value.includes('/images/') || value.includes('/design/')));
    
    return (
      <DetailRow>
        <DetailLabel>{label}</DetailLabel>
        <DetailValue>
          {isImageUrl ? (
            <>
              <a href={value} target="_blank" rel="noopener noreferrer">{value}</a>
              <ImagePreview src={value} alt={label} />
            </>
          ) : value}
        </DetailValue>
      </DetailRow>
    );
  };

  return (
    <MainLayout>
      <PageHeader>
        <PageTitle>Listagem de Pedidos</PageTitle>
        <Button 
          variant="outline-secondary"
          onClick={() => setShowFilters(!showFilters)}
        >
          <FontAwesomeIcon icon={faFilter} /> Filtros
          {appliedFilters && <FilterBadge>!</FilterBadge>}
        </Button>
      </PageHeader>

      {/* Área de Filtros */}
      <FilterContainer style={{ display: showFilters ? 'block' : 'none' }}>
        <FilterHeader expanded={true}>
          <FilterTitle>
            <FontAwesomeIcon icon={faFilter} /> Filtrar Pedidos
          </FilterTitle>
        </FilterHeader>
        <FilterBody show={true}>
          <Form>
            <FilterRow>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Status</Form.Label>
                  <Form.Select 
                    name="status"
                    value={filters.status}
                    onChange={handleFilterChange}
                  >
                    <option value="">Todos os status</option>
                    {statusList.map((status) => (
                      <option key={status.id} value={status.id}>
                        {status.nome}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>SKU do Produto</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Digite o SKU" 
                    name="sku"
                    value={filters.sku}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Número do Pedido</Form.Label>
                  <Form.Control 
                    type="text" 
                    placeholder="Digite o número" 
                    name="numero_pedido"
                    value={filters.numero_pedido}
                    onChange={handleFilterChange}
                  />
                </Form.Group>
              </Col>
            </FilterRow>
            <FilterRow>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Data Específica</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="data_especifica"
                    value={filters.data_especifica}
                    onChange={handleFilterChange}
                    disabled={filters.data_inicio || filters.data_fim}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Data Início</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="data_inicio"
                    value={filters.data_inicio}
                    onChange={handleFilterChange}
                    disabled={filters.data_especifica}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Data Fim</Form.Label>
                  <Form.Control 
                    type="date" 
                    name="data_fim"
                    value={filters.data_fim}
                    onChange={handleFilterChange}
                    disabled={filters.data_especifica}
                  />
                </Form.Group>
              </Col>
            </FilterRow>
            <FilterActions>
              <Button variant="secondary" onClick={clearFilters}>
                <FontAwesomeIcon icon={faTimes} /> Limpar Filtros
              </Button>
              <Button variant="primary" onClick={applyFilters}>
                <FontAwesomeIcon icon={faSearch} /> Aplicar Filtros
              </Button>
            </FilterActions>
          </Form>
        </FilterBody>
      </FilterContainer>

      {renderActiveFilters()}

      <Card>
        <CardHeader>
          <CardTitle>Pedidos Recebidos</CardTitle>
        </CardHeader>
        
        {selectedPedidos.length > 0 && (
          <BatchActionBar>
            <span>{selectedPedidos.length} pedido(s) selecionado(s)</span>
            <select 
              className="form-select form-select-sm" 
              value={selectedStatusBatch}
              onChange={(e) => setSelectedStatusBatch(e.target.value)}
            >
              <option value="">Selecione um status...</option>
              {statusList.map((status) => (
                <option key={status.id} value={status.id}>
                  {status.nome}
                </option>
              ))}
            </select>
            <Button 
              variant="primary" 
              size="sm"
              onClick={updatePedidosBatchStatus}
              disabled={!selectedStatusBatch || statusUpdateLoading}
            >
              {statusUpdateLoading ? "Atualizando..." : "Atualizar status"}
            </Button>
          </BatchActionBar>
        )}
        
        {loading ? (
          <div style={{ padding: "1rem" }}>Carregando...</div>
        ) : (
          <Table columns={columns} data={pedidos} />
        )}
      </Card>

      {/* Modal de Detalhes do Pedido */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedPedido ? `Detalhes do Pedido #${selectedPedido.numero_pedido}` : "Detalhes do Pedido"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '80vh', overflowY: 'auto' }}>
          {detailsLoading && (
            <div style={{ textAlign: 'center', padding: '1rem' }}>
              <p>Carregando detalhes completos...</p>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Carregando...</span>
              </div>
            </div>
          )}
          {selectedPedido && (
            <>
              <DetailSection>
                <h5>Informações Principais</h5>
                {renderDetailItem("Título", selectedPedido.titulo)}
                {renderDetailItem("Número do Pedido", selectedPedido.numero_pedido)}
                {renderDetailItem("Valor do Pedido", formatCurrency(selectedPedido.valor_pedido))}
                {renderDetailItem("Custo de Envio", selectedPedido.custo_envio ? formatCurrency(selectedPedido.custo_envio) : "-")}
                {renderDetailItem("Método de Envio", selectedPedido.metodo_envio)}
                {renderDetailItem("Status", selectedPedido.status_nome)}
                {renderDetailItem("Data de Criação", formatDate(selectedPedido.criado_em))}
                {renderDetailItem("Última Atualização", formatDate(selectedPedido.atualizado_em))}
                {selectedPedido.pdf_path && renderDetailItem("PDF", selectedPedido.pdf_path)}
                {selectedPedido.etiqueta_envio && renderDetailItem("Etiqueta de Envio", selectedPedido.etiqueta_envio)}
              </DetailSection>

              <DetailSection>
                <h5>Cliente</h5>
                {renderDetailItem("Nome", selectedPedido.nome_cliente)}
                {renderDetailItem("Documento", selectedPedido.documento_cliente)}
                {renderDetailItem("Email", selectedPedido.email_cliente)}
              </DetailSection>

              <DetailSection>
                <h5>Destinatário</h5>
                {renderDetailItem("Nome", selectedPedido.nome_destinatario)}
                {renderDetailItem("Endereço", `${selectedPedido.endereco}, ${selectedPedido.numero}`)}
                {selectedPedido.complemento && renderDetailItem("Complemento", selectedPedido.complemento)}
                {renderDetailItem("Bairro", selectedPedido.bairro)}
                {renderDetailItem("Cidade", selectedPedido.cidade)}
                {renderDetailItem("UF", selectedPedido.uf)}
                {renderDetailItem("CEP", selectedPedido.cep)}
                {renderDetailItem("País", selectedPedido.pais)}
                {renderDetailItem("Telefone", selectedPedido.telefone_destinatario)}
              </DetailSection>

              <DetailSection>
                <h5>Informações Adicionais</h5>
                {renderDetailItem("Nome", selectedPedido.nome_info_adicional)}
                {renderDetailItem("Telefone", selectedPedido.telefone_info_adicional)}
                {renderDetailItem("Email", selectedPedido.email_info_adicional)}
              </DetailSection>

              <DetailSection>
                <h5>Produto</h5>
                {renderDetailItem("Nome", selectedPedido.nome_produto)}
                {renderDetailItem("SKU", selectedPedido.sku)}
                {renderDetailItem("ID SKU", selectedPedido.id_sku)}
                {renderDetailItem("Quantidade", selectedPedido.quantidade)}
                {selectedPedido.arquivo_pdf_produto && renderDetailItem("Arquivo PDF", selectedPedido.arquivo_pdf_produto)}
              </DetailSection>

              <DetailSection>
                <h5>Design</h5>
                {renderDetailItem("Capa Frente", selectedPedido.design_capa_frente)}
                {selectedPedido.design_capa_verso && renderDetailItem("Capa Verso", selectedPedido.design_capa_verso)}
              </DetailSection>

              <DetailSection>
                <h5>Mockup</h5>
                {renderDetailItem("Mockup Frente", selectedPedido.mockup_capa_frente)}
                {selectedPedido.mockup_capa_costas && renderDetailItem("Mockup Costas", selectedPedido.mockup_capa_costas)}
              </DetailSection>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fechar
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal para alteração de status */}
      <Modal show={showStatusModal} onHide={() => setShowStatusModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            Alterar Status do Pedido {selectedPedido && `#${selectedPedido.numero_pedido}`}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Selecione o novo status para o pedido:</p>
          <select 
            className="form-select" 
            onChange={(e) => setSelectedStatusBatch(e.target.value)}
            value={selectedStatusBatch}
          >
            <option value="">Selecione...</option>
            {statusList.map((status) => (
              <option key={status.id} value={status.id}>
                {status.nome}
              </option>
            ))}
          </select>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowStatusModal(false)}>
            Cancelar
          </Button>
          <Button 
            variant="success" 
            onClick={async () => {
              if (!selectedStatusBatch) {
                alert("Selecione um status");
                return;
              }
              
              const success = await updatePedidoStatus(selectedPedido.id, selectedStatusBatch);
              if (success) {
                setShowStatusModal(false);
                setSelectedStatusBatch("");
              }
            }}
            disabled={statusUpdateLoading}
          >
            {statusUpdateLoading ? "Atualizando..." : "Confirmar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </MainLayout>
  );
};

export default WebhookList;
