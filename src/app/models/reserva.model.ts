export interface ItemReserva {
  item_id: number;
  tipo: 'assento' | 'produto';
  quantidade: number;
  preco_unitario: number;
  preco_total: number;
  desconto: number;
}

export interface Reserva {
  id: number;
  data_reserva: string;
  status: 'pendente' | 'confirmada' | 'cancelada' | 'expirada';
  valor_total: number;
  metodo_pagamento: string;
  usuario_id: number;
  sessao_id: number;
  itens: any[];
}

export type ReservaCreate = Omit<Reserva, 'id'>;
