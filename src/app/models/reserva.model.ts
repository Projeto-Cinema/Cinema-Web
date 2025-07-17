export interface ItemReserva {
  assento_codigo: string;
}

export type ReservaCreate = {
  status: 'pendente' | 'confirmada' | 'cancelada' | 'expirada';
  valor_total: number;
  metodo_pagamento: string;
  usuario_id: number;
  sessao_id: number;
  itens: ItemReserva[];
}

export interface Reserva extends ReservaCreate {
  id: number;
  data_reserva: string;
}
