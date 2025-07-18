export interface PagamentoCreate {
  reserva_id: number;
  metodo: string;
  valor: number;
}

export interface Pagamento {
  id: number;
  reserva_id: number;
  metodo: string;
  valor: number;
  status: string;
  dt_pagamento: string | null;
}