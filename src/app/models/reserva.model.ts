export interface ItemReserva {
  assento_codigo: string;
}

export interface Reserva {
  id: number;
  data_reserva: string;
  status: 'pendente' | 'confirmada' | 'cancelada' | 'expirada';
  valor_total: number;
  metodo_pagamento: string;
  usuario_id: number;
  sessao_id: number;
  itens: ItemReserva[];
}

export type ReservaCreate = Omit<Reserva, 'id'>;
